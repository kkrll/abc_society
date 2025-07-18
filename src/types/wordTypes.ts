export type Word = {
  id: string | number; // Unique identifier for the word
  word: string;
  transcription: string;
  meaning: string;
  examples: string[];
  prepositions: string[];
  synonyms: SynonymType[];
};

export type SynonymType = {
  word: string;
  note?: string; // Optional note to provide additional context or explanation
};
