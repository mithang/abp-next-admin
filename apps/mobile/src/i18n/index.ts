import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './vi.json';
import en from './en.json';

// i18next default export là instance; rule import/no-named-as-default-member báo
// nhầm ở đây (i18n.use là API chuẩn của instance, không phải named export `use`).
// eslint-disable-next-line import/no-named-as-default-member
void i18n.use(initReactI18next).init({
  resources: { vi: { translation: vi }, en: { translation: en } },
  lng: 'vi',
  fallbackLng: 'vi',
  interpolation: { escapeValue: false },
});

export default i18n;
