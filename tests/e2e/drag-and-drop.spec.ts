import { test, expect } from '@playwright/test'

test.describe('ドラッグ&ドロップ機能', () => {
  test('図形がドラッグ可能である', async ({ page }) => {
    await page.goto('/')

    const draggable = page.locator('[class*="cursor-grab"]').first()
    
    // 初期位置を取得
    const initialBox = await draggable.boundingBox()
    expect(initialBox).not.toBeNull()

    // 図形を右下にドラッグ
    await draggable.hover()
    await page.mouse.down()
    await page.mouse.move(
      initialBox!.x + initialBox!.width / 2 + 100,
      initialBox!.y + initialBox!.height / 2 + 100
    )
    await page.mouse.up()

    // 少し待機してアニメーションを完了
    await page.waitForTimeout(500)

    // 位置が変わったことを確認（完全な座標チェックは避け、移動したことだけ確認）
    const finalBox = await draggable.boundingBox()
    expect(finalBox).not.toBeNull()
    
    // X座標またはY座標が変わったことを確認
    const hasMoved = 
      Math.abs(finalBox!.x - initialBox!.x) > 10 ||
      Math.abs(finalBox!.y - initialBox!.y) > 10
    
    expect(hasMoved).toBe(true)
  })

  test('図形をターゲット近くにドロップするとスナップする', async ({ page }) => {
    await page.goto('/')

    const draggable = page.locator('[class*="cursor-grab"]').first()
    const target = page.locator('.border-white').first()

    // ターゲットの中心座標を取得
    const targetBox = await target.boundingBox()
    expect(targetBox).not.toBeNull()

    const targetCenterX = targetBox!.x + targetBox!.width / 2
    const targetCenterY = targetBox!.y + targetBox!.height / 2

    // 図形をターゲット近くにドラッグ（閾値内に入るように少しずらす）
    await draggable.hover()
    await page.mouse.down()
    await page.mouse.move(targetCenterX + 30, targetCenterY + 30)
    await page.mouse.up()

    // スナップアニメーションの完了を待つ
    await page.waitForTimeout(1000)

    // ドラッグ可能な要素の最終位置を取得
    const finalBox = await draggable.boundingBox()
    expect(finalBox).not.toBeNull()

    const finalCenterX = finalBox!.x + finalBox!.width / 2
    const finalCenterY = finalBox!.y + finalBox!.height / 2

    // ターゲット中心とドラッグ要素の中心が近いことを確認（許容誤差10px）
    expect(Math.abs(finalCenterX - targetCenterX)).toBeLessThan(10)
    expect(Math.abs(finalCenterY - targetCenterY)).toBeLessThan(10)
  })
})
