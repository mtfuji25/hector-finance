import { FC, useEffect, useState, VFC } from "react";
import { Modal } from "./Modal";
import { Checkbox } from "./BasicInput";
import { Submit } from "./Submit";
import { Disclaimer, Privacy, Terms } from "./Legal";
import { classes } from "src/util";
import Chevron from "src/icons/chevron.svgr";

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

  const [viewing, setViewing] = useState<"terms" | "privacy" | "disclaimer">();

  return (
    <Modal className="max-w-md">
      <div className="space-y-5 p-6">
        <Accordion
          title="Terms & Conditions"
          open={viewing === "terms"}
          onChange={(open) => {
            setViewing(open ? "terms" : undefined);
          }}
        >
          <Terms />
        </Accordion>
        <Accordion
          title="Privacy Policy"
          open={viewing === "privacy"}
          onChange={(open) => {
            setViewing(open ? "privacy" : undefined);
          }}
        >
          <Privacy />
        </Accordion>
        <Accordion
          title="Disclaimer"
          open={viewing === "disclaimer"}
          onChange={(open) => {
            setViewing(open ? "disclaimer" : undefined);
          }}
        >
          <Disclaimer />
        </Accordion>

        <div>
          <Checkbox checked={agreedTerms} onChange={setAgreedTerms}>
            I agree to the Terms &amp; Conditions
          </Checkbox>
          <Checkbox checked={agreedPrivacy} onChange={setAgreedPrivacy}>
            I agree to the Privacy Policy
          </Checkbox>
          <Checkbox checked={agreedDisclaimer} onChange={setAgreedDisclaimer}>
            I agree to the Disclaimer
          </Checkbox>
        </div>
        <Submit label="Accept" disabled={!canAccept} onClick={onAccept} />
        <div className="text-center text-sm opacity-50">
          The information on this page and all other pages owned, operated by,
          or related to Hector are for educational purposes only and do not
          constitute any sort of advice. Cryptocurrencies, NFTs and other
          blockchain offerings are unregulated assets and users should do
          extensive research into how they work, the potential risks and the tax
          liability of owning them in their native regions. Users should
          carefully read all the documents above before accepting.
        </div>
      </div>
    </Modal>
  );
};

const Accordion: FC<{
  title: string;
  open: boolean;
  onChange: (open: boolean) => void;
}> = ({ title, open, onChange, children }) => {
  return (
    <div>
      <button
        className="flex w-full items-center bg-gray-200 px-4 py-3 text-left dark:bg-gray-500"
        onClick={() => onChange(!open)}
      >
        <div>{title}</div>
        <Chevron
          className={classes(
            "ml-auto h-auto w-4 object-contain",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={classes(
          "overflow-y-scroll bg-gray-100 transition-all dark:bg-gray-800",
          open ? "max-h-72" : "max-h-0",
        )}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
