import { money } from "./format";

// Figures in tabular digits so a column lines up; a missing value is a muted word, never "$0.00" or a blank.

export function MoneyText({ value, inline, missing = "Not set" }: { value: number | null | undefined; inline?: boolean; missing?: string }) {
  const s = money(value, { inline });
  return s == null ? <span className="ui-num ui-num-missing">{missing}</span> : <span className="ui-num">{s}</span>;
}

export function NumberText({ value, missing = "Not set" }: { value: number | null | undefined; missing?: string }) {
  const ok = typeof value === "number" && Number.isFinite(value);
  return ok ? <span className="ui-num">{value.toLocaleString("en-US")}</span> : <span className="ui-num ui-num-missing">{missing}</span>;
}
