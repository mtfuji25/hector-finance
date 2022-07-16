import { FC, useEffect, useRef } from "react";
import { classes } from "src/util";
import Close from "src/icons/xmark-regular.svgr";

export const Modal: FC<{ className?: string; onClose?: () => void }> = ({
  children,
  className,
  onClose,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {/* Backdrop and close */}
      <div
        onClick={onClose}
        className="fixed top-0 left-0 right-0 bottom-0 z-10 m-0 bg-gray-900/50 backdrop-blur-sm"
      />

      {/* Content */}
      <div className="transparent pointer-events-none fixed top-0 left-0 right-0 bottom-0 z-20 m-0 flex items-center justify-center overflow-auto">
        <div
          className={classes(
            "pointer-events-auto relative m-auto w-full rounded bg-white dark:bg-gray-700 dark:text-gray-200",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export const ModalCloseButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="absolute top-0 right-0 block p-4 text-gray-300 hover:text-gray-600 dark:text-gray-500 hover:dark:text-gray-200"
    title="Close"
    onClick={onClick}
  >
    <Close className="h-5 w-5" />
  </button>
);
