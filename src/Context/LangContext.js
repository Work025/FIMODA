import React, { createContext, useContext, useState, useCallback } from 'react';
import translations from '../i18n/Translations.json';

const LangContext = createContext(null);

export const LANGUAGES = [
  { code: 'UZ', native: "O'zbek" },
  { code: 'RU', native: 'Русский' },
  { code: 'EN', native: 'English' },
  { code: 'TR', native: 'Türkçe' },
  { code: 'AR', native: 'العربية' },
];

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('fimoda_lang') || 'UZ');

  const changeLang = useCallback((code) => {
    setLang(code);
    localStorage.setItem('fimoda_lang', code);
    // RTL qo'llab-quvvatlash (Arab tili uchun)
    document.documentElement.dir = code === 'AR' ? 'rtl' : 'ltr';
  }, []);

  // translations.json dan kalit bo'yicha olish
  // t('cart.title') => "Savat"
  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, changeLang, t, LANGUAGES }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
};
