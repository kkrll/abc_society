import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

interface Language {
  id: number;
  name: string;
  code: string;
  flag?: string;
}

interface LanguageStore {
  currentLanguage: number;
  availableLanguages: Language[];
  lastFetched: number | null;
  loading: boolean;
  error: string | null;

  // Actions
  setLanguage: (languageId: number) => void;
  fetchAvailableLanguages: () => Promise<void>;
  getCurrentLanguage: () => Language | undefined;
  isDataStale: () => boolean;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: 1, // Default to English
      availableLanguages: [
        { id: 1, name: "English", code: "en", flag: "🇺🇸" },
        { id: 2, name: "Polish", code: "pl", flag: "🇵🇱" }
      ],
      lastFetched: null,
      loading: false,
      error: null,

      setLanguage: (languageId: number) => {
        const { currentLanguage } = get();
        if (currentLanguage !== languageId) {
          set({ currentLanguage: languageId });
          
          // Notify other stores about language change
          // This will be handled by useVocab subscription
          window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { languageId } 
          }));
        }
      },

      fetchAvailableLanguages: async () => {
        const { isDataStale, lastFetched } = get();
        
        // Skip fetch if data is fresh
        if (lastFetched && !isDataStale()) {
          return;
        }

        set({ loading: true, error: null });
        
        try {
          const { data: languages, error } = await supabase
            .from("languages")
            .select("*")
            .order("name");

          if (error) throw error;

          if (languages && languages.length > 0) {
            set({ 
              availableLanguages: languages as Language[],
              lastFetched: Date.now(),
              loading: false 
            });
          } else {
            // Keep default languages if none found in DB
            set({ 
              lastFetched: Date.now(),
              loading: false 
            });
          }
        } catch (error) {
          console.error("Error fetching languages:", error);
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false 
          });
          // Keep using default languages on error
        }
      },

      getCurrentLanguage: () => {
        const { currentLanguage, availableLanguages } = get();
        return availableLanguages.find(lang => lang.id === currentLanguage);
      },

      isDataStale: () => {
        const { lastFetched } = get();
        if (!lastFetched) return true;
        return Date.now() - lastFetched > CACHE_DURATION;
      },
    }),
    { 
      name: "language-store",
      // Only persist essential data, not loading states
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
        availableLanguages: state.availableLanguages,
        lastFetched: state.lastFetched,
      }),
    }
  )
);

export default useLanguageStore;