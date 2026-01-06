import { test, expect } from '@playwright/test'

test.describe('基本的なレンダリング', () => {
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

  test('D&D図形が表示される', async ({ page }) => {
    await page.goto('/')

    // カーソルが"grab"の要素（ドラッグ可能な図形）が存在することを確認
    const draggable = page.locator('[class*="cursor-grab"]')
    await expect(draggable).toBeVisible()
  })

  test('ターゲット枠が表示される', async ({ page }) => {
    await page.goto('/')

    // 白いボーダーの要素（ターゲット枠）が存在することを確認
    const target = page.locator('.border-white')
    await expect(target).toBeVisible()
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

  test('目が2つ表示される', async ({ page }) => {
    await page.goto('/')

    // 目（丸い白い要素）が2つ存在することを確認
    const eyes = page.locator('.rounded-full.bg-white.border-2')
    await expect(eyes).toHaveCount(2)
  })
})
