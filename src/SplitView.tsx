import type { ReactNode } from "react";

// A list and the one thing picked from it. At a desk (900 px and up) the list is a narrow column on the left and the
// picked thing fills the rest. On a phone only one shows at a time: the list until something is picked, then that
// thing alone, so its first line is near the top of the screen (U9). `back` is the way to the list and names the picked
// thing; it shows only on a phone, where the list is out of sight. `head` names the picked thing at a desk.
export default function SplitView({ list, detail, back, head, showing }: { list: ReactNode; detail?: ReactNode; back?: ReactNode; head?: ReactNode; showing: "list" | "detail" }) {
  return (
    <div className={`ui-split ui-split-on-${showing}`}>
      <div className="ui-split-list">{list}</div>
      {detail ? (
        <div className="ui-split-detail">
          {back ? <div className="ui-split-back">{back}</div> : null}
          {head ? <div className="ui-split-head">{head}</div> : null}
          {detail}
        </div>
      ) : null}
    </div>
  );
}
