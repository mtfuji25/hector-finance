import { FC } from "react";
import { classes } from "src/util";

export const Submit: FC<{
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ label, onClick, disabled = false }) => (
  <input
    type="submit"
    className={classes(
      "ml-auto block w-full rounded-sm px-7 py-3",
      !disabled
        ? "cursor-pointer bg-orange-500 font-medium text-white"
        : "cursor-not-allowed bg-gray-200 text-gray-400/70",
    )}
    disabled={disabled}
    value={label}
    onClick={onClick}
  />
);
