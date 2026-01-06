import type { Page } from '@playwright/test'

/**
 * E2Eテスト用のヘルパー関数
 */

/**
 * 難易度を選択してゲームを開始する
 * 
 * @param page - Playwrightのページオブジェクト
 * @param difficulty - 難易度（'easy' | 'normal' | 'hard'）
 */
export async function selectDifficultyAndStartGame(
  page: Page,
  difficulty: 'easy' | 'normal' | 'hard'
): Promise<void> {
  // トップページに移動
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // 難易度ボタンが表示されるまで待機
  const difficultyLabels = {
    easy: 'かんたん',
    normal: 'ふつう',
    hard: 'むずかしい',
  }

  const buttonText = difficultyLabels[difficulty]
  const button = page.getByRole('button', { name: new RegExp(buttonText) })

  // ボタンをクリック
  await button.click()

  // ゲームページに遷移するまで待機
  await page.waitForURL('/game')
  await page.waitForLoadState('networkidle')

  // パズル生成が完了するまで待機
  await page.waitForTimeout(1000)
}

/**
 * ゲームページに直接遷移する
 * （テスト用に状態を事前にセットアップする場合に使用）
 * 
 * @param page - Playwrightのページオブジェクト
 * @param difficulty - 難易度（'easy' | 'normal' | 'hard'）
 */
export async function goToGamePage(
  page: Page,
  difficulty: 'easy' | 'normal' | 'hard'
): Promise<void> {
  // 実装としては selectDifficultyAndStartGame と同じ
  // 将来的に直接遷移できる場合はこちらを最適化
  await selectDifficultyAndStartGame(page, difficulty)
}
