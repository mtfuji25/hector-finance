import Decimal from "decimal.js";
import { VFC, useState, useEffect } from "react";
import { Chain } from "src/chain";
import { ProviderRpcError, ProviderErrorCode } from "src/provider";
import { asyncEffect, Result, sleep } from "src/util";
import { WriteWallet, ConnectedWallet, WalletState } from "src/wallet";
import { Modal, ModalCloseButton } from "./Modal";
import Circle from "src/icons/circle.svgr";
import SmallSpinner from "src/icons/spinner-small.svgr";
import CircleCheck from "src/icons/circle-check-solid.svgr";
import CircleXmark from "src/icons/circle-xmark.svgr";
import * as Erc20 from "src/contracts/erc20";

export type Transaction = {
  title: string;
  chain: Chain;
  amount: Decimal;
  spender: string;
  token: Erc20.Erc20Token;
  send: (wallet: WriteWallet) => Promise<Result<unknown, ProviderRpcError>>;
};

export const TransactionModal: VFC<{
  wallet: ConnectedWallet;
  tx: Transaction;
  onClose: (success: boolean) => void;
}> = ({ wallet, tx, onClose }) => {
  const [chainTask, setChainTask] = useState(TaskState.Unstarted);
  useEffect(() => {
    return asyncEffect(async (abort) => {
      if (wallet.state === WalletState.CanWrite) {
        setChainTask(TaskState.Complete);
        return;
      }
      setChainTask(TaskState.Working);
      const switched = await wallet.switchChain();
      if (abort()) {
        setChainTask(TaskState.Unstarted);
        return;
      }
      if (!switched.isOk) {
        if (switched.error.code === ProviderErrorCode.UserRejectedRequest) {
          setChainTask(TaskState.Rejected);
        } else {
          setChainTask(TaskState.Failed);
        }
      }
    });
  }, [wallet]);

  const [allowanceTask, setAllowanceTask] = useState(TaskState.Unstarted);
  useEffect(() => {
    setAllowanceTask(TaskState.Unstarted);
    return asyncEffect(async (abort) => {
      if (wallet.state !== WalletState.CanWrite) {
        return;
      }

      setAllowanceTask(TaskState.Working);
      const allowance = await requestAllowance(
        tx.chain,
        tx.token,
        tx.spender,
        tx.amount,
        wallet,
      );

      if (abort()) {
        return setAllowanceTask(TaskState.Unstarted);
      }
      switch (allowance) {
        case "ok":
          setAllowanceTask(TaskState.Complete);
          break;
        case "failed":
          setAllowanceTask(TaskState.Failed);
          break;
        case "rejected":
          setAllowanceTask(TaskState.Rejected);
          break;
      }
    });
  }, [wallet, tx]);

  const [transactionTask, setTransactionTask] = useState(TaskState.Unstarted);
  useEffect(() => {
    setTransactionTask(TaskState.Unstarted);
    return asyncEffect(async (abort) => {
      if (
        wallet.state !== WalletState.CanWrite ||
        allowanceTask !== TaskState.Complete
      ) {
        return;
      }
      setTransactionTask(TaskState.Working);
      const transaction = await tx.send(wallet);
      if (abort()) {
        setTransactionTask(TaskState.Unstarted);
        return;
      }
      if (!transaction.isOk) {
        if (transaction.error.code === ProviderErrorCode.UserRejectedRequest) {
          setTransactionTask(TaskState.Rejected);
        } else {
          setTransactionTask(TaskState.Failed);
        }
        return;
      }
      setTransactionTask(TaskState.Complete);
    });
  }, [wallet, allowanceTask, tx]);

  useEffect(() => {
    const reject =
      chainTask === TaskState.Rejected ||
      transactionTask === TaskState.Rejected ||
      allowanceTask === TaskState.Rejected;
    if (reject) {
      onClose(false);
    }
    const complete =
      chainTask === TaskState.Complete &&
      allowanceTask === TaskState.Complete &&
      transactionTask === TaskState.Complete;
    if (complete) {
      onClose(true);
    }
  }, [chainTask, transactionTask, allowanceTask, onClose]);

  const tasks = [
    { label: "Switch chain", state: chainTask },
    { label: "Accept allowance", state: allowanceTask },
    { label: "Confirm transaction", state: transactionTask },
  ];

  return (
    <Modal className="relative max-w-sm bg-white p-5">
      <ModalCloseButton onClick={() => onClose(false)} />
      <div className="space-y-4">
        <div className="text-xl font-medium">{tx.title}</div>
        <div className="space-y-1">
          {tasks.map((task) => (
            <Task key={task.label} label={task.label} state={task.state} />
          ))}
        </div>
      </div>
    </Modal>
  );
};

enum TaskState {
  Complete,
  Working,
  Failed,
  Rejected,
  Unstarted,
}

const Task: VFC<{ label: string; state: TaskState }> = ({ label, state }) => (
  <div>
    <div className="flex items-center gap-1">
      {state === TaskState.Unstarted && (
        <>
          <Circle className="h-4 w-4 shrink-0 animate-spin text-gray-200" />
          <div className="text-gray-300">{label}</div>
        </>
      )}
      {state === TaskState.Working && (
        <>
          <SmallSpinner className="h-4 w-4 shrink-0 animate-spin text-blue-500" />
          <div>{label}</div>
        </>
      )}
      {state === TaskState.Complete && (
        <>
          <CircleCheck className="h-4 w-4 shrink-0 text-blue-500" />
          <div>{label}</div>
        </>
      )}
      {state === TaskState.Failed && (
        <>
          <CircleXmark className="h-4 w-4 shrink-0 text-red-700" />
          <div>{label}</div>
        </>
      )}
    </div>
  </div>
);

async function requestAllowance(
  chain: Chain,
  token: Erc20.Erc20Token,
  spender: string,
  amount: Decimal,
  wallet: WriteWallet,
): Promise<"ok" | "failed" | "rejected"> {
  let allowance = await Erc20.allowance(chain, token, wallet.address, spender);
  if (!allowance.isOk) {
    return "failed";
  }
  if (allowance.value.gte(amount)) {
    return "ok";
  }
  const approve = await Erc20.approve(
    wallet.provider,
    token,
    wallet.address,
    spender,
    new Decimal(1_000_000_000),
  );
  if (!approve.isOk) {
    if (approve.error.code == ProviderErrorCode.UserRejectedRequest) {
      return "rejected";
    } else {
      return "failed";
    }
  }
  while (true) {
    await sleep(chain.millisPerBlock);
    allowance = await Erc20.allowance(chain, token, wallet.address, spender);
    if (!allowance.isOk) {
      return "failed";
    }
    if (allowance.value.gte(amount)) {
      return "ok";
    }
  }
}
