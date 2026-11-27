import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

// Every story renders in a real browser and runs addon-a11y's checks; a story that throws or breaks an a11y rule fails.
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: ".storybook" })],
        test: {
          name: "storybook",
          browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: "chromium" }] },
        },
      },
    ],
  },
});
