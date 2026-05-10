import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../Button/Button';
import { useLang } from '../../Context/LangContext';
import '../../Style/Hero.css';

import imgWhite from '../../Assets/Model1-all.png';
import imgBlack from '../../Assets/Model2-all.png';
import imgGray from '../../Assets/Model3-all.png';

const getSlides = (t) => [
  {
    id: 1,
    num: '01',
    eyebrow: 'Premium Paxta',
    name: ['Oq', 'Klassika'],
    info: t ? t('hero.slide1Info') : "Har kunlik qulaylik va nafislik uyg'unligi",
    price: '289 000 UZS',
    img: imgWhite,
  },
  {
    id: 2,
    num: '02',
    eyebrow: "Elegant Ko'rinish",
    name: ['Tungi', 'Qora'],
    info: t ? t('hero.slide2Info') : 'Maxsus uslub va chuqur qora rang jozibasi',
    price: '319 000 UZS',
    img: imgBlack,
  },
  {
    id: 3,
    num: '03',
    eyebrow: 'Yumshoq Mato',
    name: ['Kulrang', 'Essential'],
    info: t ? t('hero.slide3Info') : 'Mukammal sifat va zamonaviy urban stil',
    price: '299 000 UZS',
    img: imgGray,
  },
];

export default function Hero() {
  const { t } = useLang();
  const slides = getSlides(t);
  const [index, setIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef(null);

  function goTo(idx) {
    setIndex(idx);
    setAnimKey((k) => k + 1);
  }

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % slides.length;
        setAnimKey((k) => k + 1);
        return next;
      });
    }, 5000);
  }, [slides.length]);

  function resetTimer() {
    clearInterval(timerRef.current);
    startTimer();
  }

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  function handleDotClick(idx) {
    goTo(idx);
    resetTimer();
  }

  const slide = slides[index];
  const total = slides.length;

  return (
    <section className="hero">
      <div className="hero-inner">

        {/* ── CHAP USTUN: Slide raqami + Nav ── */}
        <div className="hero-aside">
          <div className="hero-counter">
            <span className="hero-cur">{String(index + 1).padStart(2, '0')}</span>
            <div className="hero-counter-line">
              <div
                key={animKey}
                className="hero-counter-fill"
                style={{ animationDuration: '5s' }}
              />
            </div>
            <span className="hero-total">{String(total).padStart(2, '0')}</span>
          </div>

          <nav className="hero-slide-nav">
            {slides.map((s, i) => (
              <button
                key={s.id}
                className={`hero-slide-nav-btn ${i === index ? 'active' : ''}`}
                onClick={() => handleDotClick(i)}
              >
                <span className="hero-slide-nav-num">{s.num}</span>
                <span className="hero-slide-nav-name">{s.name.join(' ')}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* ── O'RTA: Rasm ── */}
        <div className="hero-center">
          <div className="hero-eyebrow" key={`eyebrow-${animKey}`}>
            {slide.eyebrow}
          </div>
          <div className="hero-img-wrap">
            <img
              key={`img-${animKey}`}
              src={slide.img}
              alt={slide.name.join(' ')}
              className="hero-img"
            />
          </div>
        </div>

        {/* ── O'NG USTUN: Matn + CTA ── */}
        <div className="hero-content">
          <div className="hero-name-block" key={`name-${animKey}`}>
            {slide.name.map((word, i) => (
              <span key={i} className="hero-name-line" style={{ animationDelay: `${i * 0.1}s` }}>
                {word}
              </span>
            ))}
          </div>

          <div className="hero-info-block" key={`info-${animKey}`}>
            <p className="hero-info">{slide.info}</p>
            <p className="hero-price">{slide.price}</p>
          </div>

          <div className="hero-actions">
            <Button to="/dokon" className="hero-btn-primary">
              {t ? t('nav.shop') : "Do'konga o'tish"}
            </Button>
            <button className="hero-btn-secondary">
              {t ? t('cart.added') : 'Savatga qo\'shish'}
            </button>
          </div>

          {/* Dots */}
          <div className="hero-dots">
            {slides.map((s, i) => (
              <button
                key={s.id}
                className={`hero-dot ${i === index ? 'active' : ''}`}
                onClick={() => handleDotClick(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Pastki qator */}
      <div className="hero-footer">
        <span className="hero-footer-label">Fimoda Collection 2025</span>
        <div className="hero-scroll-hint">
          <div className="hero-scroll-line" />
          <span>Scroll</span>
        </div>
      </div>
    </section>
  );
}