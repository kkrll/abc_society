import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserWord, Word } from "../types/wordTypes";
import { supabase } from "../lib/supabase";

interface VocabStore {
  userWords: UserWord[];
  commonWords: Word[];
  loading: boolean;
  error: string | null;
  lastUserWordsFetch: number | null;
  lastCommonWordsFetch: number | null;
  currentUserId: string | null;

  // Actions
  fetchUserWords: (userId: string, force?: boolean) => Promise<void>;
  fetchCommonWords: (languageId: number, force?: boolean) => Promise<void>;
  addWordToCollection: (userId: string, wordId: number) => Promise<void>;
  removeWordFromCollection: (userId: string, wordId: number) => Promise<void>;
  updateProgress: (wordId: string, correct: boolean) => void;
  clearUserData: () => void;
  isUserWordsStale: () => boolean;
  isCommonWordsStale: (languageId: number) => boolean;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for vocab data

const useVocabStore = create<VocabStore>()(
  persist(
    (set, get) => ({
      userWords: [],
      commonWords: [],
      loading: false,
      error: null,
      lastUserWordsFetch: null,
      lastCommonWordsFetch: null,
      currentUserId: null,

      fetchUserWords: async (userId: string, force = false) => {
        const { isUserWordsStale, currentUserId, lastUserWordsFetch } = get();
        
        // Skip if data is fresh and same user
        if (!force && currentUserId === userId && lastUserWordsFetch && !isUserWordsStale()) {
          return;
        }

        set({ loading: true, error: null, currentUserId: userId });
        try {
          const { data: words, error } = await supabase
            .from("user_words")
            .select(`
              id,
              knowledge_level,
              context,
              added_at,
              words (
                id,
                word,
                transcription,
                meaning,
                examples,
                synonyms,
                prepositions,
                difficulty_level
              )
            `)
            .eq("user_id", userId)
            .order("added_at", { ascending: false });

          if (error) throw error;
          set({ 
            userWords: (words as unknown as UserWord[]) || [], 
            loading: false,
            lastUserWordsFetch: Date.now()
          });
        } catch (error) {
          console.error("Error fetching user words:", error);
          set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
      },

      fetchCommonWords: async (languageId: number, force = false) => {
        const { isCommonWordsStale } = get();
        
        // Skip if data is fresh for this language
        if (!force && !isCommonWordsStale(languageId)) {
          return;
        }

        set({ loading: true, error: null });
        try {
          const { data: words, error } = await supabase
            .from("words")
            .select("*")
            .eq("language_id", languageId)
            .order("word");

          if (error) throw error;
          set({ 
            commonWords: words as Word[] || [], 
            loading: false,
            lastCommonWordsFetch: Date.now()
          });
        } catch (error) {
          console.error("Error fetching common words:", error);
          set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
      },

      addWordToCollection: async (userId: string, wordId: number) => {
        try {
          const { error } = await supabase.from("user_words").insert({
            user_id: userId,
            word_id: wordId,
            knowledge_level: 0,
            context: "Added from common words collection",
          });

          if (error) throw error;
          
          // Force refresh user words after adding
          await get().fetchUserWords(userId, true);
        } catch (error) {
          console.error("Error adding word:", error);
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
      },

      removeWordFromCollection: async (userId: string, wordId: number) => {
        try {
          const { error } = await supabase
            .from("user_words")
            .delete()
            .eq("user_id", userId)
            .eq("word_id", wordId);

          if (error) throw error;
          
          // Force refresh user words after removing
          await get().fetchUserWords(userId, true);
        } catch (error) {
          console.error("Error removing word:", error);
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        }
      },

      updateProgress: (_wordId, _correct) => {
        // Update study stats
      },

      clearUserData: () => {
        set({ 
          userWords: [], 
          currentUserId: null, 
          lastUserWordsFetch: null,
          error: null 
        });
      },

      isUserWordsStale: () => {
        const { lastUserWordsFetch } = get();
        if (!lastUserWordsFetch) return true;
        return Date.now() - lastUserWordsFetch > CACHE_DURATION;
      },

      isCommonWordsStale: (_languageId: number) => {
        const { lastCommonWordsFetch } = get();
        if (!lastCommonWordsFetch) return true;
        return Date.now() - lastCommonWordsFetch > CACHE_DURATION;
      },
    }),
    { 
      name: "vocab-store",
      // Only persist essential data, not loading states
      partialize: (state) => ({
        userWords: state.userWords,
        commonWords: state.commonWords,
        lastUserWordsFetch: state.lastUserWordsFetch,
        lastCommonWordsFetch: state.lastCommonWordsFetch,
        currentUserId: state.currentUserId,
      }),
    }
  )
);

// Listen for language changes and refetch common words
if (typeof window !== 'undefined') {
  window.addEventListener('languageChanged', (event: Event) => {
    const customEvent = event as CustomEvent;
    const { languageId } = customEvent.detail;
    useVocabStore.getState().fetchCommonWords(languageId, true);
  });
}

export default useVocabStore;
