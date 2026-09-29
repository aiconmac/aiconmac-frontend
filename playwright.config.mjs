import {defineConfig, devices} from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 45000,
  fullyParallel: true,
  workers: 2,
  use: {baseURL: 'http://127.0.0.1:4173', screenshot: 'only-on-failure'},
  reporter: [['list']],
  projects: [{name: 'chromium', use: {...devices['Desktop Chrome']}}, {name: 'webkit', use: {...devices['Desktop Safari']}}],
  webServer: {command: 'python3 scripts/preview.py', url: 'http://127.0.0.1:4173/en', reuseExistingServer: true},
});
