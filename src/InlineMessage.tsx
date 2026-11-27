import type { ReactElement, ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";

// Next to what it is about, never a page banner (Atlassian section message, Carbon inline notification, Primer).
// Never color alone: each tone has its icon and a word a screen reader hears first. A warning or error names the way
// out, in its words or in its one action (Atlassian "avoid dead ends"). The text wraps; it is never cut.

export type MessageTone = "info" | "good" | "warn" | "danger";

const TONE = {
  info: { Icon: Info, word: "Note:" },
  good: { Icon: CircleCheck, word: "Done:" },
  warn: { Icon: TriangleAlert, word: "Warning:" },
  danger: { Icon: CircleAlert, word: "Error:" },
} as const;

export default function InlineMessage({
  tone = "info",
  title,
  children,
  action,
  className,
}: {
  tone?: MessageTone;
  /** A short first line in bold; the rest goes in children. */
  title?: ReactNode;
  children?: ReactNode;
  /** One way out (Retry, Open the PO). More than one belongs on the page, not in the message. */
  action?: ReactElement | null;
  className?: string;
}) {
  const { Icon, word } = TONE[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={["ui-msg", `ui-msg-${tone}`, className].filter(Boolean).join(" ")}
    >
      <Icon className="ui-msg-icon" size={18} aria-hidden="true" />
      <div className="ui-msg-main">
        <span className="ui-vh">{word} </span>
        {title ? <p className="ui-msg-title">{title}</p> : null}
        {children ? <div className="ui-msg-text">{children}</div> : null}
      </div>
      {action ? <div className="ui-msg-act">{action}</div> : null}
    </div>
  );
}
