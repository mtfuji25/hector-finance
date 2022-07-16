import { NextPage } from "next";
import { DappPage } from "src/components/DappPage";
import { LegalPage, Privacy } from "src/components/Legal";

const PrivacyPage: NextPage = () => (
  <DappPage>
    <Privacy />
  </DappPage>
);

export default PrivacyPage;
