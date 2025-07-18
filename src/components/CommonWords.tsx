import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import CardStack from "./CardStack";

const CommonWords = () => {
  const [words, setWords] = useState<any[]>([]);

  useEffect(() => {
    async function fetchWords() {
      const { data, error } = await supabase
        .from("words_master")
        .select("*")
        .limit(5);

      if (error) console.error("Error:", error);
      else setWords(data);
    }

    fetchWords();
  }, []);

  console.log("CommonWords data:", words);

  return (
    <div>
      <h1>Words: {words.length}</h1>
      <CardStack words={words} />
    </div>
  );
};
export default CommonWords;
