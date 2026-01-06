import { test, expect } from '@playwright/test'
import { selectDifficultyAndStartGame } from './helpers'

test.describe('ゲームページ（かんたん）', () => {
  test.beforeEach(async ({ page }) => {
    await selectDifficultyAndStartGame(page, 'easy')
  })

  test('ゲーム画面が正常にレンダリングされる', async ({ page }) => {
    // ゲームページにいることを確認
    await expect(page).toHaveURL('/game')

    // 戻るボタンが表示される
    const backButton = page.locator('button').first()
    await expect(backButton).toBeVisible()

    // 難易度表示が「かんたん」であることを確認
    const difficultyLabel = page.getByText('かんたん')
    await expect(difficultyLabel).toBeVisible()
  })

  test('ステージ進捗が表示される', async ({ page }) => {
    // ステージ進捗表示を確認（例: "1/5"）
    const stageProgress = page.getByText(/\/5/)
    await expect(stageProgress).toBeVisible()
  })

  test('ターゲット枠が表示される', async ({ page }) => {
    // ターゲット枠（白いボーダー）が存在することを確認
    const targets = page.locator('[data-target]')
    await expect(targets.first()).toBeVisible()
  })

  test('ドラッグ可能な図形が表示される', async ({ page }) => {
    // ドラッグ可能な図形が存在することを確認
    // 「かんたん」モードでは3つの図形が表示される
    const shapes = page.locator('[data-shape]')
    const count = await shapes.count()
    expect(count).toBeGreaterThan(0)
  })

  test('戻るボタンをクリックするとトップページに戻る', async ({ page }) => {
    // 戻るボタンをクリック
    const backButton = page.locator('button').first()
    await backButton.click()

    // トップページに戻ることを確認
    await expect(page).toHaveURL('/')
  })
})

test.describe('ゲームページ（ドラッグ&ドロップ機能）', () => {
  test.beforeEach(async ({ page }) => {
    await selectDifficultyAndStartGame(page, 'easy')
  })

  test('図形をドラッグできる', async ({ page }) => {
    // ドラッグ可能な図形を取得
    const shape = page.locator('[data-shape]').first()
    await expect(shape).toBeVisible()

    // 初期位置を取得
    const initialBox = await shape.boundingBox()
    expect(initialBox).not.toBeNull()

    // 図形をドラッグ
    await shape.hover()
    await page.mouse.down()
    await page.mouse.move(
      initialBox!.x + initialBox!.width / 2 + 50,
      initialBox!.y + initialBox!.height / 2 + 50
    )
    await page.mouse.up()

    // 少し待機してアニメーションを完了
    await page.waitForTimeout(500)

    // 位置が変わったことを確認
    const finalBox = await shape.boundingBox()
    expect(finalBox).not.toBeNull()

    const hasMoved =
      Math.abs(finalBox!.x - initialBox!.x) > 10 ||
      Math.abs(finalBox!.y - initialBox!.y) > 10

    expect(hasMoved).toBe(true)
  })

  test('図形をターゲット近くにドロップするとスナップする', async ({ page }) => {
    // ターゲットを取得
    const target = page.locator('[data-target]').first()
    await expect(target).toBeVisible()

    const targetBox = await target.boundingBox()
    expect(targetBox).not.toBeNull()

    const targetCenterX = targetBox!.x + targetBox!.width / 2
    const targetCenterY = targetBox!.y + targetBox!.height / 2

    // ドラッグ可能な図形を取得
    const shape = page.locator('[data-shape]').first()
    await expect(shape).toBeVisible()

    // 図形をターゲット近くにドラッグ
    await shape.hover()
    await page.mouse.down()
    await page.mouse.move(targetCenterX + 20, targetCenterY + 20)
    await page.mouse.up()

    // スナップアニメーションの完了を待つ
    await page.waitForTimeout(1500)

    // スナップ後の図形の位置を取得
    const finalBox = await shape.boundingBox()
    expect(finalBox).not.toBeNull()

    const finalCenterX = finalBox!.x + finalBox!.width / 2
    const finalCenterY = finalBox!.y + finalBox!.height / 2

    // ターゲット中心と図形の中心が近いことを確認（許容誤差30px）
    const distance = Math.sqrt(
      Math.pow(finalCenterX - targetCenterX, 2) +
      Math.pow(finalCenterY - targetCenterY, 2)
    )

    expect(distance).toBeLessThan(30)
  })
})

test.describe('ゲームページ（難易度別）', () => {
  test('ふつうモードで開始できる', async ({ page }) => {
    await selectDifficultyAndStartGame(page, 'normal')

    // 難易度表示が「ふつう」であることを確認
    const difficultyLabel = page.getByText('ふつう')
    await expect(difficultyLabel).toBeVisible()
  })

  test('むずかしいモードで開始できる', async ({ page }) => {
    await selectDifficultyAndStartGame(page, 'hard')

    // 難易度表示が「むずかしい」であることを確認
    const difficultyLabel = page.getByText('むずかしい')
    await expect(difficultyLabel).toBeVisible()
  })
})
