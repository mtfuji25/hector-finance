import { NextPage } from "next";
import { LegalPage } from "src/components/Legal";

const DisclaimerPage: NextPage = () => (
  <LegalPage title="Disclaimer">
    <h1>Disclaimer</h1>
    <p>
      The information provided in this material does not constitute investment
      advice, financial advice, trading advice, or any other sort of advice. You
      should not treat any of the material’s content as such. This material is
      for informational purposes only and is not
    </p>
    <ul>
      <li>
        an offer, or solicitation of an offer, to invest in, or to buy or sell,
        any interests, cryptocurrency or shares, or to participate in any
        investment or trading strategy,
      </li>
      <li>
        intended to provide accounting, legal, or tax advice, or investment
        recommendations, or
      </li>
      <li>an official statement of HEC Token/Hector Finance.</li>
    </ul>

    <p>
      No representation or warranty is made, expressed or implied, with respect
      to the accuracy or completeness of the information or to the future
      performance of any digital asset, financial instrument, or other market or
      economic measure. The HEC Token/Hector Finance team does not recommend
      that any cryptocurrency should be bought, sold, or held by you. Do conduct
      your due diligence and consult your financial advisor before making any
      investment decisions. By purchasing any Hector Finance token or
      interacting monetarily with the Hector Project, you agree that you are not
      purchasing a security or investment, and you agree to hold the team
      harmless and not liable for any losses or taxes you may incur. You also
      agree that the team is presenting the token and project “as is” and is not
      required to provide any support or services. You should have no
      expectation of any form from HEC Token/Finance and its team. The team
      strongly recommends that citizens in areas with government bans on
      cryptocurrencies do not interact with Hector Finance because the team
      cannot ensure compliance with established regulations within certain
      territories. Always make sure that you comply with your local laws and
      regulations before you make any purchase.
    </p>

    <p>
      Please note that there are always risks associated with smart contracts.
      Please use them at your own risk. Hector Finance is not a registered
      broker, analyst, or investment advisor. Everything that is provided in
      this material is purely for guidance, informational and educational
      purposes. All information contained herein should be independently
      verified and confirmed. Hector Finance Team does not accept any liability
      for any loss or damage whatsoever caused in reliance upon such information
      or services. Please be aware of the risks involved with any trading done
      in any financial market. Do not trade with money that you cannot afford to
      lose. When in doubt, you should consult a qualified financial advisor
      before making any investment decisions.
    </p>
  </LegalPage>
);

export default DisclaimerPage;
