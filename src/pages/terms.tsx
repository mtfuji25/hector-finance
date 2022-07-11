import { NextPage } from "next";
import { LegalPage, Terms } from "src/components/Legal";

const TermsPage: NextPage = () => {
  return (
    <LegalPage title="Terms & Conditions">
      <Terms />
    </LegalPage>
  );
};

export default TermsPage;
