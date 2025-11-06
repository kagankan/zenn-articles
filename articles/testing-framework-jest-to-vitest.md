---
title: "JestからVitestに移行してテスト実行時間が半減した話。そして移行のための格闘。"
emoji: "🚀"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["jest", "vitest", "test", "nestjs"]
published: true
publication_name: "kikagaku"
---

## どう変わったか

Jest で 7 分 48 秒かかっていたテストが…

![テストの実行ログのスクリーンショット。7分48秒の表示](/images/jest-to-vitest/2025-10-28-06-09-13.png)

Vitest で 4 分 12 秒になりました！　👏👏👏👏
（厳密には 46%削減ですが、パッケージインストールなどのオーバーヘッドも含まれるので半減と言っていいでしょう）

![テストの実行ログのスクリーンショット。4分12秒の表示](/images/jest-to-vitest/2025-10-28-06-11-10.png)

そして、ローカルのウォッチモードでも実行時間が大幅減少。
Jest で 8.214 秒かかっていたテストが、

![コンソールのログのスクリーンショット。8.214sの表示](/images/jest-to-vitest/2025-10-28-06-11-19.png)

Vitest で 4.39 秒になりました！　🥳🥳🥳🥳
（テスト数が違っているので単純比較になりませんが、テスト数多いのに早いんだからすごい）

![コンソールのログのスクリーンショット。4.39sの表示](/images/jest-to-vitest/2025-10-28-06-11-31.png)

というわけで、弊社のとあるリポジトリにて、Jest から Vitest に移行することでテスト実行時間を減少させた際の話をします。

## 前提

- NestJS を使用したバックエンドアプリケーションのリポジトリ
- テストケース数は、DB を使用したテストが 700 件、そうでない単体テストが 3000 件程度

## 当時の課題

1. PR ごとに実行しているテストの CI 実行が遅い（DB を使用したテストが 700 件程度の実行に 8 分近くかかっていた）
   - これにより、PR のレビュー依頼を出したり、マージしたりするまでの待ち時間が長くなっていた
   - また、GitHub Actions の課金枠も使用するため、コスト面の影響もあった
2. ローカルのウォッチモードも遅い！
   - 開発中のテストは何 10 回何 100 回と実行するので、ローカルのウォッチモードが遅いのはとても開発効率を下げていた

## 最大のポイントは「実行環境の分離をオフ」にしたこと

もともと Jest を使って実行していたテストを Vitest に変更したことで実行時間が短くなりましたが、ただ単に変えただけで早くなったわけではありません。
一番実行時間に影響したポイントは、**実行環境の分離をオフ**にしたことです。

これは、Vitest のドキュメント内の[Improving Performance](https://vitest.dev/guide/improving-performance.html)にも書いてある方法です。
CLI で `--no-isolate` オプションを指定するか、設定ファイル内で `isolate: false` を設定することで実現できます。（ただし今回の場合は、`isolate` オプションではなく `poolOptions.forks.singleForks` で設定しています。これは、DB を使用したテストで並列実行をさせたくないため、Jest の `--runInBand` 相当の直列実行も指定したいためです）

### 実行環境の分離とは

デフォルトでは、テストコード内で設定した変数等が他のテストに影響しないように、毎回新しい環境が作られます。副作用が生まれないので嬉しいのですが、その代わりに実行が遅くなります。
これをオフにすることで実行時間を短縮していますが、逆に言えば環境変数のリセットなどを自分で行う必要があります。
今回のケースでは、あらかじめ他のテストに影響しないようなテストコードを書いていたので、実行環境の分離をオフにできました。しかし、既存プロジェクトの状況によっては変更が難しいかもしれません。

## Jest から Vitest に変えるためにやったこと

### 依存パッケージ更新

```diff
- "@swc/jest": "^0.2.37"
- "@types/jest": "^29.5.2",
- "eslint-plugin-jest": "^28.0.0",
- "jest": "^29.5.0",
- "ts-jest": "^29.1.0",
+ "@vitest/eslint-plugin": "^1.3.3",
+ "unplugin-swc": "^1.5.5",
+ "vite-tsconfig-paths": "^5.1.4",
+ "vitest": "^3.2.4"
```

- `vitest`: Vitest の本体
- `unplugin-swc`: [NestJS のドキュメント](https://docs.nestjs.com/recipes/swc#vitest) にもある通り、NestJS で使う場合に必要になります。
- `vite-tsconfig-paths`: tsconfig.json の `paths` を解決するためのパッケージ
- `@vitest/eslint-plugin`: Vitest の ESLint プラグイン

`unplugin-swc` と `vite-tsconfig-paths` を使って、Vite のプラグインとして設定します。

```ts:vitest.config.ts
import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    // NestJS のために設定
    // https://docs.nestjs.com/recipes/swc#vitest
    swc.vite({ module: { type: 'es6' } }),
  ],
  // ...
});
```


### テストコード修正

- `jest.*` は `vi.*` に変更
  - 例： `jest.spyOn` → `vi.spyOn`
  - `jest.Mocked` のみ、 `import type { Mocked } from 'vitest';` が必要

基本的にはこれだけで動くはず……なんですが、既存テストコードの問題で様々なエラーが発生したり、これまで通っていたテストが落ちるようになったりしたので、地道に直していきました。

### Vitest 移行時の格闘の数々

移行作業中に遭遇した様々な問題と、その解決方法を紹介します。

#### `GraphQLFloat`, `GraphQLInt` がエラー

`graphql` パッケージの `GraphQLFloat`, `GraphQLInt` を使っているとエラーになってしまった（アプリケーションではエラーにならないので、原理は謎）。モックすることで回避。

```ts:vitest.setup.mts
vi.mock('graphql', async () => {
  const actual = await vi.importActual('graphql');
  return {
    ...actual,
    GraphQLFloat: Float,
    GraphQLInt: Int,
  };
});
```

#### 環境変数が読み込まれない

`DB_URL=postgresql://${DB_USER}:${DB_PASSWORD}@...` のような、他の環境変数を参照した環境変数が読み込まれないことでエラーになっていた。
`dotenv-expand` を使って読み込むことで解消。

```ts:vitest.setup.mts
dotenvExpand.expand(dotenv.config({ path: ".env.test" }));
```

#### エラー比較の判定が変わる

Jest だとゆるかったエラーの比較が厳密になる。これにより、これまでは成功していたテストが失敗することがあるのでテストコードを修正する。

```tsx:JestとVitestで判定が変わる例
// Jest だと成功し、Vitest だと失敗する
// Jest は message さえ一致していればテストが成功する
await expect(
  (() => {
    throw new Error("ERROR_MESSAGE");
  })()
).rejects.toThrow(
  new HttpException("ERROR_MESSAGE", 400),
);
```

#### Zod の `ZodError` の比較に失敗する

比較不可能なプロパティも厳密に比較しようとしてしまうため。以下の Issue コメントを参考に、カスタムテスターを定義する。

https://github.com/vitest-dev/vitest/issues/7315#issuecomment-2606572923

```ts:vitest.setup.mts
// addIssue/addIssues が比較不可能なのに比較しようとして失敗するため、比較可能なオブジェクトに変換する
// 参考: https://github.com/vitest-dev/vitest/issues/7315#issuecomment-2606572923
function normalizeZodError(obj: ZodError): { issues: unknown[] } {
  return {
    issues: obj.issues.map((issue) => {
      if (issue.code === 'invalid_union') {
        return {
          ...issue,
          unionErrors: issue.unionErrors.map((error) => {
            return normalizeZodError(error);
          }),
        };
      } else {
        return issue;
      }
    }),
  };
}

expect.addEqualityTesters([
  function zodErrorEqualityTester(a, b) {
    const aNormalized = a instanceof z.ZodError ? normalizeZodError(a) : null;
    const bNormalized = b instanceof z.ZodError ? normalizeZodError(b) : null;

    // どちらもZodErrorの場合は、比較可能なオブジェクトに変換して比較する
    if (aNormalized && bNormalized) {
      return this.equals(aNormalized, bNormalized);
    }

    // どちらか一方がZodErrorの場合は、比較できないのでfalseを返す
    if ((aNormalized == null) !== (bNormalized == null)) {
      return false;
    }

    // どちらもZodErrorでない場合は、他のtesterに任せる
    return undefined;
  },
]);
```

#### NestJS の `HttpException` の比較で失敗する

これも、vitest が厳密に比較しようとするため。`message` と `status` だけ比較するテスターを定義する。

```ts:vitest.setup.mts
expect.addEqualityTesters([
  // HttpException を比較する。message と status があっていればOK
  function httpExceptionEqualityTester(a, b) {
    if (a instanceof HttpException && b instanceof HttpException) {
      return a.message === b.message && a.getStatus() === b.getStatus();
    }
    return undefined;
  },
]);
```

#### モックがちゃんとリセットされるようになる

Jest だと（なぜか）他のテストにまで残っていたモックが、Vitest だとちゃんとリセットされるようになります。
Jest 時代にも `afterEach` で `restoreMock` するコードは入っていたので、意図しない挙動でした。
すべてのテストで必要なモックは `beforeAll` ではなく、 `beforeEach` 毎回設定するようにします。

#### Jest では効いていたモックが効かなくなる

（これは、Jest の挙動がガバくて、Vitest の挙動が正しいものと思われる）
Jest では `describe` ブロック内で実行されているモックが複数のテストケースに残り続ける（`afterEach` で `restoreMock` をしていたとしても）
Vitest ではこれがちゃんとリセットされるため、Jest で動いていたテストが動かなくなるという事象が起きる。
そのため `beforeEach` で実行する。もしくはすべてのテストケースにコピペしていく。

```diff ts
describe("親describe", () => {
-  mockService.mockResolvedValue(null);
+  beforeEach(() => {
+    // テストごとにモックを設定
+    mockService.mockResolvedValue(null);
+  });

  it("test", () => {
    //
  });
  it("test", () => {
    //
  });
});
```

#### Prisma の 部分的なモックが適切に restore されない

エラー挙動を試すための以下のようなモックを設定した後、`restoreMock` してももとに戻っていなかった。
`getClient` 自体をモックして回避。

```diff ts
- vi.spyOn(prismaService.getClient().userLearnedCourse, "findMany").mockImplementation(() => {
+ vi.spyOn(prismaService, "getClient").mockImplementation(() => {
  throw new Error();
});
```

#### 空の `describe` がエラーになる

Vitest では、中身が空の `describe` がエラーになる。
これから実装予定のものについては、 `.todo` を使う。

```diff ts
- describe("hoge", () => {
+ describe.todo("hoge", () => {
  // 後で作る
});
```

#### `'@faker-js/faker/.';` がエラー

faker が、というよりは、`*/.` という形式がだめだったのかもしれない。`/.` を削除して解消。

```diff ts
- import { faker } from "@faker-js/faker/.";
+ import { faker } from "@faker-js/faker";
```

### 参考: 最終的な設定ファイル

:::details vitest.config.mts

念の為、プロジェクト固有の名称を置き換え、 `app-a`, `app-b`, `app-c` としています。

```ts:vitest.config.mts
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    // NestJS のために設定
    // https://docs.nestjs.com/recipes/swc#vitest
    swc.vite({ module: { type: 'es6' } }),
  ],
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          globals: true,
          setupFiles: ['./vitest.setup.mts'],
          testTimeout: 10000, // タイムアウト時間(ms)
          restoreMocks: true,
          clearMocks: true,
          poolOptions: {
            forks: {
              // 高速化のため環境の分離を無効化している
              // https://vitest.dev/guide/improving-performance.html
              singleFork: true,
            },
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e-app-a',
          globals: true,
          setupFiles: ['./vitest.setup.mts'],
          include: ['apps/app-a/**/*.e2e-spec.ts'],
          restoreMocks: true,
          clearMocks: true,
          isolate: false,
          poolOptions: {
            forks: {
              // 高速化のため環境の分離を無効化している
              // https://vitest.dev/guide/improving-performance.html
              singleFork: true,
            },
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e-app-b',
          globals: true,
          setupFiles: [
            './vitest.setup.mts',
            'apps/app-b/e2e-test/vitest.e2e.setup.ts',
          ],
          include: ['apps/app-b/**/*.e2e-spec.ts'],
          restoreMocks: true,
          clearMocks: true,
          isolate: false,
          poolOptions: {
            forks: {
              // 高速化のため環境の分離を無効化している
              // https://vitest.dev/guide/improving-performance.html
              singleFork: true,
            },
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e-app-c',
          globals: true,
          setupFiles: ['./vitest.setup.mts'],
          include: ['apps/app-c/**/*.e2e-spec.ts'],
          restoreMocks: true,
          clearMocks: true,
          isolate: false,
          poolOptions: {
            forks: {
              // 高速化のため環境の分離を無効化している
              // https://vitest.dev/guide/improving-performance.html
              singleFork: true,
            },
          },
        },
      },
    ],
    poolOptions: {
      forks: {
        // jest の --runInBand と同等
        // DB を用いたテストを行うため、並列実行するとテスト間の影響が出てしまう
        maxForks: 1,
      },
    },
  },
});
```

:::

:::details vitest.setup.mts

```ts:vitest.setup.mts
import { HttpException } from '@nestjs/common';
import { Float, Int } from '@nestjs/graphql';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { vi } from 'vitest';
import type { ZodError } from 'zod';
import { z } from 'zod';

// GraphQLFloat, GraphQLInt を使っているとエラーになる
vi.mock('graphql', async () => {
  const actual = await vi.importActual('graphql');
  return {
    ...actual,
    GraphQLFloat: Float,
    GraphQLInt: Int,
  };
});

dotenvExpand.expand(dotenv.config({ path: '.env.test' }));

// addIssue/addIssues が比較不可能なのに比較しようとして失敗するため、比較可能なオブジェクトに変換する
// 参考: https://github.com/vitest-dev/vitest/issues/7315#issuecomment-2606572923
function normalizeZodError(obj: ZodError): { issues: unknown[] } {
  return {
    issues: obj.issues.map((issue) => {
      if (issue.code === 'invalid_union') {
        return {
          ...issue,
          unionErrors: issue.unionErrors.map((error) => {
            return normalizeZodError(error);
          }),
        };
      } else {
        return issue;
      }
    }),
  };
}

expect.addEqualityTesters([
  function zodErrorEqualityTester(a, b) {
    const aNormalized = a instanceof z.ZodError ? normalizeZodError(a) : null;
    const bNormalized = b instanceof z.ZodError ? normalizeZodError(b) : null;

    // どちらもZodErrorの場合は、比較可能なオブジェクトに変換して比較する
    if (aNormalized && bNormalized) {
      return this.equals(aNormalized, bNormalized);
    }

    // どちらか一方がZodErrorの場合は、比較できないのでfalseを返す
    if ((aNormalized == null) !== (bNormalized == null)) {
      return false;
    }

    // どちらもZodErrorでない場合は、他のtesterに任せる
    return undefined;
  },
  // HttpException を比較する。message と status があっていればOK
  function httpExceptionEqualityTester(a, b) {
    if (a instanceof HttpException && b instanceof HttpException) {
      return a.message === b.message && a.getStatus() === b.getStatus();
    }
    return undefined;
  },
]);
```

:::

## （実行時間以外の点で）Vitest にすると嬉しいこと

- **テストファイルを触るときは、 `npx vitest --standalone` を使うのが便利。**
  - standalone モードは、コマンド実行時点ではテストを実行せず、テストファイルを保存したときにそのファイルだけ実行。
  - 起動時点でファイル名を指定する必要がなく、かつ対象を絞って実行できるので実行時間を短縮できます。
  - 一度対象になった後は、そのテストファイルに関係するファイルを編集したときに自動で再実行されます。
- Vitest では、デフォルトでウォッチモードが有効になっています。
  - 開始後にファイルを保存すると、それに関連するテストが再実行されてクイックに結果が得られます。
  - ウォッチモードではなく 1 回だけ実行したい場合は `vitest run` コマンドを使います。

## おわりに

Jest でセットアップしたテスト環境を Vitest に移行するのは骨が折れる作業でした。
新しくリポジトリを作成する際には、ぜひ最初から Vitest を使うことをおすすめします。

## 参考記事

https://zenn.dev/knowledgework/articles/jest-to-vitest
