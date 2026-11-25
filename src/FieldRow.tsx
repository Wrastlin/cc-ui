"use client";

import type { ReactNode } from "react";

// Fields side by side on a desk, one under the other on a phone, with at most one button at the end lined up with the
// inputs (a note and its Save). Padding matches a Row so a FieldRow sits above or between RowGroups without a gap.
export default function FieldRow({ children, action, className }: { children: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={["ui-fieldrow", className ?? ""].filter(Boolean).join(" ")}>
      {children}
      {action ? <span className="ui-fieldrow-act">{action}</span> : null}
    </div>
  );
}
