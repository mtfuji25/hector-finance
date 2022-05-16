import Decimal from "decimal.js";
import { useEffect, useMemo, useState } from "react";
import { BLOCK_RATE_SECONDS } from "src/constants";
import { EpochInfo, getEpochInfo } from "src/contracts/stakingContract";
import { getBlockNumber } from "src/provider";
import { prettifySeconds } from "src/util";
import { useWallet, WalletState } from "src/wallet";

function RebaseTimer() {
  const wallet = useWallet();
  const [currentBlock, setCurrentBlock] = useState<string>();
  const [endBlock, setEndBlock] = useState<Decimal>();

  const SECONDS_TO_REFRESH = 60;
  const [secondsToRebase, setSecondsToRebase] = useState<Decimal>();
  const [rebaseString, setRebaseString] = useState("");
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  useEffect(() => {
    const getBlockInfo = async () => {
      if (wallet.state === WalletState.Connected) {
        const currentBlockNumber = await getBlockNumber(wallet.provider);
        if (currentBlockNumber.isOk) {
          setCurrentBlock(currentBlockNumber.value);
        }
        const epoch = await getEpochInfo(wallet.provider);
        if (epoch.isOk) {
          setEndBlock(epoch.value.endBlock);
        }
      }
    };
    getBlockInfo();
  }, [wallet]);

  function secondsUntilBlock(startBlock: string, endBlock: Decimal) {
    const blocksAway = endBlock.minus(new Decimal(startBlock));
    const secondsAway = blocksAway.times(BLOCK_RATE_SECONDS);
    return secondsAway;
  }

  // This initializes secondsToRebase as soon as currentBlock becomes available
  useMemo(() => {
    const initializeTimer = () => {
      if (currentBlock && endBlock) {
        const seconds = secondsUntilBlock(currentBlock, endBlock);
        setSecondsToRebase(seconds);
        const prettified = prettifySeconds(seconds);
        setRebaseString(prettified !== "" ? prettified : "Less than a minute");
      }
    };
    initializeTimer();
  }, [currentBlock, endBlock]);

  // After every period SECONDS_TO_REFRESH, decrement secondsToRebase by SECONDS_TO_REFRESH,
  // keeping the display up to date without requiring an on chain request to update currentBlock.
  useEffect(() => {
    let interval: number | undefined = undefined;
    if (secondsToRefresh > 0) {
      interval = window.setInterval(() => {
        setSecondsToRefresh((secondsToRefresh) => secondsToRefresh - 1);
      }, 1000);
    } else {
      // When the countdown goes negative, reload the app details and reinitialize the timer
      if (secondsToRebase?.lessThan(0)) {
        async function reload() {
          // await dispatch(
          //   loadAppDetails({ networkID: chainID, provider: provider }),
          // );
        }
        reload();
        setRebaseString("");
      } else {
        clearInterval(interval);
        setSecondsToRebase((secondsToRebase) =>
          secondsToRebase?.minus(SECONDS_TO_REFRESH),
        );
        setSecondsToRefresh(SECONDS_TO_REFRESH);
        if (secondsToRebase) {
          const prettified = prettifySeconds(secondsToRebase);
          setRebaseString(
            prettified !== "" ? prettified : "Less than a minute",
          );
        }
      }
    }
    return () => clearInterval(interval);
  }, [secondsToRebase, secondsToRefresh]);

  return (
    <div>
      {" "}
      {currentBlock ? (
        secondsToRebase?.greaterThan(0) ? (
          <div className="dark:text-gray-200">
            <span className="font-medium ">{rebaseString}</span> to next rebase
          </div>
        ) : (
          <strong className="dark:text-gray-200">rebasing</strong>
        )
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default RebaseTimer;
