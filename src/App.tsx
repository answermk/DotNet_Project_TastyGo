import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { OrderProvider } from './contexts/OrderContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { Router } from './router';
import './App.css';

// Initialize i18next
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';
import rwTranslations from './locales/rw.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      fr: { translation: frTranslations },
      rw: { translation: rwTranslations }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <ThemeProvider>
                <NotificationProvider>
                    <AuthProvider>
                        <OrderProvider>
                            <Router />
                        </OrderProvider>
                    </AuthProvider>
                </NotificationProvider>
            </ThemeProvider>
        </LanguageProvider>
    );
};

export default App;