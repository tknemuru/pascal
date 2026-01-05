# Pascal - 4歳児のための知育パズルアプリ

[![CI](https://github.com/tknemuru/pascal/actions/workflows/ci.yml/badge.svg)](https://github.com/tknemuru/pascal/actions/workflows/ci.yml)

形パズルを通じて、4歳児の認知能力と手先の運動能力を育てる知育アプリです。

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (ドラッグ&ドロップアニメーション)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### 3. iPadでの動作確認

開発サーバーを起動後、iPadのSafariで以下のURLにアクセス：

```
http://<あなたのPCのIPアドレス>:3000
```

#### フルスクリーン表示する方法

1. Safari で上記URLを開く
2. 共有ボタン（□に↑）をタップ
3. 「ホーム画面に追加」を選択
4. ホーム画面のアイコンからアプリを起動

これにより、アドレスバーのないフルスクリーン表示が可能になります。

## 機能

### 現在実装済み

- ✅ iPadフルスクリーン対応
- ✅ 青い正方形をドラッグ&ドロップ
- ✅ 画面からはみ出さない制御
- ✅ タッチ時のスケールアニメーション
- ✅ スクロール・ズーム・テキスト選択の無効化

### UXの工夫

- **大きなタッチターゲット**: 120×120pxの正方形で小さな指でも操作しやすい
- **滑らかなアニメーション**: タッチ時に拡大、ドラッグ時に影が強調される
- **誤操作防止**: スクロール、ピンチズーム、テキスト選択を無効化

## 開発ガイドライン

### 4歳児向けUXの原則

1. **大きなタッチターゲット**: 最小44×44px、できれば100px以上
2. **シンプルな操作**: ドラッグとタップのみ
3. **明確なフィードバック**: 視覚的・アニメーション的なフィードバックを提供
4. **誤操作防止**: 不要なジェスチャーは無効化
5. **遊び心のあるデザイン**: カラフルで楽しい視覚効果

## ディレクトリ構造

```
pascal/
├── app/
│   ├── globals.css      # グローバルスタイル・iPad最適化
│   ├── layout.tsx       # ルートレイアウト・メタデータ
│   └── page.tsx         # ホームページ
├── components/
│   └── DraggableSquare.tsx  # ドラッグ可能な正方形コンポーネント
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## ライセンス

MIT License
