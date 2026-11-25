"use client";

import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";

// A line counted against paper (receiving a PO is the first use: specs/receiving UX.md X1 to X7).
//
// At rest a line is its number on the paper, its name and its numbers; it holds no input (U2). The whole line is one
// target that opens the line for counting, and one mark button sits in the same column on every line (U1). The line
// target and the mark are siblings, never nested, so a tap on the mark cannot open the line.
//
// Phone: the count ("12 of 44 EA") sits under the name, right-aligned at the same x on every line, with a short note
// ("32 left") at the left of that same line. Two name lines and the numbers fit the 72 px row budget (U4).
// Desk (900 px and up): the numbers become `cells`, right-aligned columns under a CountHead, and the phone count hides.

export type CountMark = {
  /** The word under the check: "Received". */
  label: string;
  /** Spoken name, when the word alone does not say which line. */
  "aria-label"?: string;
  /** Marked: the check is filled and stays in the column. */
  done?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export default function CountRow({
  n,
  title,
  code,
  note,
  count,
  cells,
  mark,
  onOpen,
  openLabel,
  done = false,
  className,
}: {
  /** The line's number on the paper. */
  n?: ReactNode;
  title: ReactNode;
  /** The item's code, after the name. */
  code?: ReactNode;
  /** Phone: what is short on this line ("32 left"). Shown only when there is something to say. */
  note?: ReactNode;
  /** Phone: the count against the paper ("12 of 44 EA"). */
  count?: ReactNode;
  /** Desk: one value per CountHead column, in order. */
  cells?: readonly ReactNode[];
  mark?: CountMark;
  /** Opens the line for counting. */
  onOpen?: () => void;
  openLabel?: string;
  /** Fully counted: the line stays in its place, tinted. */
  done?: boolean;
  className?: string;
}) {
  const body = (
    <>
      {n != null ? <span className="ui-countrow-n">{n}</span> : null}
      <span className="ui-row-main ui-countrow-text">
        <span className="ui-countrow-title">
          {title}
          {code ? <span className="ui-countrow-code"> ({code})</span> : null}
        </span>
        {note || count ? (
          <span className="ui-countrow-nums">
            <span className="ui-countrow-note">{note}</span>
            <span className="ui-countrow-qty">{count}</span>
          </span>
        ) : null}
      </span>
      {cells?.length ? (
        <span className="ui-countrow-cells">
          {cells.map((c, i) => (
            <span key={i} className="ui-countrow-cell">
              {c}
            </span>
          ))}
        </span>
      ) : null}
    </>
  );
  return (
    <div className={["ui-countrow", cells?.length ? "ui-countrow-cols" : "", done ? "ui-countrow-done" : "", className ?? ""].filter(Boolean).join(" ")}>
      {onOpen ? (
        <AriaButton className="ui-countrow-hit" onPress={onOpen} aria-label={openLabel}>
          {body}
        </AriaButton>
      ) : (
        <span className="ui-countrow-hit">{body}</span>
      )}
      {mark ? (
        <span className="ui-countrow-act">
          <AriaButton
            className={["ui-countrow-mark", mark.done ? "ui-countrow-mark-done" : ""].filter(Boolean).join(" ")}
            aria-label={mark["aria-label"]}
            isDisabled={mark.disabled}
            onPress={mark.onPress}
          >
            <Check size={18} aria-hidden />
            <span>{mark.label}</span>
          </AriaButton>
        </span>
      ) : null}
    </div>
  );
}

/** Desk only: the names of the number columns over a list of CountRows. `cells` matches each row's `cells`. */
export function CountHead({ n, title, cells }: { n?: ReactNode; title: ReactNode; cells: readonly ReactNode[] }) {
  return (
    <div className="ui-counthead" role="presentation">
      <span className="ui-countrow-n">{n}</span>
      <span className="ui-countrow-text">{title}</span>
      <span className="ui-countrow-cells">
        {cells.map((c, i) => (
          <span key={i} className="ui-countrow-cell">
            {c}
          </span>
        ))}
      </span>
      <span className="ui-countrow-act" />
    </div>
  );
}
