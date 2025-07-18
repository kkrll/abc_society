import CardStack from "./components/CardStack";
import "./App.css";
import { words_en } from "./dummyData/words_en";
import CommonWords from "./components/CommonWords";
import { useAuth } from "./hooks/useAuth";
import { useState } from "react";
import Tabs from "./components/Tabs";

const WordLists = () => {
  const [activeList, setActiveList] = useState<string>("Own");

  return (
    <div className="min-h-screen ">
      <Tabs
        options={["Own", "Common"]}
        activeTab={activeList}
        setActive={setActiveList}
      />
      {activeList === "Own" ? <CardStack words={words_en} /> : <CommonWords />}
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
