import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Config ─────────────────────────────────────────────────────────
const CAROUSEL_INTERVAL_MS = 6000;    // auto-advance every 6s
const CAROUSEL_TRANSITION_S = 1;     // 1s transition
const SWIPE_THRESHOLD = 50;            // px drag to trigger swipe

// ─── Check prefers-reduced-motion ───────────────────────────────────
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Slide variants for framer-motion ───────────────────────────────
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

const reducedVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const ProjectCarousel = ({ projects, CardComponent }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  const containerRef = useRef(null);

  const total = projects.length;

  // ─── Navigation helpers ─────────────────────────────────────────
  const goTo = useCallback((index, dir) => {
    setDirection(dir);
    setCurrentIndex(((index % total) + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % total);
  }, [total]);
  
  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  // ─── Auto-advance ───────────────────────────────────────────────
  useEffect(() => {
    if (isPaused || reduced || total <= 1) return;

    const id = setInterval(goNext, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPaused, reduced, total, goNext]);

  // ─── Pause on tab hidden ───────────────────────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // ─── Keyboard navigation ───────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
  };

  // ─── Swipe via drag ────────────────────────────────────────────
  const handleDragEnd = (_e, info) => {
    if (info.offset.x < -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
  };

  // ─── Pause/resume handlers ─────────────────────────────────────
  const pause = () => setIsPaused(true);
  const resume = () => setIsPaused(false);

  if (total === 0) return null;

  const variants = reduced ? reducedVariants : slideVariants;
  const transition = reduced
    ? { duration: 0.15 }
    : { duration: CAROUSEL_TRANSITION_S, ease: [0.25, 0.1, 0.25, 1] };

  return (
    <div
      className="project-carousel"
      ref={containerRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Project carousel"
      onKeyDown={handleKeyDown}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
    >
      {/* Prev/Next arrows */}
      <button
        className="carousel-arrow carousel-arrow--prev"
        onClick={goPrev}
        aria-label="Previous project"
      >
        ‹
      </button>

      <div className="carousel-viewport">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            className="carousel-slide"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <CardComponent project={projects[currentIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        className="carousel-arrow carousel-arrow--next"
        onClick={goNext}
        aria-label="Next project"
      >
        ›
      </button>
      
      {/* Pagination dots */}
      <div className="carousel-dots" role="tablist" aria-label="Carousel pagination">
        {projects.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === currentIndex ? 'active' : ''}`}
            onClick={() => goTo(i, i > currentIndex ? 1 : -1)}
            role="tab"
            aria-selected={i === currentIndex}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectCarousel;
