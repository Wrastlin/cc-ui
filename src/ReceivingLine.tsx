"use client";

import { Camera } from "lucide-react";
import CountRow, { CountHead } from "./CountRow";

// The receiving line: one line of a Bricks PO as Zoho prints it (specs/receiving SPEC R17 to R19, UX.md X1 to X7).
// Its number on the paper, the item and its code, maker and color on one quiet line, then "12 of 44 EA" with "32 left"
// when short. The camera (R18) and the Received check sit in fixed columns at the right edge of every line. Tapping
// the line opens it for a count typed by hand; the list itself holds no input. Remaining is passed in, never worked
// out here, so web and iOS read the same number (R15).

export type ReceivingLineProps = {
  n: number;
  item: string;
  code?: string;
  maker?: string;
  color?: string;
  ordered: number;
  received: number;
  /** From the server's view (R15). */
  remaining: number;
  unit: string;
  /** Photos saved on the line. */
  photos?: number;
  /** Desk: Ordered, Received, Left as columns under ReceivingHead. */
  columns?: boolean;
  onOpen?: () => void;
  onReceive?: () => void;
  onPhoto?: () => void;
};

export default function ReceivingLine({
  n,
  item,
  code,
  maker,
  color,
  ordered,
  received,
  remaining,
  unit,
  photos = 0,
  columns,
  onOpen,
  onReceive,
  onPhoto,
}: ReceivingLineProps) {
  const done = remaining <= 0;
  const detail = [maker, color].filter(Boolean).join(", ");
  return (
    <CountRow
      n={n}
      title={item}
      code={code}
      detail={detail || undefined}
      note={!done && received > 0 ? `${remaining} left` : undefined}
      count={`${received} of ${ordered} ${unit}`}
      cells={columns ? [ordered, received, remaining] : undefined}
      done={done}
      onOpen={onOpen}
      tool={{
        "aria-label": photos ? `Photo, line ${n}, ${photos} saved` : `Photo, line ${n}`,
        icon: <Camera size={20} aria-hidden />,
        count: photos,
        onPress: onPhoto,
      }}
      mark={{ label: "Received", "aria-label": `Received, line ${n}`, done, disabled: done, onPress: onReceive }}
    />
  );
}

/** Desk only: the column names over a list of ReceivingLines with `columns`. */
export function ReceivingHead() {
  return <CountHead n="No." title="Item" cells={["Ordered", "Received", "Left"]} tool />;
}
