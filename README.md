# cc-ui

The shared C&C Services app shell, primitives and design tokens.

One implementation, every product. Before this existed there were **twelve
separate top-bar implementations across nine apps and no shared code**, which
is what this package is for.

Binding companions: `DESIGN-STANDARD.md` (what a screen looks like) and
`APP-STRUCTURE.md` (where an app lives), both in the workspace root.

---

## Install

```bash
npm install github:Wrastlin/cc-ui
```

Then two lines, once per app.

`next.config.ts` — the package ships as TypeScript source, so Next has to
transpile it:

```ts
const nextConfig: NextConfig = {
  transpilePackages: ["cc-ui"],
};
```

`app/layout.tsx` — one stylesheet, imported before your own so your app can
still override its own variables:

```tsx
import "cc-ui/styles.css";
import "./globals.css";
```

Your `globals.css` then aliases its local names to the tokens. It never
restates a value:

```css
:root {
  --accent: var(--cc-accent);
  --line: var(--cc-line);
}
```

---

## The two rules

**Back moves you inside an app. The logo leaves it.** Neither ever does the
other's job.

- Back goes up exactly one screen and **names where it lands**, so an agreement
  returns to the job and the job returns to the list. It never crosses into
  another product.
- At the top of an app there is nothing above the list, so you omit `back` and
  the logo takes the left edge. There is no reserved empty gap; an indent with
  nothing in it reads as a bug.
- Back is pinned to the left edge and the logo shifts, never the reverse. Back
  is what gets clicked twenty times an hour, so it is what holds still.

This matters more than it looks. **An installed PWA has no browser chrome and
no edge-swipe gesture**, so in Canvass and Notetaker the control this package
draws is the only way back that exists.

---

## Usage

```tsx
import { AppBar, TabRow, RecordRow, Chip } from "cc-ui";
import { Plus, Send } from "lucide-react";

// Top of the app: no back.
<AppBar
  product={{ name: "Subcontracts", href: "/" }}
  action={{ label: "Create subcontract", icon: <Plus size={16} />, href: "/new" }}
  account={{ initials: "AR", name: "Aaron Rothwell", onOpen: openMenu }}
/>
<TabRow tabs={[
  { label: "Pending", href: "/", count: 7, current: true },
  { label: "Completed", href: "/completed", count: 0 },
  { label: "Setup", href: "/setup" },
]} />

// One level down: back names the list.
<AppBar
  back={{ label: "Pending", href: "/" }}
  product={{ name: "Subcontracts", href: "/" }}
  action={{ label: "Send for signature", icon: <Send size={16} />, onClick: send, variant: "ghost" }}
  account={account}
/>
<RecordRow
  title="26268-1 · Michael Wallace"
  sub="416 Shoreland Ln · Roofing"
  status={<Chip tone="neutral">Draft</Chip>}
/>
```

**Signed out** — a sub signing an agreement, or a homeowner uploading
paperwork, has no account, nowhere to go back to and no idea what a dashboard
is. The bar stops being navigation and becomes identification, and it is the
one place the full lockup belongs:

```tsx
import { IdentityBar } from "cc-ui";
<IdentityBar />
```

### Why `action` is data, not a node

The bar is the only thing that knows its own width budget. On a phone,
controls sit on the 44px touch floor and "Send for signature" cannot coexist
with the logo, the product name and the avatar in 390px. Below 560px the shell
drops the label and keeps the icon; below 430px it drops the product name too.
That decision is made once here rather than guessed nine times.

This is why `icon` is required: on a phone it is the whole control, and
`label` survives as the accessible name.

---

## What is in the box

| Export | What it is |
|---|---|
| `AppBar`, `IdentityBar` | The bar. Signed in and signed out. |
| `TabRow`, `RecordRow`, `Chip` | Row two: tabs on a list, the record's name and status on a detail screen. Same height, so nothing jumps. |
| `CCLogo` | The mark, the full lockup, and a single-colour lockup for dark grounds. |
| `Button`, `Field`, `TextInput`, `Select`, `Row`, `RowGroup`, `Sheet` | The `ui-*` primitives, proved in CRMP at `/ui`. |
| `DialogHost`, `alertDialog`, `confirmDialog`, `promptDialog` | One in-app replacement for `window.confirm`. Mount `<DialogHost />` once at the root. |
| `cc-ui/tokens.css` | Tokens alone, if an app wants them without the components. |

### The logo

Inline SVG, never a file in `public/`. Apps run under a `basePath`, and
`<img src="/cc-logo.svg">` resolves against the **origin**, not the app, so on
`ccservicesapp.com` it silently fetches the shell's copy instead of yours.

Every viewBox carries 8 units of clear space around the measured ink. The
artwork's true bounds touch its edges exactly, so without that padding a
rounded container or plain antialiasing shaves the left edge of the first C.

The mark is the **one carve-out from design rule 3** (navy plus status colours
only): it keeps its real second blue, `#3697d3`. Nothing else in app UI may use
that colour.

---

## Rules this package enforces so call sites do not have to

1. **The shell is imported, never written.** A `<header>` in app code that is
   not `AppBar` is a defect.
2. **Control order is fixed**: back, logo, product, spacer, action, account. An
   app may omit a slot. It may not reorder or insert.
3. **No app stylesheet may target `.cc-*` or `.ui-*`.** That is the whole
   reason for the namespaces. In CRMP, plain `.btn` was re-specified by about
   24 surface rules, which is why one class measured 34, 38, 40, 44 and 48px on
   a single screen.
4. **No hardcoded token values in app CSS.** Grep for `#1f4a9b`: any hit is a
   defect.
5. **Every text slot is `min-width: 0`**, so labels truncate instead of pushing
   out of their box. A flex item's default `min-width` is `auto`, which is the
   whole reason text escapes buttons.
6. **Heights come from `--cc-ctl-h` / `--cc-ctl-h-sm`**, never a literal. The
   44px touch floor is a floor, not a suggestion.

---

## Versioning

Apps pin a commit and upgrade when they choose, so Subcontracts can move on a
Tuesday while CRMP waits until Friday. Tokens were `cc-tokens.css` v1.0.0,
copied into each repo; that is how the suite drifted, and this package is
v2.0.0 of the same idea with one copy instead of nine.
