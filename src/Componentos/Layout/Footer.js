import React from 'react';
import { FiInstagram, FiFacebook, FiTwitter, FiArrowUp } from 'react-icons/fi';
import '../../Style/Footer.css';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2 className="footer-logo">Fimoda</h2>
          <p className="footer-desc">
            Zamonaviy uslub va sifat uyg'unligi. Biz bilan har doim trendda bo'ling.
          </p>
          <div className="footer-socials">
            <a href="/"><FiInstagram /></a>
            <a href="/"><FiFacebook /></a>
            <a href="/"><FiTwitter /></a>
          </div>
        </div>

        <div className="footer-links">
          <div className="link-group">
            <h4>Xaridorlarga</h4>
            <a href="/">Yetkazib berish</a>
            <a href="/">To'lov usullari</a>
            <a href="/">Qaytarish</a>
          </div>
          <div className="link-group">
            <h4>Kompaniya</h4>
            <a href="/">Biz haqimizda</a>
            <a href="/">Do'konlar</a>
            <a href="/">Aloqa</a>
          </div>
        </div>

        <div className="footer-newsletter">
          <h4>Yangiliklar</h4>
          <p>Yangi to'plamlar haqida birinchilardan bo'lib biling.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Email manzilingiz" />
            <button>Yuborish</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Fimoda. Barcha huquqlar himoyalangan.</p>
        <button className="scroll-top" onClick={scrollToTop}>
          <FiArrowUp /> <span>Yuqoriga</span>
        </button>
      </div>
    </footer>
  );
}
