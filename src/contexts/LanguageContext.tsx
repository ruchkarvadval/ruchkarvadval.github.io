import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    home: 'Home',
    recipes: 'Recipes',
    heritage: 'Heritage',
    community: 'Community',
    beginJourney: 'Begin Your Journey',
    exploreRecipes: 'Explore Recipes',
    viewRecipe: 'View Recipe',
    ingredients: 'Ingredients',
    preparation: 'Preparation',
    servings: 'Servings',
    cookTime: 'Cook Time',
    prepTime: 'Prep Time',
    totalTime: 'Total Time',
  },
  mr: {
    home: 'मुख्यपृष्ठ',
    recipes: 'पाककृती',
    heritage: 'वारसा',
    community: 'समुदाय',
    beginJourney: 'प्रवास सुरू करा',
    exploreRecipes: 'पाककृती पहा',
    viewRecipe: 'पाककृती पहा',
    ingredients: 'साहित्य',
    preparation: 'कृती',
    servings: 'सर्व्हिंग',
    cookTime: 'शिजवण्याचा वेळ',
    prepTime: 'तयारीचा वेळ',
    totalTime: 'एकूण वेळ',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
