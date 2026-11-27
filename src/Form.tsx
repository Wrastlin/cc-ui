"use client";

import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Button from "./Button";

// One form, one Save (gap 4; Primer saving, GOV.UK validation; Design-Lead/PATTERNS.md P18, revised 11/27).
// Save is never disabled: a person who taps it learns why instead of facing a dead button. On submit with errors the
// ErrorSummary at the top takes focus and links each line to its field; each Field named in the errors says the same
// line under itself. Save sits at the end of the form in the flow, never pinned. A Section cannot hold its own Save.

/** Field name to what went wrong and how to fix it ("Enter the count as a number"). */
export type FormErrors = Record<string, string>;

const ErrorsContext = createContext<FormErrors>({});

/** The error for a field by its control's `name`, inside a Form. Field reads this when given `name`. */
export function useFieldError(name?: string) {
  const errors = useContext(ErrorsContext);
  return name ? errors[name] : undefined;
}

function focusField(form: HTMLFormElement | null, name: string) {
  const el = form?.elements.namedItem(name);
  const target = el instanceof RadioNodeList ? (el[0] as HTMLElement | undefined) : (el as HTMLElement | null);
  target?.focus();
}

/** The form-level list of what is wrong, each line a link to its field. Takes focus when it appears. */
export function ErrorSummary({ errors, onPick }: { errors: FormErrors; onPick?: (name: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const entries = Object.entries(errors);
  const key = entries.map(([k]) => k).join("|");
  useEffect(() => {
    if (key) ref.current?.focus();
  }, [key]);
  if (!entries.length) return null;
  return (
    <div ref={ref} className="ui-errsum" role="alert" tabIndex={-1} aria-labelledby="ui-errsum-title">
      <p id="ui-errsum-title" className="ui-errsum-title">
        There is a problem
      </p>
      <ul className="ui-errsum-list">
        {entries.map(([name, msg]) => (
          <li key={name}>
            <a
              href={`#${name}`}
              onClick={(e) => {
                e.preventDefault();
                onPick?.(name);
              }}
            >
              {msg}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Form({
  onSave,
  validate,
  saveLabel = "Save",
  children,
  className,
}: {
  /** Runs when nothing is wrong. Return errors (from the server) to show them the same way. */
  onSave: (data: FormData) => void | FormErrors | Promise<void | FormErrors>;
  /** Checks before saving; return what is wrong by field name. */
  validate?: (data: FormData) => FormErrors;
  saveLabel?: string;
  children: ReactNode;
  className?: string;
}) {
  const form = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    const data = new FormData(e.currentTarget);
    const found = validate?.(data) ?? {};
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setSaving(true);
    try {
      const back = await onSave(data);
      setErrors(back && Object.keys(back).length ? back : {});
    } finally {
      setSaving(false);
    }
  }
  return (
    <ErrorsContext.Provider value={errors}>
      <form ref={form} noValidate onSubmit={submit} className={["ui-form", className].filter(Boolean).join(" ")}>
        <ErrorSummary errors={errors} onPick={(name) => focusField(form.current, name)} />
        {children}
        <div className="ui-form-save">
          <Button type="submit" variant="primary" busy={saving}>
            {saveLabel}
          </Button>
        </div>
      </form>
    </ErrorsContext.Provider>
  );
}
