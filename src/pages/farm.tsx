import { NextPage } from "next";
import Head from "next/head";
import { useState, VFC } from "react";
import { Radio, RadioGroup } from "src/components/BasicInput";
import { DappPage } from "src/components/DappPage";
import { FarmDaiTorUsdc } from "src/components/FarmDaiTorUsdc";
import {
  SpookyFtmTorFarm,
  SpookyFtmWshecFarm,
} from "src/components/FarmSpooky";
import { PageHeader, PageSubheader } from "src/components/Header";
import { StaticImg } from "src/components/StaticImg";
import {
  FANTOM_DAI,
  FANTOM_TOR,
  FANTOM_USDC,
  FANTOM_WFTM,
  FANTOM_wsHEC,
} from "src/constants";

enum FarmType {
  DaiTorUsdc,
  FtmTor,
  FtmHec,
}

const FarmPage: NextPage = () => {
  const [farm, setFarm] = useState(FarmType.DaiTorUsdc);

  return (
    <DappPage>
      <main className="w-full space-y-5">
        <Head>
          <title>Farm — Hector Network</title>
        </Head>
        <div className="">
          <PageHeader>Farm</PageHeader>
          <PageSubheader>
            Earn passive income by lending to Hector
          </PageSubheader>
        </div>
        <RadioGroup>
          <Radio
            checked={farm === FarmType.DaiTorUsdc}
            onCheck={() => setFarm(FarmType.DaiTorUsdc)}
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <StaticImg src={FANTOM_DAI.logo} alt="" className="h-6 w-6" />
                <StaticImg src={FANTOM_TOR.logo} alt="" className="h-6 w-6" />
                <StaticImg src={FANTOM_USDC.logo} alt="" className="h-6 w-6" />
              </div>
              DAI + TOR + USDC
            </div>
          </Radio>
          <Radio
            checked={farm === FarmType.FtmTor}
            onCheck={() => setFarm(FarmType.FtmTor)}
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <StaticImg src={FANTOM_WFTM.logo} alt="" className="h-6 w-6" />
                <StaticImg src={FANTOM_TOR.logo} alt="" className="h-6 w-6" />
              </div>
              FTM + TOR
            </div>
          </Radio>
          <Radio
            checked={farm === FarmType.FtmHec}
            onCheck={() => setFarm(FarmType.FtmHec)}
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <StaticImg src={FANTOM_WFTM.logo} alt="" className="h-6 w-6" />
                <StaticImg src={FANTOM_wsHEC.logo} alt="" className="h-6 w-6" />
              </div>
              FTM + wsHEC
            </div>
          </Radio>
        </RadioGroup>
        <Farm type={farm} />
      </main>
    </DappPage>
  );
};

const Farm: VFC<{ type: FarmType }> = ({ type }) => {
  switch (type) {
    case FarmType.DaiTorUsdc:
      return <FarmDaiTorUsdc />;
    case FarmType.FtmHec:
      return <SpookyFtmWshecFarm />;
    case FarmType.FtmTor:
      return <SpookyFtmTorFarm />;
  }
};

export default FarmPage;
