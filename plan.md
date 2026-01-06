# Pascal パズルゲーム 実装計画書

## 現状分析

### 既存の実装
- **フレームワーク**: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion
- **基本機能**: 正方形のD&D、スナップ機能、効果音（Web Audio API）
- **UI**: アニメ風の目、幾何学模様の背景
- **テスト**: Vitest（ユニット）+ Playwright（E2E）

### 未実装（仕様との差分）
1. ゲームフロー（難易度選択 → 5ステージ → ゲームクリア）
2. 複数の図形（長方形、平行四辺形、正三角形、二等辺三角形）
3. パズルテンプレートのランダム生成
4. 難易度別の機能（罫線表示、回転機能）
5. ステージ/ゲームクリア演出
6. 仕様画像の.gitignore設定

---

## フェーズ1: 基盤整備

### 1.1 ゲーム状態管理の実装
**ファイル**: `src/store/gameStore.ts`

```typescript
// 管理する状態
- currentDifficulty: 'easy' | 'normal' | 'hard'
- currentStage: 1-5
- gamePhase: 'menu' | 'playing' | 'stageClear' | 'gameClear'
- placedShapes: Set<string>  // 配置済み図形ID
```

### 1.2 定数の拡張
**ファイル**: `src/config/constants.ts`

追加する定数:
- `TOTAL_STAGES = 5`
- `SHAPE_TYPES`: 図形タイプの定義
- 難易度別設定（図形数、回転有無など）

---

## フェーズ2: 図形システム

### 2.1 図形タイプの定義
**ファイル**: `src/types/shapes.ts`

```typescript
type ShapeType = 'square' | 'rectangle' | 'parallelogram' | 'equilateralTriangle' | 'isoscelesTriangle'

interface Shape {
  id: string
  type: ShapeType
  width: number
  height: number
  rotation: number  // 0, 90, 180, 270
  color: string
  points?: number[][]  // SVG polygon用（三角形・平行四辺形）
}
```

### 2.2 各図形コンポーネントの実装
**ディレクトリ**: `components/shapes/`

| ファイル | 説明 |
|---------|------|
| `Square.tsx` | 正方形（既存のDraggableSquareを改修） |
| `Rectangle.tsx` | 長方形 |
| `Parallelogram.tsx` | 平行四辺形 |
| `EquilateralTriangle.tsx` | 正三角形 |
| `IsoscelesTriangle.tsx` | 二等辺三角形 |
| `DraggableShape.tsx` | 共通ラッパー（D&D、回転ロジック） |

### 2.3 図形の描画
- 正方形・長方形: `div` + CSS
- 三角形・平行四辺形: `svg` + `polygon`
- 全図形共通: アニメ目を中央に配置

---

## フェーズ3: パズル生成システム

### 3.1 パズルテンプレート生成
**ファイル**: `src/utils/puzzleGenerator.ts`

アルゴリズム:
1. グリッドベースで配置可能領域を定義
2. 難易度に応じた図形数を決定（かんたん: 3-4個、ふつう: 4-5個、むずかしい: 5-6個）
3. 図形をランダムに選択し、衝突しないよう配置
4. 「むずかしい」では回転が必要な配置を生成

```typescript
interface PuzzleTemplate {
  shapes: ShapeSlot[]       // 配置すべき図形
  targetSlots: TargetSlot[] // ターゲット枠
}

interface ShapeSlot {
  shape: Shape
  initialPosition: { x: number, y: number }
}

interface TargetSlot {
  shape: Shape
  position: { x: number, y: number }
  requiredRotation?: number  // むずかしいモード用
}
```

### 3.2 ターゲット枠コンポーネント
**ファイル**: `components/TargetArea.tsx`

- 難易度「かんたん」: 各図形の輪郭線を表示
- 難易度「ふつう」「むずかしい」: 外枠のみ表示

---

## フェーズ4: ゲーム画面の実装

### 4.1 画面構成
```
app/
├── page.tsx              # メニュー画面（難易度選択）
├── game/
│   └── page.tsx          # ゲーム画面
└── layout.tsx            # 共通レイアウト
```

### 4.2 メニュー画面
**ファイル**: `app/page.tsx`（改修）

- タイトル表示
- 難易度選択ボタン（かんたん / ふつう / むずかしい）
- 4歳児向けの大きなボタン、かわいいデザイン

### 4.3 ゲーム画面
**ファイル**: `app/game/page.tsx`（新規）

構成要素:
1. ステージ進捗表示（★★★☆☆ 形式）
2. ターゲット枠エリア
3. ドラッグ可能な図形エリア
4. 戻るボタン

---

## フェーズ5: 難易度別機能

### 5.1 かんたんモード
- ターゲット枠に各図形の輪郭線を表示
- 図形とスロットが1:1で明確にマッチ
- 回転機能なし

### 5.2 ふつうモード
- ターゲット枠は外枠のみ（罫線なし）
- どの図形がどこに入るか想像力が必要
- 回転機能なし

### 5.3 むずかしいモード
- ターゲット枠は外枠のみ
- 図形をタップで90度回転可能
- 正しい向きでないとスナップしない

### 5.4 回転機能の実装
**ファイル**: `src/hooks/useShapeRotation.ts`

- ダブルタップまたは専用ボタンで90度回転
- 回転アニメーション（Framer Motion）
- スナップ判定時に回転角度も考慮

---

## フェーズ6: エフェクト・演出

### 6.1 スナップ成功エフェクト
**ファイル**: `components/effects/SnapEffect.tsx`

- パーティクルエフェクト（星が飛び散る）
- 図形が軽くバウンス
- 既存の「カチャッ」音を強化

### 6.2 ステージクリア演出
**ファイル**: `components/effects/StageClearEffect.tsx`

- 画面全体に星が降る
- 「すごい！」のテキスト表示
- ファンファーレ音（Web Audio APIで合成）
- 次のステージへ進むボタン

### 6.3 ゲームクリア演出
**ファイル**: `components/effects/GameClearEffect.tsx`

- 紙吹雪エフェクト
- キャラクターが喜ぶアニメーション
- 「クリアおめでとう！」表示
- メニューに戻るボタン

---

## フェーズ7: 仕上げ

### 7.1 .gitignore更新
追加:
```
# 仕様画像ファイル
docs/specs/*.HEIC
docs/specs/*.heic
docs/specs/*.png
docs/specs/*.jpg
```

### 7.2 PWA最適化
- manifest.json の確認・更新
- アイコン設定
- オフライン対応（Service Worker）

### 7.3 テストの追加
- ユニットテスト: パズル生成ロジック、スナップ判定
- E2Eテスト: ゲームフロー、難易度選択、クリア判定

---

## 実装順序

| 順番 | タスク | 依存関係 |
|-----|-------|---------|
| 1 | 定数・型定義の拡張 | なし |
| 2 | ゲーム状態管理の実装 | 1 |
| 3 | 各図形コンポーネントの実装 | 1 |
| 4 | パズル生成システム | 1, 3 |
| 5 | メニュー画面の改修 | 2 |
| 6 | ゲーム画面の実装 | 2, 3, 4 |
| 7 | 難易度別機能（罫線、回転） | 6 |
| 8 | スナップエフェクト | 6 |
| 9 | ステージ/ゲームクリア演出 | 6 |
| 10 | .gitignore更新 | なし |
| 11 | テスト追加 | 全て |

---

## ファイル構成（実装後）

```
pascal/
├── app/
│   ├── page.tsx              # メニュー画面
│   ├── game/
│   │   └── page.tsx          # ゲーム画面
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── shapes/
│   │   ├── DraggableShape.tsx
│   │   ├── Square.tsx
│   │   ├── Rectangle.tsx
│   │   ├── Parallelogram.tsx
│   │   ├── EquilateralTriangle.tsx
│   │   └── IsoscelesTriangle.tsx
│   ├── effects/
│   │   ├── SnapEffect.tsx
│   │   ├── StageClearEffect.tsx
│   │   └── GameClearEffect.tsx
│   ├── TargetArea.tsx
│   ├── StageProgress.tsx
│   ├── DifficultyButton.tsx
│   ├── AnimeEyes.tsx
│   └── GeometricBackground.tsx
├── src/
│   ├── store/
│   │   └── gameStore.ts
│   ├── types/
│   │   └── shapes.ts
│   ├── utils/
│   │   ├── puzzleGenerator.ts
│   │   └── snapPhysics.ts
│   ├── hooks/
│   │   ├── useGameState.ts
│   │   ├── useShapeRotation.ts
│   │   ├── useSnapSound.ts
│   │   ├── useClearSound.ts
│   │   └── useBlinkAnimation.ts
│   └── config/
│       └── constants.ts
└── tests/
    ├── unit/
    │   ├── puzzleGenerator.test.ts
    │   └── snapPhysics.test.ts
    └── e2e/
        ├── game-flow.spec.ts
        └── difficulty.spec.ts
```

---

## 注意事項

1. **パフォーマンス**: 多数の図形を同時にドラッグ可能にする際、再レンダリングを最小化
2. **タッチ操作**: 4歳児の不正確なタッチを考慮した判定領域
3. **アクセシビリティ**: 色覚多様性を考慮した色使い
4. **Safari対応**: iPad/Safariでの動作確認必須
