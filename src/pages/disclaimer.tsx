import { NextPage } from "next";
import { DappPage } from "src/components/DappPage";
import { Disclaimer, LegalPage } from "src/components/Legal";

const DisclaimerPage: NextPage = () => (
  <DappPage>
    <Disclaimer />
  </DappPage>
);

export default DisclaimerPage;
