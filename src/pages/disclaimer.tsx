import { NextPage } from "next";
import { Disclaimer, LegalPage } from "src/components/Legal";

const DisclaimerPage: NextPage = () => (
  <LegalPage title="Disclaimer">
    <Disclaimer />
  </LegalPage>
);

export default DisclaimerPage;
