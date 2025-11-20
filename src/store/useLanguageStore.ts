import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/i18n/config';

interface LanguageStore {
  language: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: i18n.language,
      setLanguage: (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
        set({ language: lang });
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
