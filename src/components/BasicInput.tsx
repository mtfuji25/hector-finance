import { FC } from "react";
import { classes } from "src/util";
import CircleDot from "src/icons/circle-dot.svgr";
import Circle from "src/icons/circle.svgr";
import Square from "src/icons/square.svgr";
import SquareChecked from "src/icons/square-checked.svgr";

export const RadioGroup: FC<{ label?: string }> = ({ label, children }) => (
  <div className="space-y-1">
    {label && <div className="dark:text-gray-200">{label}</div>}
    <div className="space-y-2 rounded">{children}</div>
  </div>
);

export const Radio: FC<{ checked: boolean; onCheck: () => void }> = ({
  children,
  checked,
  onCheck,
}) => (
  <label
    className={classes(
      "block cursor-pointer select-none items-center gap-2.5 rounded",
    )}
  >
    <div
      className={classes(
        "flex items-center gap-2.5 rounded px-3 py-3 dark:text-gray-200",
        checked
          ? "bg-gray-200 dark:bg-gray-600  "
          : "bg-gray-100/80 text-gray-500 dark:bg-gray-700 ",
      )}
    >
      {checked && (
        <CircleDot className="h-5 w-5 flex-shrink-0 object-contain" />
      )}
      {!checked && <Circle className="h-5 w-5 flex-shrink-0 object-contain" />}
      <div className={classes("flex-grow")}>{children}</div>
    </div>

    {/* Hidden input allows navigating radio buttons using the keyboard. */}
    <input
      type="radio"
      className="absolute appearance-none"
      checked={checked}
      onChange={onCheck}
    />
  </label>
);

export const Checkbox: FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ children, checked, onChange }) => (
  <label
    className={classes(
      "block cursor-pointer select-none items-center gap-2.5 rounded",
    )}
  >
    <div className="flex items-center gap-2.5 rounded py-3.5">
      {checked && (
        <SquareChecked className="h-5 w-5 flex-shrink-0 object-contain" />
      )}
      {!checked && <Square className="h-5 w-5 flex-shrink-0 object-contain" />}
      <div className={classes("flex-grow")}>{children}</div>
    </div>

    {/* Hidden input allows navigating radio buttons using the keyboard. */}
    <input
      type="checkbox"
      className="absolute appearance-none"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
  </label>
);
