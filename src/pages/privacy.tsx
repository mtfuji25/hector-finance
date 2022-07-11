import { NextPage } from "next";
import { LegalPage, Privacy } from "src/components/Legal";

const PrivacyPage: NextPage = () => (
  <LegalPage title="Privacy Policy">
    <Privacy />
  </LegalPage>
);

export default PrivacyPage;
