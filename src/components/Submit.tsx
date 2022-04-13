import { FC } from "react";
import { classes } from "src/util";

const Submit: FC<{
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}> = ({ label, onClick, disabled = false }) => (
  <input
    type="submit"
    className={classes(
      "ml-auto block rounded px-7 py-2",
      !disabled
        ? "cursor-pointer bg-orange-500 text-white"
        : "cursor-not-allowed bg-gray-200 text-gray-400",
    )}
    disabled={disabled}
    value={label}
    onClick={onClick}
  />
);

export default Submit;
