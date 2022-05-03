import { FC } from "react";
import { classes } from "src/util";

export const Tabs: FC = ({ children }) => (
  <div className="flex justify-center rounded bg-gray-100">{children}</div>
);

export const Tab: FC<{
  selected: boolean;
  label: string;
  onSelect: () => void;
}> = ({ label, selected, onSelect }) => (
  <button className="w-0 flex-shrink-0 flex-grow p-1.5" onClick={onSelect}>
    <div
      className={classes(
        "rounded px-4 py-3",
        selected ? "bg-white shadow-lg" : "text-gray-400",
      )}
    >
      {label}
    </div>
  </button>
);
