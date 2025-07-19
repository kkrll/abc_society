import { useEffect, useState } from "react";

import CommonWords from "./components/CommonWords";
import Tabs from "./components/Tabs";
import TabBar from "./components/TabBar";
import OwnWords from "./components/OwnWords";

import { useAuth } from "./hooks/useAuth";
import useVocabStore from "./hooks/useVocab";
import useLanguageStore from "./hooks/useLanguage";

import "./App.css";

const WordLists = () => {
  const [activeList, setActiveList] = useState<string>("Own");
  const { user } = useAuth();
  const { userWords, fetchUserWords, fetchCommonWords } = useVocabStore();
  const { currentLanguage } = useLanguageStore();

  useEffect(() => {
    if (!user) return;

    fetchUserWords(user.id);
    fetchCommonWords(currentLanguage);
  }, [user, fetchUserWords, fetchCommonWords, currentLanguage]);

  return (
    <div className="min-h-screen ">
      <Tabs
        options={["Own", "Common"]}
        activeTab={activeList}
        setActive={setActiveList}
      />
      {activeList === "Own" ? (
        <OwnWords userWords={userWords} />
      ) : (
        <CommonWords userWordsData={userWords} />
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
      <TabBar />
    </>
  );
}

export default App;
