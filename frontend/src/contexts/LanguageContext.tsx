import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageContextType } from '@/types';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');

  // Load language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('travelhub-language') as 'en' | 'ar';
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage
  const setLanguage = (lang: 'en' | 'ar') => {
    setCurrentLanguage(lang);
    localStorage.setItem('travelhub-language', lang);
  };

  // Translation function
  const t = (key: string, fallback?: string): string => {
    // For now, return the key or fallback
    // In a real app, you'd have translation files
    return fallback || key;
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

