import { useState } from "react";
import type { Word } from "../../types/wordTypes";
import "./styles.css";

const WordCard = ({ word }: { word: Word }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="card" onClick={() => setOpen(!open)}>
      <div className="card-header">
        <h2>{word.word}</h2>
        <p>{word.transcription}</p>
      </div>
      {open && (
        <div>
          <p>{word.meaning}</p>
          <h4>Examples</h4>
          <ul>
            {word.examples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
          <h4>Synonyms</h4>
          <ul>
            {word.synonyms.map((synonym, index) => (
              <li key={index}>
                {synonym.word}
                {synonym.note && ` (${synonym.note})`}
              </li>
            ))}
          </ul>
          <h4>Prepositions</h4>
          <ul>
            {word.prepositions.map((prep, index) => (
              <li key={index}>{prep}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default WordCard;
