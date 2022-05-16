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
      !disabled && onClick
        ? "cursor-pointer bg-orange-500 font-medium text-white  dark:text-gray-100"
        : "cursor-not-allowed bg-gray-200 text-gray-400/70 dark:bg-gray-600",
    )}
    disabled={disabled || onClick == undefined}
    value={label}
    onClick={onClick}
  />
);
