import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2, // ローカルでは2ワーカーに制限
  reporter: process.env.CI ? 'html' : 'line', // ローカルではlineレポーター
  
  timeout: 30000, // テストタイムアウトを30秒に設定
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure', // 失敗時のみスクリーンショット
    video: 'retain-on-failure', // 失敗時のみビデオ
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2分に短縮
    stdout: 'ignore', // 出力を無視（高速化）
    stderr: 'pipe', // エラーのみ取得
  },
})
