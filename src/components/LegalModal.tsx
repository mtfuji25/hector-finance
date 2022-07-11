import { FC, useEffect, useState, VFC } from "react";
import { Modal } from "./Modal";
import { Checkbox } from "./BasicInput";
import { Submit } from "./Submit";
import Link from "next/link";

export const Legal: VFC = () => {
  type LegalState =
    | { type: "Accepted" }
    | { type: "Unknown" }
    | { type: "Unaccepted" };
  const [legal, setLegal] = useState<LegalState>({
    type: "Unknown",
  });

  const STORAGE_KEY = "LEGAL_ACCEPTED_AT";
  useEffect(() => {
    const legalAcceptance = localStorage.getItem(STORAGE_KEY);
    if (legalAcceptance == undefined) {
      setLegal({ type: "Unaccepted" });
      return;
    }
    try {
      Number.parseInt(legalAcceptance);
      setLegal({ type: "Accepted" });
    } catch {
      setLegal({ type: "Unaccepted" });
    }
  }, []);

  return (
    <>
      {legal.type === "Unaccepted" && (
        <LegalModal
          onAccept={() => {
            const time = Date.now();
            setLegal({ type: "Accepted" });
            localStorage.setItem(STORAGE_KEY, time.toString());
          }}
        />
      )}
    </>
  );
};

const LegalModal: VFC<{
  onAccept: () => void;
}> = ({ onAccept }) => {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedDisclaimer, setAgreedDisclaimer] = useState(false);
  const canAccept = agreedTerms && agreedPrivacy && agreedDisclaimer;

  return (
    <Modal className="max-w-md">
      <div className="space-y-5 p-6">
        <div>
          Before participating in Hector Finance, you must understand and accept
          our{" "}
          <Link href="/terms" prefetch={false}>
            <a className="underline">Terms &amp; Conditions</a>
          </Link>
          ,{" "}
          <Link href="/privacy" prefetch={false}>
            <a className="underline">Privacy Policy</a>
          </Link>
          , and{" "}
          <Link href="/disclaimer" prefetch={false}>
            <a className="underline">Disclaimer</a>
          </Link>
          .
        </div>
        <div className="">
          The information on this page and all other pages owned, operated by,
          or related to Hector are for educational purposes only and do not
          constitute any sort of advice. Cryptocurrencies, NFTs and other
          blockchain offerings are unregulated assets and users should do
          extensive research into how they work, the potential risks and the tax
          liability of owning them in their native regions. Users should
          carefully read all the documents below before accepting.
        </div>

        <div>
          <Checkbox checked={agreedTerms} onChange={setAgreedTerms}>
            I agree to the{" "}
            <Link href="/terms" prefetch={false}>
              <a className="underline">Terms &amp; Conditions</a>
            </Link>
          </Checkbox>
          <Checkbox checked={agreedPrivacy} onChange={setAgreedPrivacy}>
            I agree to the{" "}
            <Link href="/privacy" prefetch={false}>
              <a className="underline">Privacy Policy</a>
            </Link>
          </Checkbox>
          <Checkbox checked={agreedDisclaimer} onChange={setAgreedDisclaimer}>
            I agree to the{" "}
            <Link href="/disclaimer" prefetch={false}>
              <a className="underline"> Disclaimer </a>
            </Link>
          </Checkbox>
        </div>
        <Submit label="Accept" disabled={!canAccept} onClick={onAccept} />
      </div>
    </Modal>
  );
};
