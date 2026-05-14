import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigation } from '../../context/NavigationContext';
import bgGnav from '../../assets/bg_gnav.png';
import cmnLogo from '../../assets/cmn_logo.svg';
import type { SupportedLanguage } from '../../types';

const languages: { code: SupportedLanguage; label: string }[] = [
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'en-US', label: 'English' },
  { code: 'ja-JP', label: '日本語' },
];

export function NavBar() {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { goHome, goToAbout } = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    goHome();
    setIsMenuOpen(false);
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    goToAbout();
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: t('nav.home', 'HOME'), onClick: handleHomeClick },
    { label: t('nav.about', 'ABOUT'), onClick: handleAboutClick },
  ];

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <nav className="nav-overlay">
      <div className="nav-container">
        <div className="nav-logo">
          <a href="#" onClick={handleHomeClick}>
            <img src={cmnLogo} alt="BEYBLADE X" className="nav-logo-img" />
          </a>
        </div>
        
        <div className="nav-actions">
          <button 
            className="nav-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${isMenuOpen ? 'open' : ''}`} aria-hidden="true">
              <span></span>
            </span>
          </button>
        </div>

        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          {navItems.map((item, index) => (
            <li key={index}>
              <a href="#" onClick={item.onClick}>{item.label}</a>
            </li>
          ))}
          <li className="nav-lang-item">
            <div className="nav-lang-dropdown">
              <button 
                className="nav-lang-toggle"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              >
                <span className="nav-lang-label">{currentLang.label}</span>
                <span className={`nav-lang-arrow ${isLangDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>
              {isLangDropdownOpen && (
                <ul className="nav-lang-menu">
                  {languages.map((lang) => (
                    <li key={lang.code}>
                      <button
                        className={`nav-lang-option ${currentLanguage === lang.code ? 'active' : ''}`}
                        onClick={() => {
                          changeLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                      >
                        <span className="nav-lang-label">{lang.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        </ul>
      </div>

      <style>{`
        .nav-overlay {
          visibility: hidden;
          position: fixed;
          width: 100%;
          height: 56px;
          background: url(${bgGnav}) no-repeat right top;
          background-size: cover;
          padding: 0;
          top: 0;
          right: 0;
          opacity: 0;
          z-index: 98;
          -webkit-overflow-scrolling: touch;
          transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        @media screen and (min-width: 668px) {
          .nav-overlay {
            visibility: visible;
            position: relative;
            width: 100%;
            height: 56px;
            background: url(${bgGnav}) no-repeat right top;
            background-size: cover;
            padding: 0;
            top: 0;
            right: 0;
            opacity: 1;
            box-shadow: 0px 0px 0 0 rgba(0, 0, 0, 0) inset;
            z-index: 98;
            -webkit-overflow-scrolling: touch;
          }
        }

        .nav-container {
          max-width: 1126px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 0 20px;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-logo a {
          color: #fff;
          text-decoration: none;
          font-weight: bold;
          font-size: 18px;
          letter-spacing: 2px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
        }

        .nav-logo-img {
          height: 32px;
          width: auto;
        }

        .nav-links {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 30px;
          align-items: center;
        }

        .nav-links a {
          color: #fff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 1px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          transition: opacity 0.2s ease;
          padding: 8px 0;
        }

        .nav-links a:hover {
          opacity: 0.8;
        }

        .nav-lang-item {
          list-style: none;
        }

        .nav-lang-dropdown {
          position: relative;
        }

        .nav-lang-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          color: #fff;
          font-size: 13px;
          transition: background 0.2s ease;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }

        .nav-lang-toggle:hover {
          background: rgba(0, 0, 0, 0.45);
        }

        .nav-lang-flag {
          font-size: 16px;
        }

        .nav-lang-label {
          font-weight: 500;
        }

        .nav-lang-arrow {
          font-size: 8px;
          transition: transform 0.2s ease;
          margin-left: 2px;
        }

        .nav-lang-arrow.open {
          transform: rotate(180deg);
        }

        .nav-lang-menu {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: rgba(20, 20, 40, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 8px 0;
          min-width: 140px;
          list-style: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 100;
        }

        .nav-lang-option {
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 10px 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: #fff;
          font-size: 13px;
          transition: background 0.2s ease;
          text-align: left;
        }

        .nav-lang-option:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .nav-lang-option.active {
          background: rgba(255, 255, 255, 0.15);
        }

        .nav-menu-toggle {
          display: none;
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 6px;
          cursor: pointer;
          padding: 10px;
          z-index: 100;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .nav-menu-toggle:hover {
          background: rgba(0, 0, 0, 0.45);
          transform: scale(1.05);
        }

        .nav-menu-toggle:active {
          transform: scale(0.95);
        }

        .hamburger {
          display: block;
          width: 24px;
          height: 18px;
          position: relative;
          transition: all 0.3s ease;
        }

        .hamburger::before,
        .hamburger::after,
        .hamburger span {
          content: '';
          display: block;
          position: absolute;
          width: 24px;
          height: 2px;
          background: #fff;
          left: 0;
          transition: all 0.3s ease;
          border-radius: 1px;
        }

        .hamburger::before {
          top: 0;
        }

        .hamburger span {
          top: 8px;
        }

        .hamburger::after {
          bottom: 0;
        }

        .hamburger.open::before {
          transform: translateY(8px) rotate(45deg);
        }

        .hamburger.open span {
          opacity: 0;
        }

        .hamburger.open::after {
          transform: translateY(-8px) rotate(-45deg);
        }

        @media screen and (max-width: 667px) {
          .nav-overlay {
            visibility: visible;
            opacity: 1;
          }

          .nav-menu-toggle {
            display: block;
          }

          .nav-links {
            position: fixed;
            top: 56px;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            flex-direction: column;
            padding: 20px;
            gap: 0;
            transform: translateY(-100%);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            pointer-events: none;
          }

          .nav-links.open {
            transform: translateY(0);
            opacity: 1;
            pointer-events: auto;
          }

          .nav-links li {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .nav-links a {
            display: block;
            padding: 15px 0;
            font-size: 16px;
          }

          .nav-lang-item {
            border-bottom: none !important;
          }

          .nav-lang-dropdown {
            width: 100%;
            padding: 15px 0;
          }

          .nav-lang-toggle {
            width: 100%;
            justify-content: center;
            padding: 12px 16px;
            font-size: 14px;
          }

          .nav-lang-menu {
            position: static;
            margin-top: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 8px;
          }

          .nav-lang-option {
            padding: 12px 16px;
            justify-content: center;
            font-size: 14px;
          }
        }
      `}</style>
    </nav>
  );
}
