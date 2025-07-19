import "./App.css";
import CommonWords from "./components/CommonWords";
import { useAuth } from "./hooks/useAuth";
import { useEffect, useState } from "react";
import Tabs from "./components/Tabs";
import OwnWords from "./components/OwnWords";
import { supabase } from "./lib/supabase";

const WordLists = () => {
  const [activeList, setActiveList] = useState<string>("Own");

  const [words, setWords] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchWords() {
      if (!user) return;

      const { data: words, error } = await supabase
        .from("user_words")
        .select(
          `
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
  `
        )
        .eq("user_id", user.id)
        .order("added_at", { ascending: false });

      if (error) console.error("Error:", error);
      else setWords(words || []);
    }

    fetchWords();
  }, [user]);
  console.log("Words:", words);

  return (
    <div className="min-h-screen ">
      <Tabs
        options={["Own", "Common"]}
        activeTab={activeList}
        setActive={setActiveList}
      />
      {/* {activeList === "Own" ? <CardStack words={words_en} /> : <CommonWords />} */}
      {activeList === "Own" ? (
        <OwnWords userWords={words} />
      ) : (
        <CommonWords userWordsData={words} />
      )}
    </div>
  );
};

function App() {
  const { user, loading, signInWithGoogle } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <div>
        <h1>Please sign in</h1>
        <button onClick={() => signInWithGoogle()}>Sign in with Google</button>
      </div>
    );
  }
  return (
    <>
      <WordLists />
    </>
  );
}

export default App;
