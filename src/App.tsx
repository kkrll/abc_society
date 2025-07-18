import CardStack from "./components/CardStack";
import "./App.css";
import { words_en } from "./dummyData/words_en";

function App() {
  return (
    <>
      <p className="logo">abc society</p>
      <CardStack words={words_en} />
    </>
  );
}

export default App;
