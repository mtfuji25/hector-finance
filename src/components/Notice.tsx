import { FC } from "react";
import CircleInfo from "src/icons/circle-info-regular.svgr";

export const Notice: FC = ({ children }) => (
  <div className="flex gap-1.5 opacity-80">
    <CircleInfo className="mt-[3px] inline h-4 w-4 flex-shrink-0" />
    <div>{children}</div>
  </div>
);
