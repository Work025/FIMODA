import React from 'react';
import { FiX, FiMenu } from 'react-icons/fi';
import { useLang } from '../../../Context/LangContext';
import LangSwitcher from './LangSwitcher';
import '../../../Style/MobileMenu.css';

export default function MobileMenu({ open, onToggle, activeNav }) {
  const { t } = useLang();

  const navItems = [
    { href: '/', label: t('nav.home'), key: 'home' },
    { href: '/dizayn', label: t('nav.design'), key: 'design' },
    { href: '/dokon', label: t('nav.shop'), key: 'shop' },
    { href: '/mahsulotlar', label: t('nav.products'), key: 'products' },
  ];

  return (
    <>
      {/* Hamburger tugmasi */}
      <button
        className={`mobile-menu-btn ${open ? 'active' : ''}`}
        onClick={onToggle}
        aria-label={open ? 'Menyuni yopish' : 'Menyuni ochish'}
      >
        <FiMenu size={20} />
      </button>

      {/* Overlay */}
      {open && (
        <div className="mobile-overlay" onClick={onToggle} />
      )}

      {/* Yondan chiquvchi panel */}
      <div className={`mobile-nav-panel ${open ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <div className="mobile-nav-header-left">
            <span className="mobile-nav-title">Menu</span>
            <div className="mobile-lang-inline">
              <LangSwitcher />
            </div>
          </div>
          <button className="mobile-nav-close" onClick={onToggle}>
            <FiX size={18} />
          </button>
        </div>

        <nav className="mobile-nav-links">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={`mobile-nav-link ${activeNav === item.href ? 'active' : ''}`}
              onClick={onToggle}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Footer endi bo'sh bo'lishi mumkin yoki o'chirilishi mumkin */}
        <div className="mobile-nav-footer-minimal" />
      </div>
    </>
  );
}
