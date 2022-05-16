import { FC } from "react";
import { classes } from "src/util";

export const Tabs: FC = ({ children }) => (
  <div className="flex justify-center rounded bg-gray-100">{children}</div>
);

export const Tab: FC<{
  selected: boolean;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}> = ({ label, selected, onSelect, disabled }) => (
  <button
    className="w-0 flex-shrink-0 flex-grow p-1.5 dark:bg-gray-700"
    onClick={onSelect}
  >
    <div
      className={classes(
        "rounded px-4 py-3 dark:bg-gray-600 dark:text-gray-200",
        selected ? "bg-white shadow-lg dark:bg-gray-500" : "text-gray-400",
        disabled ? "cursor-not-allowed text-gray-400/70 dark:bg-gray-600" : "",
      )}
    >
      {label}
    </div>
  </button>
);
