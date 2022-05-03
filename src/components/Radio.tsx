import { FC } from "react";
import { classes } from "src/util";

export const RadioGroup: FC<{ label?: string }> = ({ label, children }) => (
  <div className="space-y-1">
    {label && <div>{label}</div>}
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
        "flex items-center gap-2.5 rounded px-3 py-3",
        checked ? "bg-gray-200" : "bg-gray-100/80 text-gray-500",
      )}
    >
      <div
        className={classes(
          "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2",
          checked ? "border-gray-900" : "border-gray-500",
        )}
      >
        {checked && (
          <div className="h-3 w-3 flex-shrink-0 rounded-full bg-gray-800" />
        )}
      </div>
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
