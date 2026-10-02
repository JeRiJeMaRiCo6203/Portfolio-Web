import React, { useState } from 'react';
import './index.css';
import './App.css';
import ParticlesBackground from './components/particlesBackground';
import ScrollReveal from './components/ScrollReveal';
import TypewriterText from './components/TypewriterText';
import Greeting3D from './components/Greeting3D';
import ProjectCarousel from './components/ProjectCarousel';
import CategorySelector from './components/CategorySelector';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import GreetingDonut from './components/GreetingDonut';
import LoadingScreen from './components/LoadingScreen';

// ─── Helper: assign a tag color class based on keyword ──────────────
const getTagClass = (tag) => {
  const t = tag.toLowerCase();
  if (t.includes('html')) return 'tag-html';
  if (t.includes('css')) return 'tag-css';
  if (t.includes('javascript') || t.includes('js')) return 'tag-javascript';
  if (t.includes('laravel')) return 'tag-laravel';
  if (t.includes('php')) return 'tag-php';
  if (t.includes('sql') || t.includes('mysql') || t.includes('postgresql') || t.includes('postgres') || t.includes('database')) return 'tag-sql';
  if (t.includes('xcode') || t.includes('swift') || t.includes('ios')) return 'tag-xcode';
  if (t.includes('java') || t.includes('javafx') || t.includes('java fx')) return 'tag-java';
  return 'tag-default';
};

// ─── Projects Data ──────────────────────────────────────────────────
const personalProjects = [
  {
    id: 1,
    name: 'Layzy',
    tags: ['React', 'Express.js', 'TailwindCSS', 'PostgreSQL', 'Node.js', 'TypeScript', 'HTML'],
    description: 'Minimalist Component Wireframe Library to ease web developer workflow for creating clean and optimized UI/UX design. (Group Thesis Project for University)',
    link: 'https://github.com/JeRiJeMaRiCo6203/ComponentWireframeLibrary',
    image: '/assets/Layzy.png',
  },
  {
    id: 2,
    name: 'The Herb Shop',
    tags: ['PHP', 'Laravel', 'Blade-HTML', 'MySQL', 'CSS', 'JavaScript'],
    description: 'E-commerce Website for flower products with cart and checkout functionality. (Group Project for University)',
    link: 'https://github.com/JeRiJeMaRiCo6203/theHerbShop',
    image: '/assets/herb.png',
  },
  {
    id: 3,
    name: 'Food List App (SwiftUI)',
    tags: ['Swift', 'SwiftUI', 'Xcode'],
    description: 'A simple iOS app built with SwiftUI to display a list of food items. (Individual Project)',
    link: 'https://github.com/JeRiJeMaRiCo6203/SwiftUI-Food-List-App',
    image: '/assets/food.png',
  },
  {
    id: 4,
    name: 'Yamada Motors',
    tags: ['HTML', 'CSS', 'JavaScript'],
    description: 'Motorcycle dealership website featuring vehicle catalog with responsive design and basic interactivity. (Individual Project for University)',
    link: 'https://github.com/JeRiJeMaRiCo6203/yamadamotors.com',
    image: '/assets/yamada.png',
  },
  {
    id: 5,
    name: 'Farbucks',
    tags: ['HTML', 'CSS', 'JavaScript'],
    description: 'A coffee shop landing page with responsive design and basic interactivity. (Group Project for University)',
    link: 'https://github.com/JeRiJeMaRiCo6203/farbuckscoffee.com',
    image: '/assets/farbucks.png',
  },
  {
    id: 6,
    name: 'Medicare',
    tags: ['HTML', 'CSS', 'JavaScript'],
    description: 'A Healthcare landing page with responsive design and basic interactivity. (Test Project for Job Application)',
    link: 'https://github.com/JeRiJeMaRiCo6203/Medicare.com',
    image: '/assets/medicare.png',
  },
  {
    id: 7,
    name: 'Mahakarya',
    tags: ['PHP', 'CodeIgniter', 'HTML', 'CSS', 'JavaScript'],
    description: 'A Website showcasing art and design works. (Group Project for University)',
    link: 'https://github.com/JeRiJeMaRiCo6203/Mahakarya.com',
    image: '/assets/mahakarya.png',
  },
  {
    id: 8,
    name: 'Legho',
    tags: ['Java', 'JavaFX'],
    description: 'Desktop application built with JavaFX featuring modern UI patterns. (Group Project for University)',
    link: 'https://github.com/JeRiJeMaRiCo6203/Legho',
    image: '/assets/legho.png',
  },
  
  
  // {
  //   id: 7,
  //   name: 'Trinity',
  //   tags: ['Web', 'HTML', 'CSS', 'JavaScript'],
  //   description: '',
  //   link: '#',
  //   image: '/assets/trinity.png',
  // },
  
];

const workProjects = [
  {
    id: 9,
    name: 'Cody',
    tags: ['AI', 'WhatsApp', 'Chatbot'],
    description: 'WhatsApp Generative AI Chatbot for automated customer support and engagement.',
    link: '#',
    image: '/assets/cody.png',
  },
];

// ─── Project Card Component ─────────────────────────────────────────
const ProjectCard = ({ project }) => (
  <div className="project-card">
    <div className="project-card-header">
      <a
        href={project.link}
        target="_blank"
        rel="noreferrer"
        className="project-card-arrow"
        aria-label={`View ${project.name}`}
      >
        ↗
      </a>
      <img
        src={project.image}
        alt={project.name}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x160?text=' + project.name;
        }}
      />
    </div>
    <div className="project-card-body">
      <h4>{project.name}</h4>
      <div className="project-card-tags">
        {project.tags.map((tag) => (
          <span key={tag} className={`project-tag ${getTagClass(tag)}`}>
            {tag}
          </span>
        ))}
      </div>
      <p className="project-card-desc">{project.description}</p>
    </div>
  </div>
);

// ─── Theme Toggle Button ────────────────────────────────────────────
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
        </svg>
      ) : (
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0-5l2.39 3.42a7.97 7.97 0 00-4.78 0L12 2zm10 10l-3.42 2.39a7.97 7.97 0 000-4.78L22 12zM12 22l-2.39-3.42a7.97 7.97 0 004.78 0L12 22zM2 12l3.42-2.39a7.97 7.97 0 000 4.78L2 12zm17.07-7.07l-.24 4.17a8.03 8.03 0 00-3.93-3.93l4.17-.24zM4.93 19.07l.24-4.17a8.03 8.03 0 003.93 3.93l-4.17.24zm14.14 0l-4.17-.24a8.03 8.03 0 003.93-3.93l4.17.24zM4.93 4.93l4.17.24a8.03 8.03 0 00-3.93 3.93l-4.17-.24z" />
        </svg>
      )}
    </button>
  );
};

// ─── Navbar ─────────────────────────────────────────────────────────
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = React.useRef(null);

  const handleNavClick = () => {
    // console.log('Nav link clicked, closing mobile menu');
    setMobileMenuOpen(false);
  };

  // Close on Escape key
  React.useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileMenuOpen]);

  // Close on outside click
  React.useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="navbar-container" ref={navRef}>
      <nav className="navbar-list">
        <ul
          id="mobile-nav"
          className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}
        >
          {/* <li><a href="#" onClick={handleNavClick}>Home</a></li> */}
          <li><a href="#about" onClick={handleNavClick}>About</a></li>
          <li><a href="#projects" onClick={handleNavClick}>Projects</a></li>
          <li><a href="#experience" onClick={handleNavClick}>Experience</a></li>
          <li><a href="#education" onClick={handleNavClick}>Education</a></li>
          <li><a href="#certifications" onClick={handleNavClick}>Certifications</a></li>
          <li><a href="#contact" onClick={handleNavClick}>Contact</a></li>
        </ul>
      </nav>
      <div className="navbar-actions">
        <ThemeToggle />
        <button
          className="burger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          <span className={`burger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`burger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
          <span className={`burger-line ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>
    </header>
  );
};

// ─── App ─────────────────────────────────────────────────────────────
const AppContent = () => {
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'grid'
  const [activeCategory, setActiveCategory] = useState('personal');
  const [carouselKey, setCarouselKey] = useState(0); // reset carousel on category change
  const [loading, setLoading] = useState(true);

  const currentProjects = activeCategory === 'personal' ? personalProjects : workProjects;

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCarouselKey((k) => k + 1); // force carousel reset to first slide
  };

  const handleLoadingComplete = () => {
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <>
      {/* Particles Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
        <ParticlesBackground />
      </div>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <Navbar />

      {/* ── Main Content ──────────────────────────────────── */}
      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="content" style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>

          {/* ── Hero / About ──────────────────────────────── */}
          <ScrollReveal>
            <div
              id="about"
              className="about section"
            >
              <div className="hero-section">
                <div className="hero-content">
                  <p className="hero-greeting">Hi!, I'm</p>
                  <h1 className="hero-name">JERICO ASAN</h1>
                  <p className="hero-role">
                    <TypewriterText
                      strings={[
                        'Salesforce Developer (Apex - LWC - Flows)',
                        'Chatbot Developer (Dify - 3Dolphins SRM)',
                        'UI/UX Designer',
                        'Web Developer'
                      ]}
                      typingSpeed={80}
                      deletingSpeed={40}
                      pauseDuration={2000}
                    />
                  </p>
                  <p className="hero-description">
                    Full stack developer crafting Salesforce CRM solutions, REST APIs, Web Apps, and Generative AI chatbots engineered around real business needs that make enterprise work simpler.
                  </p>
                  <div className="hero-actions">
                    <a href="/assets/Jerico Asan_CV.pdf" download className="download-cv-btn">
                      ↓ Download CV
                    </a>
                    <a href="#contact" className="get-in-touch-btn">
                      Get In Touch with Me
                    </a>
                  </div>
                </div>
                <div className="hero-visual">
                  <Greeting3D />
                  {/* <GreetingDonut /> */}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Projects ──────────────────────────────────── */}
          <ScrollReveal>
            <div id="projects" className="section">
              <h2 className="section-title">PROJECTS</h2>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                <CategorySelector
                  value={activeCategory}
                  onChange={handleCategoryChange}
                />
              </div>

              {currentProjects.length === 0 ? (
                <div className="projects-empty">
                  <p>No projects here yet — check back soon!</p>
                </div>
              ) : viewMode === 'carousel' ? (
                <ProjectCarousel
                  key={carouselKey}
                  projects={currentProjects}
                  CardComponent={ProjectCard}
                />
              ) : (
                /* Original grid — preserved exactly as before */
                <div className="projects-grid">
                  {currentProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              )}

              {currentProjects.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                  <button
                    className="view-toggle-btn"
                    onClick={() => setViewMode(viewMode === 'carousel' ? 'grid' : 'carousel')}
                  >
                    {viewMode === 'carousel' ? '⊞ Show all' : '◧ Show carousel'}
                  </button>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* ── Experience ────────────────────────────────── */}
          <ScrollReveal>
            <div id="experience" className="section">
              <h2 className="section-title">EXPERIENCE</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '24px' }}>
                <div className="info-card">
                  <img src="/assets/binovara.png" alt="" className="logo-badge" />
                  <div className="info-card-content">
                    <h3>PT. Bina Inovasi Global (IT Division Bina Nusantara)</h3>
                    <p><b>Role</b> — Junior Programmer</p>
                    <p>2024 - Present</p>
                  </div>
                </div>
                <div className="info-card">
                  <img src="/assets/itdiv.png" alt="" className="logo-badge" />
                  <div className="info-card-content">
                    <h3>IT Division Bina Nusantara</h3>
                    <p><b>Role</b> — Associate Member</p>
                    <p>2023 - 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Education ─────────────────────────────────── */}
          <ScrollReveal>
            <div id="education" className="section">
              <h2 className="section-title">EDUCATION</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '24px' }}>
                <div className="info-card">
                  <img src="/assets/binus.png" alt="" className="logo-badge" />
                  <div className="info-card-content">
                    <h3>Binus University</h3>
                    <p><b>Major</b> — Bachelor of Computer Science</p>
                    <p>2021 - 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* ── Certifications ────────────────────────────── */}
          <ScrollReveal>
            <div id="certifications" className="section">
              <h2 className="section-title">CERTIFICATIONS</h2>
              <ul className="cert-list">
                <li>
                  <span>🏅  Microsoft Azure AI Fundamental (AI-900)</span>
                  <img src="/assets/microsoft.jpg" alt="" className="logo-badge" />
                </li>
                <li>
                  <span>🏅  Salesforce Certified Agentforce Specialist</span>
                  <img src="/assets/sf.png" alt="" className="logo-badge" />
                </li>
                <li>
                  <span>🏅  Salesforce Certified AI Associate</span>
                  <img src="/assets/sf.png" alt="" className="logo-badge" />
                </li>
                <li>
                  <span>🏅  HSK IV</span>
                  <img src="/assets/hsk.png" alt="" className="logo-badge" />
                </li>
                <li>
                  <span>🏅  HSK III</span>
                  <img src="/assets/hsk.png" alt="" className="logo-badge" />
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* ── Contact ───────────────────────────────────── */}
          <ScrollReveal>
            <div id="contact" className="section" style={{ marginBottom: '40px' }}>
              <h2 className="section-title">CONTACT / SEND MAIL</h2>
              <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
                Have a question or want to collaborate?
              </p>
              <div className="contact-wrapper" style={{ marginTop: '20px' }}>
                <iframe src="https://jericoasan.notion.site/ebd//3d61b9e6232880d49293f9e823eca467" width="100%" height="600" frameborder="0" allowfullscreen />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="footer">
        {/* Top — 4-column layout */}
        <div className="footer-main">
          <div className="footer-brand">
            <h2>Jerico Asan</h2>
            <p>Salesforce Developer — Chatbot Developer<br/>UI/UX Designer — Web Developer</p>
          </div>

          <div className="footer-col">
            <h3>Contacts</h3>
            <ul>
              <li><a href="https://wa.me/6281281475463" target="_blank" rel="noreferrer">Whatsapp</a></li>
              {/* <li><a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram</a></li> */}
              <li><a href="mailto:jericoasan@gmail.com">Gmail</a></li>
              <li><a href="https://discord.com/" target="_blank" rel="noreferrer">Discord</a></li>
              {/* <li><a href="https://www.linkedin.com/in/jerico-asan-s-kom-8283381b8/" target="_blank" rel="noreferrer">LinkedIn</a></li> */}
            </ul>
          </div>

          <div className="footer-col">
            <h3>Portfolio</h3>
            <ul>
              {/* <li><a href="https://notion.so/" target="_blank" rel="noreferrer">Notion</a></li> */}
              <li><a href="https://www.behance.net/jericoasan" target="_blank" rel="noreferrer">Behance</a></li>
              <li><a href="https://www.salesforce.com/trailblazer/jsan29" target="_blank" rel="noreferrer">Trailhead</a></li>
              <li><a href="/assets/Jerico Asan_CV.pdf" download>CV</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Navigation</h3>
            <ul>
              {/* <li><a href="#">Home</a></li> */}
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#education">Education</a></li>
              {/* <li><a href="#certifications">Tools & Skills</a></li> */}
            </ul>
          </div>
        </div>

        {/* Bottom — social icons + copyright */}
        <div className="footer-bottom">
          <div className="footer-social">
            <a href="https://github.com/JeRiJeMaRiCo6203" target="_blank" rel="noreferrer" aria-label="GitHub">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/jerico-asan-s-kom-8283381b8/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://www.youtube.com/@jericoasan7879" target="_blank" rel="noreferrer" aria-label="YouTube">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://instagram.com/jericoasan" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
          <p className="footer-copyright">© 2026 Jerico Asan</p>
        </div>
      </footer>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
