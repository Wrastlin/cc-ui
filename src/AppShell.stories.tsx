import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bell, CircleHelp, Plus } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";
import { AccountButton } from "./AccountButton";
import { AppShell } from "./AppShell";

const apps = ["dashboard", "production", "checks", "estimating", "subcontracts"];

function Icon({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button type="button" className="cc-bar-icon" aria-label={label} title={label}>
      {children}
    </button>
  );
}

function Page({ rows = 40 }: { rows?: number }) {
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: "0 0 12px", fontSize: "var(--cc-fs-page)" }}>Crews</h1>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} style={{ padding: "14px 0", borderTop: "1px solid var(--cc-line)" }}>
          Crew {i + 1}
        </div>
      ))}
    </div>
  );
}

const shellOwn = {
  helper: (
    <Icon label="Helper">
      <CircleHelp size={22} aria-hidden />
    </Icon>
  ),
  bell: (
    <Icon label="Waiting work">
      <Bell size={22} aria-hidden />
    </Icon>
  ),
};

const meta = {
  title: "Shell/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen" },
  args: {
    product: { name: "Production", href: "/production" },
    hubHref: "/",
    apps,
    path: "/production/crews",
    children: <Page />,
  },
} satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;

/** A top-level page: the menu button leads, the logo goes home, the page's create, then the Helper and the bell. */
export const TopLevel: Story = {
  args: {
    ...shellOwn,
    create: { label: "New crew", icon: <Plus size={18} aria-hidden />, onClick: fn() },
    more: [{ id: "print", label: "Print the list" }],
    account: <AccountButton email="pat.lee@example.com" />,
  },
};

/** A child page: Back names where it lands, in place of the menu button. Three icons at most beside it on a phone. */
export const WithBack: Story = {
  args: { ...shellOwn, back: { label: "Crews", href: "/production/crews" }, more: [{ id: "edit", label: "Rename" }] },
};

/** The menu opens as one Sheet at every width, never a left sidebar. */
export const MenuOpens: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(c.getByRole("button", { name: "Menu" }));
    await expect(await body.findByRole("dialog", { name: "Menu" })).toBeInTheDocument();
  },
};

/** The bar stays at the top after a long scroll, and the pinned area stays under 110 px at 390. */
export const PinnedUnder110: Story = {
  args: { ...shellOwn, create: { label: "New crew", icon: <Plus size={18} aria-hidden />, onClick: fn() } },
  play: async ({ canvasElement }) => {
    const bar = canvasElement.querySelector("header.cc-bar") as HTMLElement;
    const win = canvasElement.ownerDocument.defaultView!;
    win.scrollTo(0, 1500);
    await new Promise((r) => setTimeout(r, 50));
    const box = bar.getBoundingClientRect();
    await expect(box.top).toBe(0);
    await expect(box.height).toBeLessThan(110);
    win.scrollTo(0, 0);
  },
};
