import useLanguageStore from "../hooks/useLanguage";

const LanguageSwitch = () => {
  const {
    setLanguage,
    getCurrentLanguage,
    availableLanguages,
    currentLanguage,
  } = useLanguageStore();

  const handleLanguageToggle = () => {
    // Toggle between available languages
    const currentIndex = availableLanguages.findIndex(
      (lang) => lang.id === currentLanguage
    );
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    const nextLanguage = availableLanguages[nextIndex];

    if (nextLanguage) {
      setLanguage(nextLanguage.id);
    }
  };

  return (
    <button
      onClick={handleLanguageToggle}
      className="h-12 w-24 rounded-full bg-white text-black uppercase font-mono text-center"
    >
      {getCurrentLanguage()?.name.slice(0, 3).toUpperCase()}
    </button>
  );
};

export default LanguageSwitch;
