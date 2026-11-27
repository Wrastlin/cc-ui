"use client";

import { useEffect, useRef } from "react";
import { MoreHorizontal, X } from "lucide-react";
import Menu from "./ActionMenu";
import Button from "./Button";
import { confirmDialog } from "./dialogs";
import { useNarrow } from "./parts/useNarrow";

// What to do with the ticked rows (gap 7b; Carbon batch action bar, Spectrum ActionBar). It takes the list header's
// place at the top, never a bar at the bottom (Aaron 11/19, 11/20). Left to right: the count with its noun, one or two
// actions (one on a phone), the rest in More, Clear at the far end. A destructive action asks once for the whole set,
// naming the count and the items, and the caller makes one server call; never a confirm per row.

export type BulkAction = {
  id: string;
  /** The verb alone ("Delete", "Mark received"); the bar adds the count where it asks. */
  label: string;
  onAction: () => void;
  /** Asks once before running: "Delete 3 jobs?", the items listed under it. */
  danger?: boolean;
};

export default function ActionBar({
  count,
  noun,
  names,
  actions,
  onClear,
}: {
  count: number;
  /** Singular and plural: { one: "job", other: "jobs" }. */
  noun: { one: string; other: string };
  /** Full names of the ticked items, listed in a danger confirm. */
  names?: readonly string[];
  actions: readonly BulkAction[];
  onClear: () => void;
}) {
  const narrow = useNarrow();
  const countRef = useRef<HTMLSpanElement>(null);
  const shown = count > 0;
  useEffect(() => {
    if (shown) countRef.current?.focus();
  }, [shown]);
  if (!shown) return null;
  const word = count === 1 ? noun.one : noun.other;
  const keep = narrow ? 1 : 2;
  async function run(a: BulkAction) {
    if (a.danger) {
      const list = names?.length ? names.slice(0, 10).join(", ") + (names.length > 10 ? `, and ${names.length - 10} more` : "") : undefined;
      const ok = await confirmDialog({
        title: `${a.label} ${count} ${word}?`,
        body: list,
        confirmLabel: `${a.label} ${count} ${word}`,
        danger: true,
      });
      if (!ok) return;
    }
    a.onAction();
  }
  const rest = actions.slice(keep);
  return (
    <div className="ui-actionbar" role="toolbar" aria-label={`Actions for the selected ${noun.other}`}>
      <span ref={countRef} className="ui-actionbar-count" tabIndex={-1} aria-live="polite">
        {count.toLocaleString("en-US")} {word} selected
      </span>
      <div className="ui-acts">
        {actions.slice(0, keep).map((a) => (
          <Button key={a.id} variant={a.danger ? "danger" : "secondary"} onClick={() => void run(a)}>
            {a.label}
          </Button>
        ))}
        {rest.length ? (
          <Menu
            aria-label={`More for the selected ${noun.other}`}
            icon={<MoreHorizontal size={18} aria-hidden="true" />}
            items={rest.map((a) => ({ id: a.id, label: a.label, danger: a.danger, onAction: () => void run(a) }))}
          />
        ) : null}
        <Button variant="ghost" icon={<X size={18} aria-hidden />} aria-label="Clear selection" onClick={onClear} />
      </div>
    </div>
  );
}
