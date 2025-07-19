import type { UserWord } from "../types/wordTypes";
import WordCard from "./WordCard";

const OwnWords = ({ userWords }: { userWords: UserWord[] }) => {
  return (
    <div className="min-h-screen p-4 flex flex-col items-stretch space-y-2">
      {userWords.map((word, index) => (
        <WordCard key={index} word={word.words} />
      ))}
    </div>
  );
};
export default OwnWords;
