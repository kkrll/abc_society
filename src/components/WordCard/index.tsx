import { useState } from "react";
import type { Word } from "../../types/wordTypes";
import "./styles.css";

const AddToOwnSection = ({ wordId }: { wordId: number }) => {
  const handleAdd = () => {
    // Logic to add the word to the user's own words section
    console.log(`Adding word with ID: ${wordId}`);
  };

  return (
    <button onClick={handleAdd} className="add-button">
      Add to My Words
    </button>
  );
};

const WordCard = ({
  word,
  isCommon = false,
}: {
  word: Word;
  isCommon?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="card" onClick={() => setOpen(!open)}>
      <div className="card-header">
        <h3>{word.word}</h3>
        <p className="text-gray-500">{word.transcription}</p>
      </div>
      {open && (
        <div className="mt-4 flex flex-col space-y-4">
          <p className="font-serif italic">{word.meaning}</p>
          <div className="mt-4">
            <h4>Examples</h4>
            <ul>
              {word.examples.map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
          {word.synonyms && (
            <div>
              <h4>Synonyms</h4>
              <ul>
                {word.synonyms.map((synonym, index) => (
                  <li key={index}>
                    {synonym.word}
                    {synonym.note && ` (${synonym.note})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {word.prepositions && (
            <div>
              <h4>Prepositions</h4>
              <ul>
                {word.prepositions.map((prep, index) => (
                  <li key={index}>{prep}</li>
                ))}
              </ul>
            </div>
          )}
          {isCommon && <AddToOwnSection wordId={word.id} />}
        </div>
      )}
    </div>
  );
};
export default WordCard;
