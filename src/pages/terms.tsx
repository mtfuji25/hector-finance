import { NextPage } from "next";
import { DappPage } from "src/components/DappPage";
import { Terms } from "src/components/Legal";

const TermsPage: NextPage = () => {
  return (
    <DappPage>
      <Terms />
    </DappPage>
  );
};

export default TermsPage;
