import TopNav, { SideNav } from "src/components/Nav";
import { Legal } from "src/components/LegalModal";
import { FC } from "react";

export const DappPage: FC = ({ children }) => {
  return (
    <div className="mx-auto max-w-3xl ">
      <TopNav />
      <div className="flex gap-8 p-8">
        <SideNav />
        {children}
        <Legal />
      </div>
    </div>
  );
};
