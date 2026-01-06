# Project: Pascal (Educational Shape Puzzle for 4yo)

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- framer-motion (for animations and D&D)

## UX Guidelines for 4-year-olds

- Large touch targets (min 44x44px).
- Playful but sophisticated animations.
- No complex gestures; stick to simple drag-and-drop and tap.
- Prevent accidental scrolls or zooms (iPad optimization).

## Code Quality & Testing Guidelines

- Separate pure logic from view components to improve testability.
  - (純粋なロジックとViewを分離してテストしやすいコードを意識する)
- Create test code alongside logic implementation when it provides significant value for bug detection.
  - (ロジックに対するテストコードの作成が有益である場合はテストコードを一緒に作成する)
- Write tests that balance bug detection effectiveness with maintainability; avoid excessive test bloat.
  - (バグ検知観点での有益性、メンテナンス性を意識し、いたずらにテストコードを増やさない)
- Focus on testing business logic and critical paths rather than trivial implementation details.
  - (ビジネスロジックと重要なパスに焦点を当て、些細な実装詳細のテストは避ける)

### E2E Testing Strategy

- Implement E2E tests for critical user paths that directly impact the 4-year-old user experience.
  - (4歳児のユーザー体験に直接影響するクリティカルパスのE2Eテストを実装する)
- Prioritize tests that catch rendering failures and core interaction bugs early.
  - (レンダリング失敗やコアとなるインタラクションのバグを早期に検知するテストを優先する)
- Keep E2E tests focused and fast; avoid testing implementation details that unit tests cover.
  - (E2Eテストは焦点を絞り高速に保つ。単体テストでカバーできる実装詳細はテストしない)
- Run E2E tests in CI to prevent regressions before deployment.
  - (デプロイ前にリグレッションを防ぐため、CIでE2Eテストを実行する)

## AI Implementation Workflow

### Planning Requirement

- For any non-trivial changes, always create a plan first and align with the user before implementation.
  - (軽微な変更以外は、必ず最初に計画を作成し、実装前にユーザーとすり合わせを行う)
- Trivial changes include: minor text fixes, simple formatting adjustments, or single-line code corrections.
  - (軽微な変更には、小さなテキスト修正、単純なフォーマット調整、1行のコード修正などが含まれる)
- For complex features or refactoring, break down the plan into clear steps and confirm the approach.
  - (複雑な機能やリファクタリングの場合は、計画を明確なステップに分解し、アプローチを確認する)

### Test Execution Policy

- By default, focus on implementation only without running tests.
  - (デフォルトでは、テスト実行せず実装のみに集中する)
- Run tests only when the user explicitly requests it with phrases like "run tests" or "test this."
  - (ユーザーが「テストを実行して」「テストして」などと明示的に指示した場合のみテストを実行する)
- This policy improves implementation speed and allows users to control when tests are executed.
  - (この方針により実装速度が向上し、ユーザーがテスト実行タイミングをコントロールできる)
