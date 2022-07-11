import Head from "next/head";
import { FC, VFC } from "react";
import LightHectorLogoLarge from "public/light-hec-logo.webp";
import DarkHectorLogoLarge from "public/dark-hec-logo.webp";
import { StaticImg } from "./StaticImg";

export const LegalPage: FC<{ title: string }> = ({ title, children }) => (
  <main className="mx-auto my-14 max-w-prose space-y-14">
    <Head>
      <title>{title}</title>
    </Head>
    <StaticImg
      className="mx-auto w-60 dark:hidden"
      src={LightHectorLogoLarge}
      alt="Hector Finance"
    />
    <StaticImg
      className="mx-auto hidden w-60 dark:block"
      src={DarkHectorLogoLarge}
      alt="Hector Finance"
    />
    <div className="space-y-5">{children}</div>
  </main>
);

export const LegalLink: VFC<{ href: string }> = ({ href }) => (
  <a href={href} className="underline">
    {href}
  </a>
);

export const Level2: FC = ({ children }) => <p className="ml-4">{children}</p>;
export const Level3: FC = ({ children }) => <p className="ml-8">{children}</p>;

export const Terms: VFC = () => (
  <div className="space-y-5">
    <h1>Terms &amp; Conditions</h1>
    <p>
      Please read these Terms and Conditions (“Terms”) carefully as they form a
      binding legal agreement between you and Hector Enterprise Inc. with its
      registered office at Trinity Chambers, PO Box 4301, Road Town, Tortola,
      British Virgin Islands (“Hector Finance” or “we” or “our” and its
      derivatives). Our website (
      <LegalLink href="https://hector.finance/" />) and any other sites or
      subdomains of Hector Finance (collectively, the “Site”) and the
      information on it are controlled by Hector Finance. These Terms govern the
      use of the Site and apply to all visitors to the Site and those who use
      the services and resources available or enabled via the Site (each a
      “Service” and collectively, the “Services”).
    </p>
    <p>
      By accessing the Site or accessing, using or continuing to use the
      Services, you signify that you have read, understand, and agree to be
      bound by these Terms (as amended) in its entirety. If you do not agree,
      you should not use the Site or use the Services. The use of the Site and
      any Services is void where such use is prohibited by, would be subject to
      penalties under Applicable Laws, and shall not be the basis for the
      assertion or recognition of any interest, right, remedy, power, or
      privilege.
    </p>
    <p>
      Hector Finance may modify these Terms at any time and in our sole
      discretion. If we do so, we will change the “Last Updated Date” at the
      beginning of these Terms. You must consent to any updated Terms before you
      continue using the Services following an update to these Terms. Your
      non-termination or continued use of any Services after the effective date
      of any amendments, changes, or updates constitutes your acceptance of
      these Terms, as modified by such amendments, changes, or updates. We
      invite you to check this page regularly for updates to these Terms.
    </p>

    <h2>1. Definitions</h2>
    <Level2>
      1.1. In these Terms and all documents incorporated herein by reference,
      the following words have the following meanings unless otherwise
      indicated:
    </Level2>
    <Level3>
      1.1.1. “Applicable Law” or “Law” means all laws, statutes, orders,
      regulations, rules, treaties and/or official obligations or requirements
      enacted, promulgated, issued, ratified, enforced, or administered by any
      Government that apply to you or the Site;
    </Level3>
    <Level3>
      1.1.2. “AML” means anti-money laundering, including all Laws applicable to
      the Parties prohibiting money laundering or any acts or attempted acts to
      conceal or disguise the identity or origin of; change the form of; or
      more, transfer, or transport, illicit proceeds, property, funds, fiat, or
      Digital Assets, including but not limited to the promotion of any unlawful
      activity such as fraud, tax evasion, embezzlement, insider trading,
      financial crime, bribery, cyber theft or hack, narcotics trafficking,
      weapons proliferation, terrorism, or Economic Sanctions violations;
    </Level3>
    <Level3>
      1.1.3. “Anti-Corruption” means all Laws applicable to each Party
      prohibiting corruption or bribery of government officials, kickbacks,
      inducement, and other related forms of commercial corruption or bribery;
    </Level3>
    <Level3>1.1.4. “CTF” means counter-terrorist financing;</Level3>
    <Level3>
      1.1.5. “Digital Assets” means a digital representation of value that
      functions as (a) a medium of exchange; (ii) a unit of account; (iii) a
      store of value, and/or (iv) other similar digital representations of
      rights or assets, which is neither issued nor guaranteed by any country or
      jurisdiction, typically including blockchain-based assets or rights
      including sovereign cryptocurrency or virtual currency;
    </Level3>
    <Level3>
      1.1.6. “Economic Sanctions” means financial sanctions, trade embargoes,
      export or import controls, anti-boycott, and restrictive trade measures
      enacted, administered, enforced, or penalized by any Laws applicable to
      you or the Site;
    </Level3>
    <Level3>
      1.1.7. “Feedback” means any ideas, suggestions, documents, and/or
      proposals about the Site and the Services;
    </Level3>
    <Level3>
      1.1.8. “Government” means any national, federal, state, municipal, local,
      or foreign branch of government, including any department, agency,
      subdivision, bureau, commission, court, tribunal, arbitral body, or other
      governmental, government appointed, or quasi-governmental authority or
      component exercising executive, legislative, juridical, regulatory, or
      administrative powers, authority, or functions of or pertaining to
      government instrumentality, including any state-owned (majority or
      greater) or controlled business enterprise;
    </Level3>
    <Level3>
      1.1.9. “Hector Finance Content” means the Services and the information and
      content available therein;
    </Level3>
    <Level3>
      1.1.10. “Personal Information” means any information that allows us to
      identify you or any other individual;
    </Level3>
    <Level3>
      1.1.11. “Prohibited Jurisdictions” means any state, country, territory or
      other jurisdiction where your use of the Services would be illegal or
      where your use of the Services would amount to any violation of any
      Applicable Law either by you or by Hector Finance;
    </Level3>
    <Level3>
      1.1.12. “Prohibited Conduct” has the meaning set out in section 6 of these
      Terms;
    </Level3>
    <Level3>
      1.1.13. “Rewards” means, including but not limited to, any incentives,
      rebates or remittances associated with the Services;
    </Level3>
    <Level3>
      1.1.14. “Terms” means these terms and conditions of services, as they may
      be changed, amended, or updated from time to time;
    </Level3>
    <Level3>
      1.1.15. “Third Party Services” means applications and/or services hosted
      by third parties;
    </Level3>
    <Level3>
      1.1.16. “User Content” means all data and information provided or uploaded
      by you to the Services;
    </Level3>

    <h2>2. Disclaimer on the Services Provided</h2>
    <Level2>
      2.1. HECTOR FINANCE IS NOT A BANK, SECURITIES FIRM, FINANCIAL INSTITUTION,
      FINANCIAL SERVICES PROVIDER OR PROVIDER OF SIMILAR SERVICES AND DOES NOT
      PROVIDE INVESTMENT OR FINANCIAL ADVICE, FINANCIAL SERVICES OR CONSULTING
      SERVICES TO USERS OF THE SERVICES. WE ARE SOLELY THE PROVIDER OF THE
      SERVICES AS DEFINED ABOVE.[1] YOUR LOGGED DIGITAL ASSETS ARE NOT COVERED
      BY INSURANCE AGAINST LOSSES OR SUBJECT TO ANY DEPOSIT INSURANCE SCHEMES OR
      PROTECTIONS.
    </Level2>

    <h2>3. Eligibility</h2>
    <Level2>
      3.1. By browsing the Site and/or using the Services, you represent that
      (a) you have read, understand, and agree to be bound by the Terms, (b) you
      are 18 years or older, or of the age of majority in your local
      jurisdiction, whichever is higher, and legally capable of forming a
      binding contract with Hector Finance, and (c) you have the authority to
      enter into the Terms personally or on behalf of the legal entity for whom
      you are using the services. The term “you” refers to you individually or
      the legal entity on whose behalf you use the Services, as applicable. If
      you do not agree to be bound by the Terms, you may not access or use the
      Services.
    </Level2>
    <Level2>
      3.2. You may not use the Services if you are located in, or are a citizen
      or resident of any Prohibited Jurisdiction. It is your obligation to check
      before using the Services whether you are a user from a Prohibited
      Jurisdiction. We may implement controls to restrict access to the Services
      from any Prohibited Jurisdiction pursuant to these Terms. You agree to
      comply with these Terms even if our methods to prevent the use of the
      Services are not effective or can be bypassed.
    </Level2>

    <h2>4. Use of the Services</h2>
    <Level2>
      4.1. Prior to using the Services, you should examine your objectives,
      financial resources and risk tolerance to determine whether utilizing the
      Services is appropriate for you. By accessing and using the Site and/or
      Services, you represent that you understand the inherent risks associated
      with using cryptographic and blockchain-based systems and that you have a
      working knowledge of the usage and intricacies of Digital Assets. You
      further understand that the markets for Digital Assets are highly
      volatile. You acknowledge that the cost and speed of transacting with
      cryptographic and blockchain-based systems are variable and may increase
      dramatically at any time. You further acknowledge the risk that your
      Digital Assets may lose some or all of their value while they are supplied
      to the Services.
    </Level2>
    <Level2>
      4.2. By using the Services, you further understand and agree that any
      Rewards are not guaranteed and the timing of the Rewards may vary. Such
      rates have no relationship to and may not be competitive with benchmark
      interest rates observed in the market for bank deposit accounts. You agree
      and understand that Hector Finance does not guarantee that you will
      receive these Rewards and that the applicable percentage or nominal value
      is an estimate only and not guaranteed and may change at any time in
      Hector Finance’s sole discretion.
    </Level2>
    <Level2>
      4.3. The Services are evolving and you may be required to accept updates
      to Services, or update third-party software (i.e., browsers, hardware
      wallet firmware, hardware wallet bridge, or OS) in order to keep using the
      Services or access their latest features, including security updates. We
      may update the Services at any time, without providing notice.
    </Level2>
    <Level2>
      4.4. The Services may provide access to, integrate, or create user
      interfaces or interactions with Third Party Services. Access to Third
      Party Services may be geo-blocked for residents of certain countries. You
      agree that it is impossible for Hector Finance to monitor Third Party
      Services and that you access them at your own risk. Do not share any
      credential, private key, or other sensitive or confidential information
      with any third party without validating their legitimacy. Third Party
      Services are available to you, subject to the terms and conditions of each
      Third Party Services provider. To the extent Third Party Services have
      terms that differ from these Terms, you may be required to agree to those
      terms in order to access the Third Party Services. You agree to only use
      any Third Party Services in compliance with the terms and conditions
      governing such Third Party Services. Although we do our best to only
      provide links to credible and reliable Third Party Services, we do not
      control the terms, policies, or performance of any third parties, and we
      are not responsible for any performance, or failure to perform, of any
      Third Party Services. We do not provide customer support for transactions
      and/or services performed by Third Party Services providers. We do not
      guarantee that these Third Party Services are secure (although we do our
      best to include only the reliable ones). We do not guarantee that the
      Third Party Services’ instructions and libraries used for any interactions
      are correct and without any errors.
    </Level2>
    <Level2>
      4.5. You are responsible for your User Content, whether publicly posted
      (i.e. in a user forum, if applicable) or privately transmitted (i.e. to us
      in connection with a support request). You are solely responsible for the
      accuracy and completeness of User Content you submit, and represent and
      warrant that you have all rights required in order to post such User
      Content. We may, in our sole discretion, delete any User Content that we
      determine violates these Terms or the Applicable Law. To the extent that
      you provide us with or we may have access to Personal Information in
      connection with your use of the Services, we will preserve, safeguard, and
      use such information as set forth in our Privacy Policy . You represent
      that the Personal Information you provide is correct and accurate and
      undertake to update it in case any changes occur.
    </Level2>
    <Level2>
      4.6. You must provide all equipment and software necessary to use the
      Services yourself. You are solely responsible for any fees, including but
      not limited to internet connection, mobile or blockchain-related
      transaction fees, that you incur when accessing or using the Services.
    </Level2>

    <h2>5. Intellectual Property</h2>
    <Level2>
      5.1. Hector Finance (and/or its suppliers, where applicable) owns all
      right, title and interest in and to the Hector Finance Content and the
      Site. You shall not remove, alter or obscure any copyright, trademark,
      service mark or other proprietary rights notices incorporated in or
      accompanying the Hector Finance Content.
    </Level2>
    <Level2>
      5.2. Hector Finance and other related graphics, logos, service marks and
      trade names including but not limited to the Hector Finance Content used
      on or in connection with the Services are intellectual property of Hector
      Finance and may not be used without permission in connection with any
      third-party products or services. Other trademarks, service marks and
      trade names that may appear on or in the Services are the property of
      their respective owners including but not limited to Hector Finance’s
      suppliers.
    </Level2>
    <Level2>
      5.3. The Hector Finance Content is protected worldwide by copyright,
      trademark, or other intellectual property protection legally available.
      Subject to the Terms, Hector Finance grants you a personal, restricted,
      non-exclusive, non-transferable, non-sublicensable, revocable and limited
      license to reproduce portions of Hector Finance Content solely as required
      to use the Services for your personal or internal business purposes.
      Unless otherwise specified by Hector Finance in a separate license, your
      right to use any Hector Finance Content is subject to these Terms.
    </Level2>
    <Level2>
      5.4. You own your User Content. By posting, displaying, sharing or
      distributing User Content on or through the Services, you grant us, and
      the provider of any Third Party Services used in connection with the
      Services, a non-exclusive license to use the User Content solely for the
      purpose of operating the Site and providing the Services. Except as
      prohibited by Applicable Law, we may disclose any information in our
      possession (including User Content) in connection with your use of the
      Services, to (a) comply with any Applicable Law, regulation and/or order
      of a competent authority; (b) enforce these Terms, (c) respond to your
      requests for customer service, (d) protect the rights, property or
      personal safety of Hector Finance, our employees, directors, officers,
      partners, suppliers, customers, agents, or members of the public, or (e)
      for any other purpose legally possible reasonably determined by us.
    </Level2>
    <Level2>
      5.5. You may provide Feedback to Hector Finance through any means, and you
      grant Hector Finance a fully paid, royalty-free, perpetual, irrevocable,
      worldwide, exclusive, and sublicensable right and license to use the
      Feedback for any purpose.
    </Level2>

    <h2>6. Prohibited Conduct</h2>
    <Level2>
      6.1. You may not use the Services for any purpose that is prohibited by
      the Terms or Applicable Law. You may not, including but not limited to,
      (a) use the Site or any Services in order to disguise the origin or nature
      of illicit proceeds of, or to further, any breach of Applicable Laws, or
      to transact or deal in, any contraband Digital Assets, fiat, funds,
      property, or proceeds; (b) use the Site or any Services if any Applicable
      Laws, including but not limited to AML Laws, CTF Laws, Anti-Corruption
      Laws, Economic Sanctions Laws, prohibit, penalize, sanction, or expose the
      Site to liability for any Services furnished or offered to you under these
      Terms; (c) use the Site or any of the Services to facilitate, approve,
      evade, avoid, violate, attempt to to violate, aid or abet the violation
      of, or circumvent any Applicable Laws, including but not limited to AML
      Laws, CTF Laws, Anti-Corruption Laws, and Economic Sanctions Laws; (d) use
      the Site or any Services to evade taxes under the Laws of the British
      Virgin Islands or any other jurisdiction(s) applicable to you or the Site;
      (e) use the Site or any Services to engage in conduct that is detrimental
      to Hector Finance or to any other Site user or any other third party; (f)
      use the Site or any Services to: engage or attempt to engage in wash
      trading, spoofing, fictitious trading or price manipulation; enter orders
      or quotes in any Digital Assets market with the intent to disrupt, or with
      reckless disregard for the adverse impact on, the orderly conduct of
      trading or the fair execution of transactions; or enter orders or quotes
      in any Digital Assets market with the intent of creating the false
      impression of market depth or market interest; or (g) violate, cause a
      violation of, or conspire or attempt to violate these Terms or Applicable
      Laws.
    </Level2>
    <Level2>
      6.2. By accessing the Services, you also agree not to: (a) license, sell,
      rent, lease, transfer, assign, reproduce, distribute, host or otherwise
      commercially exploit the Services or Hector Finance Content, or any
      portion thereof; (b) frame or enclose any trademark, logo, or other Hector
      Finance Content, (including images, text, page layout or form); (c) use
      any metatags or other “hidden text” using Hector Finance’s name or
      trademarks; (d) modify, translate, adapt, merge, make derivative works of,
      disassemble, decompile, reverse compile or reverse engineer any part of
      the Services (except to the extent this restriction is expressly
      prohibited by Applicable Law); (e) use any manual or automated software,
      devices or other processes (including spiders or other data mining tools)
      to “scrape” or download data from the Site or from the Services (except
      that we grant operators of public search engines a revocable permission to
      do so for the sole purpose of creating publicly available searchable
      indices (but not caches or archives) of such content); (f) access the
      Services in order to build similar or competitive services; (g) copy,
      reproduce, distribute, republish, download, display, post or transmit any
      Hector Finance Content except as expressly permitted herein; and (h)
      remove or destroy any copyright notices or other proprietary markings
      contained on or in the Services or Hector Finance Content. Hector Finance,
      its suppliers and service providers reserve all rights not expressly
      granted by these Terms. Any unauthorized use of the Services terminates
      the licenses and/or rights granted by Hector Finance herein.{" "}
    </Level2>
    <Level2>
      6.3. You shall not (and shall not permit any third party to) take any
      action or make available any content on or through the Services that: (a)
      infringes any intellectual property rights of any person or entity; (b) is
      unlawful, threatening, harassing, defamatory, libellous, deceptive,
      fraudulent, invasive of another’s privacy, tortious, obscene, or
      offensive; (c) is unauthorized or unsolicited advertising, junk or bulk
      email; (d) involves commercial activities and/or sales, such as contests,
      sweepstakes, barter, advertising, or pyramid schemes; (e) impersonates any
      person or entity, including any employee or representative of Hector
      Finance; (f) interferes with the proper functioning of the Services; (g)
      engages in any potentially harmful acts directed against the Site or the
      Services, including violating any security features, introducing malware,
      viruses, worms, or similar harmful code into the Site or the Services; or
      (h) attempts to do any of the foregoing.
    </Level2>

    <h2>7. Non-Solicitation; No Investment Advice</h2>
    <Level2>
      7.1. You agree and understand that all usage of the Site and the Services
      is considered unsolicited, which means that you have not received any
      investment, legal, tax or financial advice from us in connection with any
      such usage, and that we do not conduct a suitability review of any such
      usage.
    </Level2>
    <Level2>
      7.2. All information provided within the Site or the Services is for
      informational purposes only and should not be construed as investment,
      legal, tax or financial advice.
    </Level2>

    <h2>8. No Fiduciary Duties</h2>
    <Level2>
      8.1. THESE TERMS ARE NOT INTENDED TO AND DO NOT CREATE OR IMPOSE ANY
      FIDUCIARY DUTIES ON US. TO THE FULLEST EXTENT PERMITTED BY LAW, YOU
      ACKNOWLEDGE AND AGREE THAT WE OWE NO FIDUCIARY DUTIES OR LIABILITIES TO
      YOU OR ANY OTHER PARTY, AND THAT TO THE EXTENT ANY SUCH DUTIES OR
      LIABILITIES MAY EXIST AT LAW OR IN EQUITY, THOSE DUTIES AND LIABILITIES
      ARE HEREBY IRREVOCABLY DISCLAIMED, WAIVED, AND ELIMINATED. YOU FURTHER
      AGREE THAT THE ONLY DUTIES AND OBLIGATIONS THAT WE OWE YOU ARE THOSE SET
      OUT EXPRESSLY IN THESE TERMS.
    </Level2>

    <h2>9. Investigations</h2>
    <Level2>
      9.1. Although Hector Finance does not generally monitor your use of the
      Services, if Hector Finance becomes aware of or suspects any possible
      violations by you of any provision of the Terms or any Applicable Law,
      Hector Finance may investigate such violations and, at its sole
      discretion, take any actions it deems appropriate including but not
      limited to terminating your access to the Services, putting your access to
      the Services on hold, putting your account on hold or terminating it
      permanently.
    </Level2>

    <h2>10. Indemnification</h2>
    <Level2>
      10.1. You agree to indemnify and hold Hector Finance harmless from any
      losses, costs, liabilities and expenses (including legal fees) relating to
      or arising out of: (a) your use of, or inability to use, the Site or the
      Services; (b) your violation of the Terms; (c) your violation of any
      rights of another party, including but not limited to any other users of
      the Services; or (d) your violation of any Applicable Laws. Hector Finance
      may, at its own discretion, assume the exclusive defense and control of
      any matter otherwise subject to indemnification by you, in which event you
      shall fully cooperate with Hector Finance in asserting any available
      defenses. This provision does not require you to indemnify Hector Finance
      for any fraud, gross negligence, or wilful misconduct of Hector Finance.
    </Level2>

    <h2>11. Disclaimer of Warranties</h2>
    <Level2>
      11.1. THE SERVICES ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS,
      WITH ALL FAULTS, AND HECTOR FINANCE EXPRESSLY DISCLAIMS ALL WARRANTIES,
      REPRESENTATIONS, AND CONDITIONS OF ANY KIND ARISING FROM OR RELATED TO
      THESE TERMS OR YOUR USE OF THE SERVICES, INCLUDING BUT NOT LIMITED TO THE
      IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
      PURPOSE. YOU ACKNOWLEDGE THAT, TO THE EXTENT PERMITTED BY APPLICABLE LAW,
      ALL RISK OF USE OF THE SERVICES RESTS ENTIRELY WITH YOU.
    </Level2>
    <Level2>
      11.2. HECTOR FINANCE IS NOT LIABLE, AND YOU AGREE NOT TO SEEK TO HOLD
      HECTOR FINANCE LIABLE, FOR THE CONDUCT OF THIRD PARTIES ON OR ACCESSED VIA
      THE SERVICES, INCLUDING THE USE OF THIRD PARTY SERVICES. THE RISK OF
      DAMAGE, LOSS OR INJURY FROM USE OF SUCH THIRD PARTY SERVICES RESTS
      ENTIRELY WITH YOU.
    </Level2>

    <h2>12. Limitation of Liability</h2>
    <Level2>
      12.1. By using the Services, you acknowledge and agree: (a) to be fully
      responsible and liable for your trading and non-trading actions and
      inactions on the site and all gains and losses sustained from your use of
      the Site and any of the Services; and (b) to be fully responsible for
      safeguarding access to, and any information provided through the Site and
      any of the Services.
    </Level2>
    <Level2>
      12.2. IN NO EVENT WILL HECTOR FINANCE BE LIABLE FOR ANY LOST PROFITS,
      REVENUE OR DATA, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES,
      OR DAMAGES OR COSTS DUE TO LOSS OF PRODUCTION OR USE, BUSINESS
      INTERRUPTION, OR PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES ARISING OUT
      OF OR IN CONNECTION WITH THE SERVICES, WHETHER OR NOT HECTOR FINANCE HAS
      BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, AND REGARDLESS OF THE
      LIABILITY ASSERTED. IF ANY DISCLAIMER OR LIMITATION IN THIS SECTION 12.2.
      IS DEEMED INVALID, UNENFORCEABLE OR INEFFECTIVE BY THE APPLICABLE LAW,
      SUCH DISCLAIMER OR LIMITATION SHALL BE DEEMED MODIFIED TO APPLY TO THE
      MAXIMUM EXTENT PERMITTED BY THE APPLICABLE LAW.
    </Level2>
    <Level2>
      12.3. UNDER NO CIRCUMSTANCES WILL HECTOR FINANCE BE LIABLE TO YOU FOR
      DAMAGES ARISING OUT OF YOUR USE OF THE SERVICES EXCEEDING 100 USD. IF ANY
      DISCLAIMER OR LIMITATION IN THIS SECTION 12.3. IS DEEMED INVALID,
      UNENFORCEABLE OR INEFFECTIVE BY THE APPLICABLE LAW, SUCH DISCLAIMER OR
      LIMITATION SHALL BE DEEMED MODIFIED TO APPLY TO THE MAXIMUM EXTENT
      PERMITTED BY THE APPLICABLE LAW.
    </Level2>
    <Level2>
      12.4. THE LIMITATIONS IN SECTIONS 12.1. AND 12.2. WILL NOT APPLY TO
      DAMAGES CAUSED BY FRAUD, GROSS NEGLIGENCE, OR WILFUL MISCONDUCT OF HECTOR
      FINANCE, OR TO THE EXTENT SUCH LIMITATIONS ARE PRECLUDED BY APPLICABLE LAW
      (IN WHICH CASE HECTOR FINANCE’S LIABILITY SHALL BE INCREASED TO THE
      MINIMUM AMOUNT REQUIRED TO COMPLY WITH SUCH LAW).
    </Level2>

    <h2>13. Term and Termination</h2>
    <Level2>
      13.1. The Terms commence on the date when you accept them (as described in
      the preamble above) and remain in full force and effect for so long as you
      access the Site or use the Services, unless terminated earlier in
      accordance with the Terms.
    </Level2>
    <Level2>
      13.2. Hector Finance may, at any time and for any reason, cease providing
      the Site or any or all of the Services, and/or terminate the Terms.
      Without limiting the foregoing, we may also terminate your access to any
      or all of the Hector Finance Content and/or the Services.
    </Level2>
    <Level2>
      13.3. Upon termination of the Services, your right to use the Services
      will automatically terminate immediately. Hector Finance will not have any
      liability whatsoever to you for any suspension or termination. All
      provisions of the Terms which by their nature should survive termination
      of these Terms or the Services will do so, including but not limited to
      Sections 3, 5, 7, 7,10, 11, 12, 13.4 and 13.
    </Level2>

    <h2>14. Miscellaneous</h2>
    <Level2>
      14.1. Communications to you from Hector Finance use electronic means,
      whether made via the Services or sent via email, or whether Hector Finance
      posts notices on the Services. For contractual purposes, you (1) consent
      to receive communications from Hector Finance in an electronic form; and
      (2) agree that all terms and conditions, agreements, notices, disclosures,
      and other communications that Hector Finance provides to you
      electronically satisfy any legal requirement that such communications
      would satisfy if it were to be in writing in a physical copy. The
      foregoing shall not affect your statutory rights.
    </Level2>
    <Level2>
      14.2. Where Hector Finance requires that you provide an email address, you
      are responsible for providing Hector Finance with your most current and
      correct email address. In the event that the last email address you
      provided to Hector Finance is not valid, or for any reason is not capable
      of delivering to you any notices required/permitted by the Terms, Hector
      Finance’s dispatch of the email containing such notice will nonetheless
      constitute effective notice. You may give notice to Hector Finance at the
      following email address only: privacy@hector.finance. Such notice shall be
      deemed delivered when the receipt of such notice is confirmed by Hector
      Finance to the email address you provided to Hector Finance.
    </Level2>
    <Level2>
      14.3. The Terms, and your rights and obligations hereunder, may not be
      assigned, subcontracted, delegated or otherwise transferred by you without
      the prior written consent of Hector Finance. Any attempt by you to assign
      these Terms without written consent is void. These Terms, and any of the
      rights, duties, and obligations contained herein, are freely assignable by
      Hector Finance without notice or your consent.
    </Level2>
    <Level2>
      14.4. Hector Finance will not be liable for any delay or failure to
      perform resulting from causes outside its reasonable control, including
      but not limited to acts of God, war, terrorism, riots, pandemics or
      epidemics, embargos, acts of civil or military authorities, fire, floods,
      accidents, strikes or shortages of transportation facilities, fuel,
      energy, labor or materials.
    </Level2>
    <Level2>
      14.5. If you have any questions, feedback, complaints or claims with
      respect to the Services, please contact us at: privacy@hector.finance. We
      will do our best to address your concerns.
    </Level2>
    <Level2>
      14.6. These Terms and any action related thereto shall be governed by and
      shall be construed in accordance with the Laws of the British Virgin
      Islands. All claims and disputes arising under or relating to this
      Agreement are to be settled exclusively by the competent courts in the
      British Virgin Islands. For the avoidance of doubt, and without limiting
      the generality of the foregoing, this provision expressly applies to any
      claim, whether in tort, contract or otherwise, against Hector Finance. You
      irrevocably and unconditionally agree and consent to the jurisdiction and
      venue of the courts of the British Virgin Islands, and you waive any
      objections thereto, including under the doctrine of forum non conveniens
      or other similar doctrines. You and Hector Finance agree that any Party
      hereto may bring claims against the others only on an individual basis and
      not as a plaintiff or class member in any purported class or
      representative action or proceeding. Any relief awarded to any one user of
      the Services cannot and may not affect any other users of the Services.
    </Level2>
    <Level2>
      14.7. Any waiver of any provision of the Terms on one occasion will not be
      deemed a waiver of any other provision or of such provision on any other
      occasion. Any delay or failure in exercising any right shall not
      constitute a waiver unless such waiver is confirmed in writing.
    </Level2>
    <Level2>
      14.8. If any part of any section of these Terms is held invalid or
      unenforceable, that part will be construed in a manner to reflect, as
      nearly as possible, its original meaning while remaining valid and
      enforceable or if not possible shall be deemed deleted and the remaining
      part of the section and/or of these Terms will remain in full force and
      effect.
    </Level2>
    <Level2>
      14.9. These Terms are the final, complete and exclusive agreement between
      you and Hector Finance with respect to the subject matter hereof and
      supersedes and merges all prior discussions, agreements or representations
      between you and Hector Finance with respect to such subject matter.
    </Level2>
  </div>
);

export const Privacy: VFC = () => (
  <div className="space-y-5">
    <h1>Privacy Policy</h1>
    <h2>Privacy Notice</h2>
    <p>
      Welcome to the Hector Finance platform (“we”, “us” or “Hector Finance”).
      Hector Finance is developing an ecosystem which consists of various
      innovative developments and applications (“Services”). The Hector Finance
      platform is accessible on www.hector.finance and any other sites or
      subdomains of Hector Finance (“Site”).
    </p>
    <p>
      To provide our Services we may collect some of your data some of which may
      under certain circumstances be considered personal information. We at
      Hector Finance are committed to fully protecting your privacy and being a
      responsible and transparent custodian of the information we collect.
    </p>
    <p>
      Therefore, please find all the necessary information on how we may collect
      and process your personal data gathered in connection with your use of our
      Site and our Services in this Privacy Notice.
    </p>

    <hr />
    <p>
      Notice: Please, read this Privacy Notice carefully and in addition to the
      Terms and Conditions to understand our practices regarding the information
      that may be considered personal. If you do not wish for your personal
      information to be used in the manner described herein, you should not
      access our Site and all subdomains thereof, utilise our Services,
      participate in the offering of our tokens or otherwise provide Hector
      Finance with your information which may be considered personal.
    </p>
    <p>
      Please ensure that any relevant individuals are made aware of this Privacy
      Notice prior to providing their information to us or us obtaining their
      information from another source. In such a case, you or they must first
      ensure that you or they have the authority and appropriate legal basis to
      do so.
    </p>
    <p>
      We do not knowingly collect or ask for data, including personal
      information, from people under the age of 18. If you are such a person,
      please do not use our Service or send us your data. Otherwise be informed
      that we erase such data the moment we learn it is collected from a person
      under the age of 18.
    </p>
    <hr />

    <h2>Who processes your data?</h2>
    <p>
      The administrator of our Site, provider of the Services and thus
      controller of your personal information processed in connection for
      purposes described hereinbelow is Hector Enterprise Inc.
    </p>
    <p>
      Registered office: Trinity Chambers, PO Box 4301, Road Town, Tortola,
      British Virgin Islands
    </p>
    <p>
      If you have any questions regarding our privacy policy or data protection,
      feel free to contact us through our contact form.
    </p>
    <p>
      We will usually respond to all legitimate enquiries within 30 days.
      Occasionally it may take us longer if your request is particularly complex
      or you have made numerous requests. We will notify you and keep you
      updated.
    </p>

    <h2>What types of information may be collected?</h2>
    <p>
      &apos;Personal information&apos; is any information that, either alone or
      in combination with other data, enables an individual to be directly or
      indirectly identified (for example, name, email address, contact details,
      or any unique identifier such as an internet protocol address (‘IP
      address’), device ID or other online identifier).
    </p>
    <p>We may collect the following basic personal information from you:</p>
    <ul className="ml-4 list-inside list-disc">
      <li>
        various information voluntarily provided to us when you communicate with
        us via e-mail, on social media or other channels, when you register for
        our updates and when you respond to our communications or requests for
        information (for example, your name, contact information, title and
        other personal information about you);
      </li>
      <li>
        your wallet address, any other cryptocurrency wallet address or bank
        account details and any related transaction details recorded by any
        blockchain on which our tokens are based or utilised for due provision
        of our Services to you;
      </li>
      <li>
        your IP address and other online identifiers while using our Site; and
        Cookies utilised by our Site in a manner described hereinbelow.
      </li>
    </ul>

    <h2>Cookies and similar technologies</h2>
    <p>
      Similar to other websites, our Site utilises browser cookies (small text
      files stored on a user’s web browser when you visit a website), web
      beacons and similar tracking technologies (collectively, Cookies) to
      collect and store certain information on how you use, access, or interact
      with our Site. We may, for example, use Cookies to collect information
      about the type of your device you use to access the Site, your browser
      type, your IP address or other identifier, your general geographic
      location as indicated by your IP address, features you access on the Site,
      whether and how you interact with content available on the Site.
    </p>
    <p>
      We use Cookies to remember your preferences and settings, to remember
      information that you may enter online, to generate aggregate statistics
      about how people use our Services, to help you share content with others
      and to improve your experience of the Services.
    </p>
    <p>
      You can choose how Cookies are handled by your device through your browser
      or through our cookie banner, including refusing or deleting all Cookies.
      If you choose to receive no Cookies at any time, websites may not function
      properly and certain services may not be provided. Each browser and device
      is different, so check the settings menu of the browser or device you are
      using to learn how to change your advertising settings and Cookie
      preferences.
    </p>

    <h2>Information we may collect from third party sources</h2>
    <p>
      We may receive information about you from other sources, including third
      parties that can lawfully share the information with us and help us
      update, expand, and analyse our records, prevent or detect fraud or other
      suspicious activities and process payments. In addition, our Site may also
      include integrated content or links to content provided by third parties
      (such as live chat, social media content, plug-ins and applications).
    </p>
    <p>
      Please be informed that we do not process special categories of personal
      data (such biometric data, data concerning health, racial or ethnic
      origin, political opinions, etc.).
    </p>
    <p>
      We do not use either automated decision-making or profiling in terms of
      your personal information you provide to us.
    </p>

    <h2>How may we use the data we collect?</h2>
    <p>
      We may use the information gathered primarily for the following purposes:
    </p>
    <ul className="ml-4 list-inside list-disc">
      <li>
        to provide you with our Services and other services that you request
        including, as applicable, supplying, and processing your payment for our
        tokens and any other Services to be provided to you on our Site;
      </li>
      <li>
        to respond to your enquiries or to any problems that may arise (such as
        difficulties in purchasing our tokens, navigating our Site or accessing
        certain services or features);
      </li>
      <li>to make payments to you;</li>
      <li>
        to inform you of important changes or developments to our Services or
        policies and to provide you with technical, support or administrative
        notifications.
      </li>
    </ul>

    <h2>Fulfilment of legal requirements</h2>
    <p>We may also use the information we collect:</p>
    <ul className="ml-4 list-inside list-disc">
      <li>
        to conduct know-your-client and anti-money laundering and other
        sanctions checks (or to verify those carried out by third party sources)
        if we are required to do so by law; and
      </li>

      <li>
        as is necessary, advisable or appropriate to comply with our legal or
        regulatory obligations and to respond to legal, regulatory, arbitration
        or government process or requests for information issued by respective
        government authorities.
      </li>
    </ul>

    <h2>Development of our Services</h2>
    <ul className="ml-4 list-inside list-disc">
      <li>
        to send you marketing communications, and other information or materials
        that may be of interest to you
      </li>
      <li>
        to maintain our list of contacts for purpose of such communication;
      </li>
      <li>
        to understand how people use our Site, including by generating and
        analysing statistics and user trends, and to evaluate, administer,
        maintain and improve our Site and Services;
      </li>
      <li>for internal development of new products or services;</li>
      <li>
        for our internal business purposes, including data analysis, invoicing
        and detecting, preventing, and responding to actual or potential fraud,
        illegal activities, or intellectual property infringement; and
      </li>
      <li>
        to assess the effectiveness of our promotional campaigns and
        publications.
      </li>
    </ul>

    <h2>Protection or enforcement of rights</h2>
    <ul className="ml-4 list-inside list-disc">
      <li>to protect or defend your rights and legitimate interests;</li>
      <li>
        to protect our or any third parties’ rights and legitimate interests;
      </li>
      <li>to enforce our or any third parties’ claims; and</li>
      <li>to deal with any other respective dispute, if necessary.</li>
    </ul>

    <h2>Enhancing our Services with aggregated data</h2>
    <ul className="ml-4 list-inside list-disc">
      <li>
        we may aggregate personal and other data captured through our Site so
        that the data is no longer capable of identifying any individual;
      </li>
      <li>
        we reserve the right to use this aggregated information for the purposes
        of improving and enhancing our services, generating insights, for use in
        marketing and otherwise for the purposes of our business. Provided that
        such aggregated data does not directly or indirectly identify you as an
        individual, this data is not considered to be personal information for
        the purpose of this Privacy Notice.
      </li>
    </ul>
    <p>
      We retain the information we collect for no longer than is reasonably
      necessary to fulfil the above purposes and to comply with our legal
      obligations.
    </p>

    <h2>What legal grounds do we rely on?</h2>
    <p>
      Your personal information as described above is processed by us on a basis
      of the following legal grounds:
    </p>
    <Level2>
      Taking steps prior to entering into a contract and necessity for
      performance of a contract with you – We may need to collect and use your
      personal information in order to enter into a contract with you or to
      perform a contract that you have with us, for example, when you provide
      personal information to us in order to purchase our tokens, if necessary
      for such purchase.
    </Level2>
    <Level3>
      In such a case, the provision of your data is necessary in order to enter
      into a contract and also a contractual requirement as without such data we
      are not able to enter into a contract with you.
    </Level3>
    <Level2>
      Compliance with legal obligations – We may process your personal
      information as may be required by respective legal or regulatory
      obligations that may apply to us.
    </Level2>
    <Level3>
      In this case, the provision of your data is a statutory requirement
      without which we are not able to comply with our legal obligations.
    </Level3>
    <Level2>
      Our legitimate interests – We may use your personal information for our
      legitimate interests to improve our Services, thus maintain and develop
      our business activities as well as to protect and enforce our or third
      party’s rights, if necessary.
    </Level2>
    <Level3>
      Please be informed that you have the right at any time to object to the
      processing of your personal information which is based on our or third
      party’s legitimate interest.
    </Level3>
    <Level2>
      Your consent – We send to you direct marketing e-mails upon your previous
      consent. Each such e-mail also contains a link that allows you to opt-out
      from receiving such e-mails, update your contact information or change
      your preferences at any time.
    </Level2>
    <Level3>
      To withdraw any consent to processing your personal information, please
      use our electronic form or by clicking on a link provided in every e-mail
      sent to you to unsubscribe from such marketing electronic communication.
    </Level3>

    <h2>How may we share the information we collect?</h2>
    <p>We may disclose information: </p>
    <ul className="ml-4 list-inside list-disc">
      <li>
        to our current or future affiliated companies, their respective parent
        companies, subsidiaries or joint ventures, if sharing the data with them
        is necessary to fulfil the purpose of the data processing. These
        companies may process such data as a processor on our behalf and we will
        ensure that such activities are subject to contractual obligations on
        privacy, security and other matters in accordance with this Privacy
        Notice;
      </li>
      <li>
        to our partners and third-party service providers that perform certain
        services to use on our behalf (for example, marketing companies,
        web-hosting companies, analytics providers and information technology
        providers). In these circumstances contractual and other technical and
        security safeguards will be put in place with the partner or service
        provider, including to ensure that your personal information is
        processed only in accordance with this Privacy Notice;
      </li>
      <li>
        to law enforcement, other government authorities, or third parties
        (within or outside the jurisdiction in which you reside) as may be
        permitted or required by the laws of any jurisdiction that may apply to
        us. In these circumstances, we will take reasonable efforts to notify
        you before we disclose your information, unless prior notice is
        prohibited by applicable law or is not possible or reasonable in the
        circumstances;
      </li>
      <li>
        to service providers, advisors, potential transactional partners, or
        other third parties in connection with the completion of a transaction
        in which we are acquired by or merged with another company or we sell,
        liquidate, or transfer all or a portion of our assets. Upon completion
        of such a transaction, your personal information will continue to be
        processed in accordance with this Privacy Notice, except as otherwise
        agreed by you or permitted by applicable law;
      </li>
      <li>
        to partners, financial institutions or service providers who may request
        such information in connection with providing services to us, including
        banking services, and only where we enter into an agreement with such
        institutions to limit their use and handling of personal information in
        accordance with this Privacy Notice.
      </li>
    </ul>
    <p>
      Important note: We do not sell, rent, or otherwise share personal
      information that reasonably identifies you or your organisation with
      unaffiliated entities for their independent use except as expressly
      described in this Privacy Notice or with your prior separate consent. We
      may share information that does not reasonably identify you or your
      organisation as permitted by applicable law.
    </p>
    <p>
      When you voluntarily make your personal information available online in
      our environment shared by third parties (for example, on messaging
      applications, social media, message boards, web logs, or emails), that
      personal information may be viewed, saved, collected, heard, used and/or
      shared by third parties outside of Hector Finance. We are not responsible
      for any unauthorised third party using such information. Please be mindful
      whenever you share any information in such environments.
    </p>
    <p>
      Our Site may include integrated content or links to third parties’ content
      (for example, social media content, plug-ins and applications, video
      materials, etc.) which are governed by the third parties’ privacy settings
      and policies, which may differ from this Privacy Notice. This Privacy
      Notice does not address, and we are not responsible for or able to
      control, the privacy, security, or other practices of such third parties.
    </p>

    <h2>How do we protect your information?</h2>
    <p>
      We deploy organisational, technical and physical safeguards designed to
      protect the information that we collect. This includes, when required or
      appropriate and feasible, obtaining written assurances from third parties
      that may access your personal information that they will protect the
      information with safeguards designed to provide a level of protection
      equivalent to that adopted by Hector Finance.
    </p>
    <p>
      We may store the information we collect on our servers both cloud-based or
      in servers located in countries where we or our service providers have
      facilities. Therefore, we may transfer information to countries outside of
      your country of residence which may include countries outside the EU
      member states.
    </p>
    <p>
      Please note that if you are the EU citizen and provide us with your
      personal information, it may then be transferred for the purposes stated
      herein to third countries outside the EU/EEA under conditions set in this
      Privacy Notice and you consent to this by using our Site or Services.
    </p>

    <h2>What are your rights?</h2>
    <p>
      You have the right to withdraw your consent at any time, without affecting
      the lawfulness of processing based on consent before its withdrawal.
      Therefore, the marketing e-mails we send to you include the opt-out link
      for you to unsubscribe from receiving such communication (as well as
      update your contact information). We will honour your choice and without
      delay refrain from sending you such e-mails.
    </p>
    <p>
      Under local law, you may have certain rights regarding processing of your
      personal information, in particular, you have the right to request: (i)
      access to your personal information, (ii) rectification or erasure of your
      personal information, (iii) restriction of processing concerning you, (iv)
      objection to processing that is based upon our legitimate interests (as
      already stated above), and (v) data portability to other service
      providers.
    </p>
    <p>
      We are committed to working with you to obtain a fair resolution of any
      complaint or concern about your privacy. If, however, you believe that we
      have not been able to assist with your complaint or concern, you may have
      the right to lodge a complaint with a respective supervisory data
      protection authority, as applicable, in your jurisdiction.
    </p>
    <p>If you would like to contact us, please use the methods stated above.</p>
    <p>
      Your ability to exercise these rights will depend on a number of factors
      and, in some instances, we will not be able to comply with your request,
      for example because we have legitimate grounds for not doing so or where
      the right doesn’t apply to the particular information we hold on you.
      Where so entitled to access to your personal information, you will not
      have to pay a fee unless your request is clearly unfounded, repetitive or
      excessive (upon which we may charge a reasonable fee or refuse to comply
      with your request). If you would like to discuss or exercise the rights
      you may have, you can contact us through the methods stated above.
    </p>
    <p>
      Please keep us informed if your personal information changes whilst we
      continue to retain such information. We encourage you to contact us to
      update or correct your information if it changes or if you believe that
      any information that we have collected about you is inaccurate or out of
      date.
    </p>

    <h2>Final provisions</h2>
    <p>
      We may update this Privacy Notice from time to time and we encourage you
      to periodically review this Privacy Notice. If we make any material
      changes to this Privacy Notice regarding the way we collect, use, and/or
      share the personal information that you have provided, we will notify you
      by posting notice of the changes on the Site or, if we hold your email
      address, by email.
    </p>
    <p>
      The use of certain of our Services may also be governed by other
      applicable terms and policies regarding privacy and the sharing of
      personal information, which supplement, and should be reviewed alongside,
      this Privacy Notice.
    </p>
    <p>
      Unless otherwise defined in this Privacy Notice, terms used have the same
      meaning as in the Terms and Conditions.
    </p>
    <p>Effective Date: 10 May 2022</p>
  </div>
);

export const Disclaimer: VFC = () => (
  <div className="space-y-5">
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
  </div>
);
