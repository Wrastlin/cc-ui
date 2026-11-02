"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { GridList, GridListItem, Input, Label, SearchField } from "react-aria-components";

// The four page templates, one per screen type in DESIGN-STANDARD.md "Screen types and measured rules": list, record,
// visual workspace, guided steps. A screen in cc-app's (core) group is one of these filled with its own data; it never
// lays out a page itself. Every size here is a --cc-* token or a shell size the standard declares (176/280 record
// columns, 216 step list, 320 inspector, 640 step form).

export type Back = { label: string; href: string };

function BackLink({ back }: { back: Back }) {
  return (
    <Link className="cc-tpl-back" href={back.href}>
      <ChevronLeft size={20} aria-hidden />
      <span>{back.label}</span>
    </Link>
  );
}

/** The one primary action of a view: full width and pinned above the phone tabs on a phone, inline on a desk. */
export function PrimaryBar({ children }: { children: ReactNode }) {
  return <div className="cc-tpl-primary">{children}</div>;
}

/** A count beside a label. Zero stays zero. */
export function Count({ n, label }: { n: number; label: string }) {
  return (
    <span className="cc-tpl-count" aria-label={`${n} ${label}`}>
      {n}
    </span>
  );
}

/** A short state line for loading, empty, no results, unavailable or error, with its fix when one exists. */
export function StateLine({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="cc-tpl-state" role="status">
      <span>{children}</span>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------- list

export type NavItem = { id: string; name: string; href: string; fact?: ReactNode };

/** Rows that each open one record: identity, one deciding fact, a chevron; the whole row is the link. */
export function NavRows({ label, items }: { label: string; items: readonly NavItem[] }) {
  return (
    <GridList aria-label={label} className="cc-tpl-rows" layout="stack" items={items}>
      {(item) => (
        <GridListItem id={item.id} textValue={item.name} href={item.href} className="cc-tpl-row">
          <span className="cc-tpl-row-text">
            <span className="cc-tpl-row-name">{item.name}</span>
            {item.fact != null && <span className="cc-tpl-row-fact">{item.fact}</span>}
          </span>
          <ChevronRight className="cc-tpl-chev" size={20} aria-hidden />
        </GridListItem>
      )}
    </GridList>
  );
}

/** A named group of rows with its count. */
export function ListGroup({ label, count, children }: { label: string; count: number; children: ReactNode }) {
  return (
    <section className="cc-tpl-group" aria-label={label}>
      <h2 className="cc-tpl-group-head">
        <span>{label}</span>
        <Count n={count} label={label.toLowerCase()} />
      </h2>
      {children}
    </section>
  );
}

/**
 * List / queue: choose a record. Title, a labeled search on its own row, at most two controls in one row, then named
 * groups. No primary unless the list starts something.
 */
export function ListPage({
  title,
  search,
  controls,
  primary,
  children,
}: {
  title: string;
  search?: { label: string; value: string; onChange: (v: string) => void };
  controls?: ReactNode;
  primary?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="cc-tpl cc-tpl-list" data-screen-type="list">
      <h1 className="cc-tpl-title">{title}</h1>
      {(search || controls) && (
        <div className="cc-tpl-toolbar">
          {search && (
            <SearchField className="cc-tpl-search" value={search.value} onChange={search.onChange}>
              <Label className="cc-tpl-label">{search.label}</Label>
              <Input className="cc-tpl-input" />
            </SearchField>
          )}
          {controls && <div className="cc-tpl-controls">{controls}</div>}
        </div>
      )}
      <div className="cc-tpl-body">{children}</div>
      {primary && <PrimaryBar>{primary}</PrimaryBar>}
    </main>
  );
}

// ---------------------------------------------------------------- record

export type Fact = { label: string; value: ReactNode };

/** Label and value pairs. A missing value is the caller's Not set, Unavailable or None, never a blank. */
export function Facts({ items }: { items: readonly Fact[] }) {
  return (
    <dl className="cc-tpl-facts">
      {items.map((f) => (
        <div key={f.label} className="cc-tpl-fact">
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A named section of a page. */
export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="cc-tpl-section" aria-label={title}>
      <div className="cc-tpl-section-head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export type RecordKind = { id: string; label: string; href: string; count?: number };

/**
 * Record: understand one thing and open its work. Identity and actions over three columns on a wide desk: record kinds
 * 176px, the selected section, facts 280px. Narrower, the facts come first and the kinds are rows that open each one.
 */
export function RecordPage({
  back,
  title,
  status,
  actions,
  kinds,
  current,
  facts,
  children,
}: {
  back: Back;
  title: string;
  status?: ReactNode;
  actions?: ReactNode;
  kinds: readonly RecordKind[];
  current: string;
  facts?: readonly Fact[];
  children: ReactNode;
}) {
  return (
    <main className="cc-tpl cc-tpl-record" data-screen-type="record">
      <BackLink back={back} />
      <header className="cc-tpl-identity">
        <div>
          <h1 className="cc-tpl-title">{title}</h1>
          {status}
        </div>
        {actions && <div className="cc-tpl-actions">{actions}</div>}
      </header>
      <div className="cc-tpl-record-cols">
        <nav className="cc-tpl-kinds" aria-label="Sections">
          {kinds.map((k) => (
            <Link key={k.id} href={k.href} aria-current={k.id === current ? "page" : undefined}>
              <span>{k.label}</span>
              {k.count != null && <Count n={k.count} label={k.label.toLowerCase()} />}
              <ChevronRight className="cc-tpl-chev" size={20} aria-hidden />
            </Link>
          ))}
        </nav>
        <div className="cc-tpl-record-main">{children}</div>
        {facts && facts.length > 0 && (
          <aside className="cc-tpl-facts-rail" aria-label="Facts">
            <Facts items={facts} />
          </aside>
        )}
      </div>
    </main>
  );
}

// ---------------------------------------------------------------- visual workspace

/**
 * Visual workspace: work on the drawing. One tool row, the canvas takes the rest, a readout of the selected object,
 * an optional 320px inspector on a desk (a sheet's job on a phone), one commit action only if changes commit.
 */
export function WorkspacePage({
  back,
  title,
  tools,
  canvas,
  readout,
  inspector,
  primary,
}: {
  back: Back;
  title: string;
  tools: ReactNode;
  canvas: ReactNode;
  readout?: ReactNode;
  inspector?: ReactNode;
  primary?: ReactNode;
}) {
  return (
    <main className="cc-tpl cc-tpl-workspace" data-screen-type="workspace">
      <header className="cc-tpl-ws-head">
        <BackLink back={back} />
        <h1 className="cc-tpl-title">{title}</h1>
      </header>
      <div className="cc-tpl-tools" role="toolbar" aria-label="Tools">
        {tools}
      </div>
      <div className={`cc-tpl-ws-body${inspector ? " cc-tpl-ws-has-inspector" : ""}`}>
        <div className="cc-tpl-canvas">{canvas}</div>
        {inspector && (
          <aside className="cc-tpl-inspector" aria-label="Inspector">
            {inspector}
          </aside>
        )}
      </div>
      {readout && (
        <div className="cc-tpl-readout" aria-live="polite">
          {readout}
        </div>
      )}
      {primary && <PrimaryBar>{primary}</PrimaryBar>}
    </main>
  );
}

// ---------------------------------------------------------------- guided steps

export type Step = { id: string; label: string; href: string; done?: boolean };

/**
 * Guided steps: complete one decision group. A desk shows the 216px step list beside the form (up to 640px); a phone
 * shows "Step 2 of 7" and progress, with the other steps under Choose step. The next action is pinned and names where
 * it goes.
 */
export function StepsPage({
  back,
  title,
  steps,
  current,
  next,
  previous,
  children,
}: {
  back: Back;
  title: string;
  steps: readonly Step[];
  current: string;
  next: ReactNode;
  previous?: ReactNode;
  children: ReactNode;
}) {
  const at = Math.max(0, steps.findIndex((s) => s.id === current));
  const step = steps[at];
  const list = (
    <ol className="cc-tpl-steplist">
      {steps.map((s, i) => (
        <li key={s.id}>
          <Link href={s.href} aria-current={i === at ? "step" : undefined}>
            <span className="cc-tpl-stepmark" aria-hidden>
              {s.done ? <Check size={16} /> : i + 1}
            </span>
            <span>{s.label}</span>
            {s.done && <span className="cc-tpl-sr">, done</span>}
          </Link>
        </li>
      ))}
    </ol>
  );
  return (
    <main className="cc-tpl cc-tpl-steps" data-screen-type="steps">
      <BackLink back={back} />
      <h1 className="cc-tpl-title">{title}</h1>
      <div className="cc-tpl-steps-cols">
        <nav className="cc-tpl-steps-desk" aria-label="Steps">
          {list}
        </nav>
        <div className="cc-tpl-step-main">
          {step && (
            <div className="cc-tpl-step-head">
              <p className="cc-tpl-step-of">
                Step {at + 1} of {steps.length}
              </p>
              <progress className="cc-tpl-progress" max={steps.length} value={at + 1}>
                Step {at + 1} of {steps.length}
              </progress>
              <h2 className="cc-tpl-step-name">{step.label}</h2>
              <details className="cc-tpl-steps-phone">
                <summary>Choose step</summary>
                {list}
              </details>
            </div>
          )}
          <div className="cc-tpl-step-form">{children}</div>
          <PrimaryBar>
            {previous}
            {next}
          </PrimaryBar>
        </div>
      </div>
    </main>
  );
}
