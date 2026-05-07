import { defineConfig, devices } from '@playwright/test';

const PORT = Number(process.env['E2E_PORT'] ?? 4200);
const BASE_URL = process.env['E2E_BASE_URL'] ?? `http://localhost:${PORT}`;

const API_PORT = Number(process.env['E2E_API_PORT'] ?? 5268);
const API_URL = process.env['E2E_API_URL'] ?? `http://localhost:${API_PORT}`;

// Set E2E_REAL_BACKEND=1 to chain `dotnet run` for the Kitlo.Api alongside the
// Angular dev server. Otherwise the suite runs against the dev server's mock-friendly
// fall-throughs (404 pages, error states, etc.) without booting the API.
const useRealBackend = process.env['E2E_REAL_BACKEND'] === '1';

const apiServer = {
  command: 'dotnet run --project ../backend/Kitlo.Api --no-launch-profile',
  url: `${API_URL}/api/listings`,
  reuseExistingServer: !process.env['CI'],
  timeout: 180_000,
  env: {
    ASPNETCORE_URLS: API_URL,
    ASPNETCORE_ENVIRONMENT: 'Development',
  },
};

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: process.env['CI'] ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: useRealBackend
    ? [
        apiServer,
        {
          command: `npm start -- --port ${PORT}`,
          url: BASE_URL,
          reuseExistingServer: !process.env['CI'],
          timeout: 120_000,
        },
      ]
    : {
        command: `npm start -- --port ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: !process.env['CI'],
        timeout: 120_000,
      },
});
