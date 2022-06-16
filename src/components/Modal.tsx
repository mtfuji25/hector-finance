import { FC, useEffect, useRef } from "react";
import { classes } from "src/util";
import Close from "src/icons/xmark-regular.svgr";

export const Modal: FC<{ className?: string; onClose?: () => void }> = ({
  children,
  className,
  onClose,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onClose) {
      return;
    }

    const onClickOutside = (e: MouseEvent) => {
      if (!(e.target instanceof Node)) {
        return;
      }
      let target: Node | null = e.target;
      while (target) {
        if (target === ref.current) {
          return;
        }
        target = target.parentNode;
      }
      onClose();
    };

    window.addEventListener("click", onClickOutside);
    return () => {
      window.removeEventListener("click", onClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 m-0 bg-gray-900/50 p-4 backdrop-blur-sm">
      <div
        ref={ref}
        className={classes(
          "relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded dark:bg-gray-700 dark:text-gray-200 ",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export const ModalCloseButton: FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="absolute top-0 right-0 block p-4 text-gray-300 hover:text-gray-600"
    title="Close"
    onClick={onClick}
  >
    <Close className="h-5 w-5" />
  </button>
);
