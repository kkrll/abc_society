import { useState, useEffect } from "react";

import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

import type { UserWord } from "../types/wordTypes";

interface Word {
  id: number;
  word: string;
  transcription: string;
  meaning: string;
  examples: string[];
  synonyms: Array<{ word: string; note: string }>;
  prepositions: string[];
  difficulty_level: number;
}

interface CommonWordsProps {
  userWordsData: UserWord[];
}

const CommonWords = ({ userWordsData }: CommonWordsProps) => {
  const { user } = useAuth();
  const [commonWords, setCommonWords] = useState<Word[]>([]);
  const [userWords, setUserWords] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [addingWords, setAddingWords] = useState<Set<number>>(new Set());

  useEffect(() => {
    setUserWords(new Set(userWordsData?.map((uw: UserWord) => uw.words.id) || []));
  }, [userWordsData]);

  // Fetch common words and user's existing words
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch common words
        const { data: words, error: wordsError } = await supabase
          .from("words")
          .select("*")
          .eq("language_id", 1)
          .order("word");

        if (wordsError) throw wordsError;

        setCommonWords(words || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  console.log("User Words Data:", userWordsData);
  console.log("User Words:", userWords);

  const addWordToCollection = async (wordId: number) => {
    if (!user) return;

    setAddingWords((prev) => new Set([...prev, wordId]));

    try {
      const { error } = await supabase.from("user_words").insert({
        user_id: user.id,
        word_id: wordId,
        knowledge_level: 0, // New word
        context: "Added from common words collection",
      });

      if (error) throw error;

      // Update local state
      setUserWords((prev) => new Set([...prev, wordId]));
    } catch (error) {
      console.error("Error adding word:", error);
      // You might want to show a toast notification here
    } finally {
      setAddingWords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(wordId);
        return newSet;
      });
    }
  };

  const removeWordFromCollection = async (wordId: number) => {
    if (!user) return;

    setAddingWords((prev) => new Set([...prev, wordId]));

    try {
      const { error } = await supabase
        .from("user_words")
        .delete()
        .eq("user_id", user.id)
        .eq("word_id", wordId);

      if (error) throw error;

      // Update local state
      setUserWords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(wordId);
        return newSet;
      });
    } catch (error) {
      console.error("Error removing word:", error);
    } finally {
      setAddingWords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(wordId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        loading...
        <span className="ml-2">Loading words...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* <div className="min-h-screen p-4 flex flex-col items-stretch space-y-2">
        {commonWords.map((word, index) => (
          <WordCard key={index} word={word} isCommon />
        ))}
      </div> */}
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {commonWords
          .sort((a, b) => {
            const aIsAdded = userWords.has(a.id);
            const bIsAdded = userWords.has(b.id);
            if (aIsAdded === bIsAdded) return 0;
            return aIsAdded ? 1 : -1;
          })
          .map((word) => {
            const isAdded = userWords.has(word.id);
            const isProcessing = addingWords.has(word.id);

          return (
            <div
              key={word.id}
              className={`p-8 h-full flex flex-col justify-between rounded-4xl transition-all duration-200 ${
                isAdded ? "bg-gray-200" : "bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col mb-8">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {word.word}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
                    {word.transcription}
                  </p>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                  {word.meaning}
                </p>

                {word.examples.length > 0 && (
                  <div className="text-xs text-gray-600 italic">
                    "{word.examples[0]}"
                  </div>
                )}

                {word.synonyms.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Similar: {word.synonyms.map((s) => s.word).join(", ")}
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                  <span>Level {word.difficulty_level}</span>
                  {isAdded && (
                    <span className="text-green-600 font-medium">
                      ✓ In collection
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() =>
                  isAdded
                    ? removeWordFromCollection(word.id)
                    : addWordToCollection(word.id)
                }
                disabled={isProcessing}
                className={`flex items-center justify-center w-full h-12 rounded-full transition-all duration-200 ${
                  isAdded
                    ? "bg-gray-100 text-gray-500 hover:bg-grey-200"
                    : "bg-black text-white"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing ? "loading" : isAdded ? "added" : "add"}
              </button>
            </div>
          );
        })}
      </div>

      {commonWords.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No words available. Upload some words to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommonWords;
