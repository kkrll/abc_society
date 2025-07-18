import Tab from "./Tab";

const Tabs = ({
  options,
  setActive,
  activeTab,
}: {
  options: string[];
  setActive: (tab: string) => void;
  activeTab: string;
}) => {
  const width = 100 / options.length + "%";

  return (
    <div className="flex flex-col mb-4 ">
      <div className="flex items-center  space-x-4">
        {options.map((tab, index) => {
          return (
            <Tab
              key={index}
              onClick={() => setActive(tab)}
              label={tab}
              isActive={activeTab === tab}
            />
          );
        })}
      </div>
      <div
        className="h-0.5 bg-white"
        style={{
          width: width,
          transition: "transform 0.15s ease-in-out",
          willChange: "transform",
          transform: `translateX(${
            (options.indexOf(activeTab) * 100) / (options.length - 1)
          }%)`,
        }}
      />
    </div>
  );
};

export default Tabs;
