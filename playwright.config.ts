import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:5173",
    headless: true,
  },
  webServer: [
    {
      command: "npm run dev:server",
      url: "http://localhost:3001/health",
      reuseExistingServer: true,
      timeout: 20000,
    },
    {
      command: "npm run dev:client",
      url: "http://localhost:5173",
      reuseExistingServer: true,
      timeout: 20000,
    },
  ],
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
