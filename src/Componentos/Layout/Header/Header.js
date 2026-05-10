import React, { useState, useEffect } from 'react';
import { FiShoppingBag, FiUser, FiX } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import { useCart } from '../../../Context/CartContext';
import { useAuth } from '../../../Context/AuthContext';
import { useLang } from '../../../Context/LangContext';

import LangSwitcher from './LangSwitcher';
import CartDrawer from './CartDrawer';
import ProfileDrawer from './ProfileDrawer';
import MobileMenu from './MobileMenu';
import logo from '../../../Assets/FIMODA-logo-4X.jpg';
import '../../../Style/Header.css';

export default function Header() {
  const { totalItems } = useCart();
  const { isLoggedIn } = useAuth();
  const { t } = useLang();
  const location = useLocation();

  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Drawer ochilganda scroll qotirish
  useEffect(() => {
    const anyOpen = cartOpen || profileOpen || mobileOpen;
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartOpen, profileOpen, mobileOpen]);

  // Sahifa o'zgarganda hamma narsani yopish
  useEffect(() => {
    setCartOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  function toggleCart() {
    setCartOpen((p) => !p);
    setProfileOpen(false);
    setMobileOpen(false);
  }

  function toggleProfile() {
    setProfileOpen((p) => !p);
    setCartOpen(false);
    setMobileOpen(false);
  }

  function toggleMobile() {
    setMobileOpen((p) => !p);
    setCartOpen(false);
    setProfileOpen(false);
  }

  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/dizayn', label: t('nav.design') },
    { href: '/dokon', label: t('nav.shop') },
    { href: '/mahsulotlar', label: t('nav.products') },
  ];

  return (
    <>
      <header className="header">
        {/* LOGO */}
        <a href="/" className="logo">
          <img src={logo} alt="Fimoda" className="logo-img" />
          <span className="logo-text">Fimoda</span>
        </a>

        {/* DESKTOP NAV — markazda */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={location.pathname === item.href ? 'active' : ''}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* O'NG TOMON: til + ikonkalar */}
        <div className="header-actions">
          {/* Til — faqat desktop */}
          <div className="desktop-only">
            <LangSwitcher />
          </div>

          <div className="header-divider desktop-only" />

          {/* SAVAT TUGMASI */}
          <button
            className={`icon-btn ${cartOpen ? 'icon-btn--active' : ''}`}
            onClick={toggleCart}
            aria-label={t('cart.title')}
          >
            {cartOpen ? <FiX size={18} /> : <FiShoppingBag size={18} />}
            {!cartOpen && totalItems > 0 && (
              <span className="icon-badge">{totalItems > 9 ? '9+' : totalItems}</span>
            )}
          </button>

          {/* PROFIL TUGMASI */}
          <button
            className={`icon-btn ${profileOpen ? 'icon-btn--active' : ''} ${isLoggedIn ? 'icon-btn--logged' : ''}`}
            onClick={toggleProfile}
            aria-label={t('profile.title')}
          >
            {profileOpen ? <FiX size={18} /> : <FiUser size={18} />}
          </button>

          {/* MOBILE hamburger */}
          <div className="mobile-only">
            <MobileMenu
              open={mobileOpen}
              onToggle={toggleMobile}
              activeNav={location.pathname}
            />
          </div>
        </div>
      </header>

      {/* CART DRAWER */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* PROFILE DRAWER */}
      <ProfileDrawer open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
