import { FC } from "react";

export const PageHeader: FC = ({ children }) => (
  <h1 className="font-semibold text-2xl dark:text-gray-200">{children}</h1>
);

export const PageSubheader: FC = ({ children }) => (
  <h2 className="dark:text-gray-200">{children}</h2>
);
