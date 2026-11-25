import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

// Every story in the built catalog gets a pinned picture at 390 and 1440. A new story with no picture fails until its
// picture is approved with `npm run test:pictures -- --update-snapshots`.
type Entry = { id: string; type: string };
const index = JSON.parse(readFileSync("storybook-static/index.json", "utf8")) as { entries: Record<string, Entry> };
const stories = Object.values(index.entries).filter((e) => e.type === "story");

for (const { id } of stories) {
  test(id, async ({ page }) => {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    await page.waitForFunction(
      () =>
        [...(document.querySelector("#storybook-root")?.children ?? [])].some((c) => c.tagName !== "TEMPLATE") ||
        document.querySelector("[role=dialog], [role=alertdialog]") !== null,
      undefined,
      { timeout: 15_000 },
    );
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${id}.png`, { fullPage: true });
  });
}
