import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import './Header.scss';

const Header = ({ language, onLanguageChange }) => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollToSection } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    scrollToSection(targetId);
  };

  return (
    <motion.header 
      className={`header ${scrolled ? 'header--scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="header__container">
        <div className="header__logo">
          <span className="header__logo-text">CINEMAX</span>
        </div>

        <nav className="header__nav">
          <a 
            href="#hero" 
            className="header__nav-link"
            data-nav-section="hero"
            onClick={(e) => handleNavClick(e, 'hero')}
          >
            Главная
          </a>
          <a 
            href="#movies" 
            className="header__nav-link"
            data-nav-section="movies"
            onClick={(e) => handleNavClick(e, 'movies')}
          >
            Фильмы
          </a>
          <a 
            href="#series" 
            className="header__nav-link"
            data-nav-section="series"
            onClick={(e) => handleNavClick(e, 'series')}
          >
            Сериалы
          </a>
        </nav>

        <div className="header__actions">
          <div className="header__lang-switcher">
            <button 
              className={`header__lang-btn ${language === 'ru-RU' ? 'active' : ''}`}
              onClick={() => onLanguageChange('ru-RU')}
            >
              RU
            </button>
            <span className="header__lang-divider">/</span>
            <button 
              className={`header__lang-btn ${language === 'en-US' ? 'active' : ''}`}
              onClick={() => onLanguageChange('en-US')}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;