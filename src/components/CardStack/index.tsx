import type { Word } from "../../types/wordTypes";
import WordCard from "../WordCard";
import "./styles.css";

const CardStack = ({ words }: { words: Word[] }) => {
  return (
    <div className="card-stack">
      {words.map((word, index) => (
        <WordCard key={index} word={word} />
      ))}
    </div>
  );
};

export default CardStack;
