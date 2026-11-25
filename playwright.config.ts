import { defineConfig } from "@playwright/test";

const PORT = 6107;

export default defineConfig({
  testDir: "tests",
  snapshotPathTemplate: "{testDir}/pictures/{arg}-{projectName}{ext}",
  fullyParallel: true,
  workers: 4,
  reporter: [["list"]],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.002, animations: "disabled", caret: "hide" } },
  use: { baseURL: `http://127.0.0.1:${PORT}`, trace: "off" },
  projects: [
    { name: "390", use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 } },
    { name: "1440", use: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
  ],
  webServer: {
    command: `vite preview --outDir storybook-static --port ${PORT} --strictPort --host 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}/index.json`,
    reuseExistingServer: false,
  },
});
