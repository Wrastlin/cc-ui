// One in-app replacement for window.confirm / alert / prompt.
//
// Why the native ones had to go, beyond looking like a browser and not like
// the product: they block the whole page synchronously, they cannot be styled
// or read in sunlight, they say "localhost:3000 says" above your copy, and on
// iOS a native modal over a live camera can pause the video track — which is
// how the prompt guarding an unsaved capture ended up producing the frozen
// frame behind "Camera stopped. Tap to resume."
//
// The API is deliberately shaped like the thing it replaces, so a call site
// changes by adding `await` and little else:
//
//   if (!(await confirmDialog({ title: "Delete this pin?" }))) return;
//   const name = await promptDialog({ title: "New feature type" });
//   await alertDialog({ title: "That file is too large." });
//
// It is a module-level store rather than a React context so any component can
// call it without a provider in its tree. <DialogHost /> renders it once, at
// the root.

export type DialogKind = "alert" | "confirm" | "prompt";

export type DialogRequest = {
  id: number;
  kind: DialogKind;
  title: string;
  /** Optional second line. Say what happens, not "are you sure".  */
  body?: string;
  /** Label for the action that proceeds. Default: OK / Continue. */
  confirmLabel?: string;
  cancelLabel?: string;
  /** Destructive actions get the danger treatment and never autofocus. */
  danger?: boolean;
  /** prompt only */
  defaultValue?: string;
  placeholder?: string;
};

type Pending = DialogRequest & {
  resolve: (value: boolean | string | null) => void;
};

let seq = 0;
let current: Pending | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

export function subscribeDialogs(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function currentDialog(): DialogRequest | null {
  return current;
}

// Answer the open dialog. `value` is the string for a prompt, true/false for a
// confirm, and ignored for an alert.
export function resolveDialog(value: boolean | string | null) {
  const pending = current;
  current = null;
  emit();
  pending?.resolve(value);
}

function open(req: Omit<DialogRequest, "id">): Promise<boolean | string | null> {
  return new Promise((resolve) => {
    // A second dialog while one is open would strand the first one's promise
    // forever. Answer it as a cancel and let the new one through.
    if (current) resolveDialog(current.kind === "prompt" ? null : false);
    current = { ...req, id: ++seq, resolve };
    emit();
  });
}

export async function alertDialog(
  req: Omit<DialogRequest, "id" | "kind">,
): Promise<void> {
  await open({ ...req, kind: "alert" });
}

export async function confirmDialog(
  req: Omit<DialogRequest, "id" | "kind">,
): Promise<boolean> {
  return (await open({ ...req, kind: "confirm" })) === true;
}

export async function promptDialog(
  req: Omit<DialogRequest, "id" | "kind">,
): Promise<string | null> {
  const v = await open({ ...req, kind: "prompt" });
  return typeof v === "string" ? v : null;
}
