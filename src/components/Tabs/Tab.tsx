const Tab = ({
  label,
  onClick,
  isActive,
}: {
  label: string;
  onClick: () => void;
  isActive: boolean;
}) => (
  <button
    className={`px-4 py-2 w-full font-mono bg-transparent focus:outline-0 ${
      isActive ? "text-white" : "text-gray-200"
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default Tab;
