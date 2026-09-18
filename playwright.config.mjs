import {defineConfig} from '@playwright/test';
export default defineConfig({testDir: './tests/browser', timeout: 30000, fullyParallel: true, workers: 2, use: {baseURL:'http://127.0.0.1:4173', browserName:'chromium', screenshot:'only-on-failure'}, reporter:[['list']], webServer:{command:'python3 scripts/preview.py',url:'http://127.0.0.1:4173/en',reuseExistingServer:true}});
