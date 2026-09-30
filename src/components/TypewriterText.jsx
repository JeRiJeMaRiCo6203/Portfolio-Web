import { useState, useEffect } from 'react';

const TypewriterText = ({ strings = [], typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000 }) => {
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (strings.length === 0) return;

    const currentFullString = strings[currentStringIndex];

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimeout);
    }

    if (!isDeleting) {
      // Typing
      if (currentText.length < currentFullString.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentFullString.slice(0, currentText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, pause before deleting
        setIsPaused(true);
      }
    } else {
      // Deleting
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deletingSpeed);
        return () => clearTimeout(timeout);
      } else {
        // Finished deleting, move to next string
        setIsDeleting(false);
        setCurrentStringIndex((prev) => (prev + 1) % strings.length);
      }
    }
  }, [currentText, isDeleting, isPaused, currentStringIndex, strings, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className="typewriter-text">
      {currentText}
      <span className="typewriter-cursor">|</span>
    </span>
  );
};

export default TypewriterText;
