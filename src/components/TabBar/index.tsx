import LanguageSwitch from "../LanguageSwitch";

const TabBar = () => {
  return (
    <div className="fixed gap-2 z-100 left-0 bottom-0 right-0 flex items-center justify-between p-4">
      <button
        onClick={() => {
          console.log("later...");
        }}
        className="h-12 w-full rounded-full bg-white text-black uppercase font-mono text-center"
      >
        Add Word
      </button>
      <LanguageSwitch />
    </div>
  );
};

export default TabBar;
