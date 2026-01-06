import { test, expect } from '@playwright/test'

test.describe('トップページ（難易度選択画面）', () => {
  test('ページが正常にレンダリングされ、コンソールエラーがない', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

  test('背景の幾何学パターンが表示される', async ({ page }) => {
    await page.goto('/')

    // SVG要素が存在することを確認
    const svg = page.locator('svg')
    await expect(svg).toBeVisible()

    // 円が6個存在することを確認
    const circles = page.locator('circle')
    await expect(circles).toHaveCount(6)

    // 三角形が8個存在することを確認
    const polygons = page.locator('polygon')
    await expect(polygons).toHaveCount(8)
  })

  test('タイトルと説明文が表示される', async ({ page }) => {
    await page.goto('/')

    // タイトルが表示されることを確認
    const title = page.getByRole('heading', { name: /パズル/ })
    await expect(title).toBeVisible()

    // 説明文が表示されることを確認
    const description = page.getByText('ずけいをはめてあそぼう！')
    await expect(description).toBeVisible()
  })

  test('難易度選択ボタンが3つ表示される', async ({ page }) => {
    await page.goto('/')

    // 「かんたん」ボタンが表示される
    const easyButton = page.getByRole('button', { name: /かんたん/ })
    await expect(easyButton).toBeVisible()

    // 「ふつう」ボタンが表示される
    const normalButton = page.getByRole('button', { name: /ふつう/ })
    await expect(normalButton).toBeVisible()

    // 「むずかしい」ボタンが表示される
    const hardButton = page.getByRole('button', { name: /むずかしい/ })
    await expect(hardButton).toBeVisible()
  })

  test('難易度を選択するとゲーム画面に遷移する', async ({ page }) => {
    await page.goto('/')

    // 「かんたん」ボタンをクリック
    const easyButton = page.getByRole('button', { name: /かんたん/ })
    await easyButton.click()

    // ゲームページに遷移することを確認
    await expect(page).toHaveURL('/game')

    // ゲーム画面の要素が表示されるまで待機
    await page.waitForLoadState('networkidle')
  })

  test('フッターテキストが表示される', async ({ page }) => {
    await page.goto('/')

    // フッターテキストが表示されることを確認
    const footer = page.getByText('4さいからあそべるよ')
    await expect(footer).toBeVisible()
  })
})
