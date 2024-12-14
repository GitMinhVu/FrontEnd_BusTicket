import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import các file translation
import translationEN from './en/translation.json';
import translationVI from './vi/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  vi: {
    translation: translationVI
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector) // phát hiện ngôn ngữ của người dùng
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi', // ngôn ngữ mặc định
    debug: true,
    interpolation: {
      escapeValue: false, // không thoát các ký tự đặt biệt 
    }
  });

export default i18n;