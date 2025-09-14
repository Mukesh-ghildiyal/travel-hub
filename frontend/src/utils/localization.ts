import { Destination, Hotel, LanguageContent } from '@/types';

export const getLocalizedContent = (
  item: Destination | Hotel,
  language: 'en' | 'ar',
  field: 'name' | 'description'
): string => {
  // Check if language-specific content exists
  if (item.language?.[language]?.[field]) {
    return item.language[language][field]!;
  }
  
  // Fallback to default field
  return item[field] as string;
};

export const getLocalizedDestination = (
  destination: Destination,
  language: 'en' | 'ar'
): { name: string; description: string } => {
  return {
    name: getLocalizedContent(destination, language, 'name'),
    description: getLocalizedContent(destination, language, 'description'),
  };
};

export const getLocalizedHotel = (
  hotel: Hotel,
  language: 'en' | 'ar'
): { name: string; description: string } => {
  return {
    name: getLocalizedContent(hotel, language, 'name'),
    description: getLocalizedContent(hotel, language, 'description'),
  };
};

export const createLanguageContent = (
  name: string,
  description: string,
  language: 'en' | 'ar'
): Partial<{ [key in 'en' | 'ar']: LanguageContent }> => {
  return {
    [language]: { name, description },
  };
};

export const createBilingualContent = (
  enName: string,
  enDescription: string,
  arName: string,
  arDescription: string
): { en: LanguageContent; ar: LanguageContent } => {
  return {
    en: { name: enName, description: enDescription },
    ar: { name: arName, description: arDescription },
  };
};

