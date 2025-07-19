export type Word = {
  id: number; // Unique identifier for the word
  word: string;
  transcription: string;
  meaning: string;
  examples: string[];
  prepositions: string[];
  synonyms: SynonymType[];
};

export type UserWord = {
  added_at: string; // ISO date string
  context: string; // Context in which the word was added
  id: number; // Unique identifier for the user word entry
  knowledge_level: number; // User's knowledge level for the word
  words: Word; // The word details
};

export type SynonymType = {
  word: string;
  note?: string; // Optional note to provide additional context or explanation
};
