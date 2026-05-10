import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '../../../Context/LangContext';
import { FiChevronDown } from 'react-icons/fi';

export default function LangSwitcher() {
  const { lang, changeLang, LANGUAGES } = useLang();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="lang-wrap" ref={wrapRef}>
      <button
        className={`lang-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen((p) => !p)}
        aria-label="Tilni o'zgartirish"
      >
        <span>{lang}</span>
        <FiChevronDown size={10} />
      </button>

      {open && (
        <div className="lang-dropdown">
          {LANGUAGES.map((l) => (
            <div
              key={l.code}
              className={`lang-option ${lang === l.code ? 'selected' : ''}`}
              onClick={() => { changeLang(l.code); setOpen(false); }}
            >
              <span className="lang-code">{l.code}</span>
              <span className="lang-native">{l.native}</span>
              {lang === l.code && (
                <span className="lang-check">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
