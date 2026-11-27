"use client";

import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "./Button";
import DescriptionList, { type Fact } from "./DescriptionList";
import Icon from "./Icon";

// The last two steps of a StepsPage flow (gap 12; GOV.UK check answers and confirmation, tested with the public).
// Check answers: every answer as a label-left, value-right row with a Change link back to its step, then the one
// decision. Confirmation: what was done, then what happens next, in a few plain lines. Our walk, receiving and estimate
// entry on the phone are this shape.

export type Answer = {
  label: string;
  value: ReactNode;
  /** The step that asks it. */
  change: string;
  long?: boolean;
  numeric?: boolean;
};

export function CheckAnswers({ sections }: { sections: readonly { title?: string; answers: readonly Answer[] }[] }) {
  return (
    <div className="ui-check">
      {sections.map((s, i) => (
        <section key={s.title ?? i} className="ui-check-sec" aria-label={s.title}>
          {s.title ? <h2 className="ui-check-title">{s.title}</h2> : null}
          <DescriptionList
            empty="Not answered"
            facts={s.answers.map(
              (a): Fact => ({
                label: a.label,
                value: a.value,
                long: a.long,
                numeric: a.numeric,
                action: (
                  <Button variant="text" size="sm" href={a.change} aria-label={`Change ${a.label.toLowerCase()}`}>
                    Change
                  </Button>
                ),
              }),
            )}
          />
        </section>
      ))}
    </div>
  );
}

export function Confirmation({ title, next, action }: { title: string; next: readonly string[]; action?: ReactNode }) {
  return (
    <div className="ui-confirm" role="status">
      <Icon icon={CheckCircle2} size="display" className="ui-confirm-mark" />
      <h2 className="ui-confirm-title">{title}</h2>
      {next.length ? (
        <>
          <h3 className="ui-check-title">What happens next</h3>
          <ul className="ui-confirm-next">
            {next.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </>
      ) : null}
      {action}
    </div>
  );
}
