import type { ReactElement, ReactNode } from "react";

// A record's facts: label left, value right on one row at every width (Apple LabeledContent and Settings rows; Aaron
// 11/19 "Summary figures are plain label-left, value-right rows"). A long value (an address, a note) goes under its
// label instead of wrapping beside it; nothing is cut (11/23). A missing value is a word, never a blank or $0.00.

export type Fact = {
  label: string;
  value: ReactNode;
  /** Long text: the value goes under the label. */
  long?: boolean;
  /** Money, counts, dates: figures line up (tabular). */
  numeric?: boolean;
  /** One way to change it in place (an Edit text button). */
  action?: ReactElement | null;
};

export default function DescriptionList({ facts, empty = "None", className }: { facts: readonly Fact[]; empty?: string; className?: string }) {
  return (
    <dl className={["ui-dl", className].filter(Boolean).join(" ")}>
      {facts.map((f) => {
        const missing = f.value == null || f.value === "";
        return (
          <div key={f.label} className={["ui-dl-row", f.long ? "ui-dl-long" : ""].filter(Boolean).join(" ")}>
            <dt className="ui-dl-label">{f.label}</dt>
            <dd className={["ui-dl-value", f.numeric ? "ui-dl-num" : "", missing ? "ui-dl-missing" : ""].filter(Boolean).join(" ")}>
              {missing ? empty : f.value}
            </dd>
            {f.action ? <dd className="ui-dl-act">{f.action}</dd> : null}
          </div>
        );
      })}
    </dl>
  );
}
