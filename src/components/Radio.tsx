import { FC } from "react";
import { classes } from "src/util";

const Radio: FC<{ checked: boolean; onCheck: () => void }> = ({
  children,
  checked,
  onCheck,
}) => (
  <label
    className={classes(
      "flex cursor-pointer items-center gap-2.5 rounded px-4 py-3",
      checked
        ? "bg-gray-200"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200/70",
    )}
  >
    <div
      className={classes(
        "flex h-5 w-5 items-center justify-center rounded-full border-2 ",
        checked ? "border-gray-900" : "border-gray-700",
      )}
    >
      {checked && <div className="h-3 w-3 rounded-full bg-gray-800"></div>}
    </div>
    {children}
    <input
      type="radio"
      className="appearance-none"
      checked={checked}
      onChange={onCheck}
    />
  </label>
);

export default Radio;
