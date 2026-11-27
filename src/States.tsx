import type { ReactElement } from "react";

// Loading and empty, the two states every list and page needs (gap 5; Primer loading and blankslate, Polaris skeleton
// page and empty state). A skeleton appears only after 300 ms, by CSS, so a fast load never flashes; reduced motion
// keeps it still. An empty state is one line and at most one action, never a paragraph or a picture (global UI rule).

/** Placeholder rows the height of real rows, for a list whose shape is known. */
export function SkeletonRows({ count = 3, label }: { count?: number; label: string }) {
  return (
    <div className="ui-skel" role="status" aria-busy="true" aria-label={`Loading ${label}`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="ui-skel-row" aria-hidden="true">
          <span className="ui-skel-bar ui-skel-title" />
          <span className="ui-skel-bar ui-skel-sub" />
        </div>
      ))}
    </div>
  );
}

/** What goes here, in one line, and the one action that adds it. */
export function EmptyState({ text, action }: { text: string; action?: ReactElement | null }) {
  return (
    <div className="ui-empty">
      <p className="ui-empty-text">{text}</p>
      {action ?? null}
    </div>
  );
}
