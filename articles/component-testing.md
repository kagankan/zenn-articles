---
title: "コンポーネントテストの方法4種類比較してみる（2025年版）"
emoji: "🧪"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "playwright", "vitest", "storybook", "testing"]
publication_name: "kikagaku"
published: false
---

コンポーネントの挙動をテストしたいときに使える手段が増えてきており、新たに導入する際にはどの方法を選べばいいか迷います。
ここでは、コンポーネントテストの方法を 4 つ紹介し、それぞれのメリット・デメリットを比較します。

## この記事で比較するコンポーネントテストの方法

1. **jsdom** (or happy-dom) + Vitest (or Jest) + Testing Library
2. **Storybook `play` function**
3. **Playwright Component Test**
4. **Vitest Browser Mode**

:::details 除外したもの：Cypress component testing

Cypress にも Component Testing がありますが、今回の調査対象からは外しています。

- 個人的・社内的に Cypress の使用例がなく、新たに導入するモチベーションがない
- Playwright 等で提供されている `.getByRole` に相当する ARIA ロールを元にした要素取得手段がなく、アクセシビリティを意識したテストコードを書くことができない

すでに Cypress を導入している場合は選定対象になるかもしれませんが、そうでなければ Playwright Component Test を選ぶのがよさそうです。

https://docs.cypress.io/app/component-testing/get-started

:::

:::message

以降の説明では基本的に **React コンポーネントを前提**として説明しています。ただし、いずれの方法も他のフレームワークでも対応していることが多いので、他のフレームワークでの対応状況はそれぞれのドキュメントを参照してください。

:::

### 簡易まとめ

|                    | jsdom, happy-dom          | Storybook                  | Playwright Component Test | Vitest Browser Mode               |
| ------------------ | ------------------------- | -------------------------- | ------------------------- | --------------------------------- |
| ステータス         | ✅ Stable                 | ✅ Stable                  | ⚠️ Experimental           | ⚠️ Experimental                   |
| 実行環境           | Node                      | ブラウザ                   | ブラウザ（テストは Node） | ブラウザ                          |
| ブラウザの関数     | ❌ 動かない               | ✅ 動く                    | ✅ 動く                   | ✅ 動く                           |
| 実行速度           | 🚀 速い                   | ✈️ そこそこ                | 🚲 遅い                   | 🚀 速い                           |
| モジュールモック   | ✅ `jest.mock`, `vi.mock` | ⚠️ 可能だがやや扱いづらい  | ❌ 不可                   | ⚠️ `vi.mock` で可能だが、不安定？ |
| モック関数         | ✅ `jest.fn`, `vi.fn`     | ✅ `fn` (`storybook/test`) | ❌ 不可                   | ✅ `vi.fn`                        |
| ネットワークモック | ✅ MSW                    | ✅ MSW（アドオン）         | ✅ MSW                    | ✅ MSW                            |
| 見た目の確認       | ❌ 表示が見れない         | ✅ ブラウザで表示可能      | ✅ ブラウザで表示可能     | ✅ ブラウザで表示可能             |

### GitHub リポジトリ

今回比較のため、同じような内容のテストをそれぞれの手法で作成したサンプルリポジトリを作成しています。

https://github.com/kagankan/component-testing-sample/tree/main/src/components

- [最もシンプルなコンポーネント実行のみの例](https://github.com/kagankan/component-testing-sample/tree/main/src/components/Minimum)
- [様々なケースを含む例](https://github.com/kagankan/component-testing-sample/tree/main/src/components/Complex)
- [モジュールモックの例](https://github.com/kagankan/component-testing-sample/tree/main/src/components/ModuleMock)

### 実行時間比較

ほぼ同じ内容のテストをそれぞれの手法で作成し、100 コンポーネント複製して実行してみました。
※前後のパッケージインストールなどを除いた時間

| テスト手法                       | 実行時間                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| jsdom + Vitest + Testing Library | [1m 12s](https://github.com/kagankan/component-testing-sample/actions/runs/15663384237/job/44124295356?pr=1) |
| jsdom + Jest + Testing Library   | [1m 12s](https://github.com/kagankan/component-testing-sample/actions/runs/15663384243/job/44124295374?pr=1) |
| Storybook `play` function        | [1m 24s](https://github.com/kagankan/component-testing-sample/actions/runs/15663384238/job/44124295340?pr=1) |
| Playwright Component Test        | [3m 22s](https://github.com/kagankan/component-testing-sample/actions/runs/15663384245/job/44124295387?pr=1) |
| Vitest Browser Mode              | [46s](https://github.com/kagankan/component-testing-sample/actions/runs/15663384241/job/44124295351?pr=1)    |

後ろ 3 つについては別途 Playwright のブラウザをインストールする時間がかかるため、総合の時間としては + 20-30s 程度かかります。
それを考慮しても、jsdom によるテストと Vitest Browser Mode の実行時間はほぼ同じで驚きです。
（※あくまで今回作成したテストコードにおける結果なので実際のユースケースでは異なる可能性があります。）

## jsdom (or happy-dom) + Vitest (or Jest) + Testing Library

メジャーな方法で、ウェブ上の資料も多い。
Node 環境上で擬似的に DOM を描画する手法。

https://testing-library.com/docs/react-testing-library/setup

**メリット**

- ブラウザを動かさないため、動作が早い
- ウェブ上の資料が充実している

**デメリット**

- Node で動作させる関係上、**「ブラウザでは動くのに、テストでは動かない」** といったケースが多く発生する。
  - そもそも動かすために多くのモックが必要になりがち。`matchMedia`, `ResizeObserver` などのブラウザ上の関数がないためにいちいちモックしなきゃいけないのが面倒。
    - この苦労が、ユーザーの環境を再現するためならまだしも、「Node 上の環境」というこの世のどこにも存在しない環境の整備になるため、徒労感が大きい。
  - 個人的にはこのデメリットが大きいため、選択肢から外れている。
- 同様に、Node 上で実行されているため見た目を確認することができない。

### コード例

[Testing Library のドキュメント](https://testing-library.com/docs/react-testing-library/example-intro) から引用

```tsx:fetch.test.tsx
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Fetch from './fetch'

test('loads and displays greeting', async () => {
  // ARRANGE
  render(<Fetch url="/greeting" />)

  // ACT
  await userEvent.click(screen.getByText('Load Greeting'))
  await screen.findByRole('heading')

  // ASSERT
  expect(screen.getByRole('heading')).toHaveTextContent('hello there')
  expect(screen.getByRole('button')).toBeDisabled()
})
```

### できること・できないこと

#### モジュールモック

Jest や Vitest の `jest.mock` や `vi.mock` を使用してモックを行うことができます。

#### モック関数

Jest や Vitest の `jest.fn` や `vi.fn` を使用してモック関数を使用できます。
コンポーネントの props に渡した関数の実行を検証できます。

#### ネットワークモック (MSW)

[MSW](https://mswjs.io/) を使用してネットワークアクセスのモックを行うことができます（MSW に関する詳しい説明はここでは省略します）。
Node 上で動作するため、`msw/node` を使用します。

:::details コード例

[Testing Library のドキュメント](https://testing-library.com/docs/react-testing-library/example-intro#full-example) から引用。

```tsx:fetch.test.tsx
import React from 'react'
import {http, HttpResponse} from 'msw'
import {setupServer} from 'msw/node'
import {render, fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Fetch from '../fetch'

const server = setupServer(
  http.get('/greeting', () => {
    return HttpResponse.json({greeting: 'hello there'})
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('loads and displays greeting', async () => {
  render(<Fetch url="/greeting" />)

  fireEvent.click(screen.getByText('Load Greeting'))

  await screen.findByRole('heading')

  expect(screen.getByRole('heading')).toHaveTextContent('hello there')
  expect(screen.getByRole('button')).toBeDisabled()
})

test('handles server error', async () => {
  server.use(
    http.get('/greeting', () => {
      return new HttpResponse(null, {status: 500})
    }),
  )

  render(<Fetch url="/greeting" />)

  fireEvent.click(screen.getByText('Load Greeting'))

  await screen.findByRole('alert')

  expect(screen.getByRole('alert')).toHaveTextContent('Oops, failed to fetch!')
  expect(screen.getByRole('button')).not.toBeDisabled()
})
```

:::

MSW のハンドラー内でモック関数を実行することで、呼び出し回数・引数の検証ができます。

https://zenn.dev/takepepe/articles/jest-msw-mocking

#### ブラウザ固有の機能

`window.scrollTo` などのブラウザ固有の関数、`ResizeObserver` などのブラウザ固有の機能は当然ながら存在しません。
これらが使用されるコンポーネントをテストするためには、モックを使用する必要があります。
Vitest であればあらかじめ大半がモックされており、動かすだけならそのまま動くようになっています（Jest では色々と設定が必要です）。

#### ウィンドウ（ビューポート）サイズを指定したテスト

Node 上で動作するため、ブラウザのウィンドウサイズを指定したテストはできません。

#### 見た目の確認

Node 上で動いているので、見た目を確認することはできません。
特にテストが失敗したときに、どういう状態で失敗したのかが確認できないためデバッグが難しくなります。

[Jest Preview](https://www.jest-preview.com/)、[Vitest Preview](https://www.vitest-preview.com/) というツールが存在しているようですが、最終更新が 2022 年でメンテが止まっているため、積極的な採用は避けたいです。
（参考記事: https://azukiazusa.dev/blog/jest-preview/）

#### ウォッチモード

- Vitest では、ローカル環境で実行する場合デフォルトでウォッチモードが有効になります。
- Jest では、ウォッチモードを有効にするには `jest --watch` を実行する必要があります。

#### Storybook との連携

各フレームワークで提供されている `composeStories` 関数を使用して、`*.stories.tsx` で定義したストーリーをテストコードに利用できます。

https://storybook.js.org/docs/writing-tests/integrations/stories-in-unit-tests

### Vitest vs Jest

今回の比較の主題とは外れるのですが、興味があったので比較しました。
（Vitest のほうがいいとは思っていたが、実際どのくらい違うか知りたかった）

- **新たに導入するなら Vitest 一択。**
- 今回どちらもセットアップしてみたが、Vitest が圧倒的にセットアップが容易！　入れれば動く。
- それに対して Jest の詰まりポイントの多さたるや。動かしてみたらエラーになるポイントが多く、追加する必要のあるパッケージや、config に追加する記述も多い。

#### 実行時間

ほぼ同じ内容のコンポーネントテストを 100 件作成して実行してみた結果です。CI 上での実行にはほぼ差がありませんでした。

- jsdom + Vitest + Testing Library: [1m 12s](https://github.com/kagankan/component-testing-sample/actions/runs/15663384237/job/44124295356?pr=1)
- jsdom + Jest + Testing Library: [1m 12s](https://github.com/kagankan/component-testing-sample/actions/runs/15663384243/job/44124295374?pr=1)

しかし、重要なのは CI よりも、**ローカル環境においてウォッチモードで実行したときの時間**です。
なんと**8 倍ほどの差**があります。

- Jest: 平均 **4039ms**（4 秒）
- Vitest: 平均 **562ms**（0.5 秒）

開発中に何十回何百回と実行するコマンドですので、積み重なってくると大きな差になりますね。

::: details 実行詳細

**Jest**
`jest --watch Complex` を実行し、`Complex` という名前のコンポーネントのみをテスト。
コンポーネント内のテキストを適当に編集して保存するのを 5 回繰り返した結果。

Time: 4.068 s
Time: 3.871 s
Time: 3.433 s
Time: 4.69 s
Time: 4.134 s

**Vitest**
`vitest --project jsdom` を実行（Vitest はデフォルトでウォッチモード。かつ、変更のあったファイルを元に影響のあるテストのみを実行する）。
コンポーネント内のテキストを適当に編集して保存するのを 5 回繰り返した結果。

Duration 572ms
Duration 517ms
Duration 538ms
Duration 540ms
Duration 641ms

:::

## Storybook `play` function

見た目の確認に使える Storybook ですが、インタラクションテストを書くことが可能です。
（必ずしもアサーションを書く必要はなく、「ここをクリックしたときの見た目を表示させたい」という用途でも使用できる機能です）

弊社でもこの方法を使用してコンポーネントテストを書いています（Storybook v8 環境）。

https://storybook.js.org/docs/writing-stories/play-function

:::message

Storybook v8 と v9 で書き方や使用するライブラリ名などが変わっている箇所が多くあります。
基本 v9 で説明を記載しているつもりですが、混在している可能性もあるので使用の際にはドキュメント、特に[マイグレーションガイド](https://storybook.js.org/docs/migration-guide)を確認してください。

:::

### コード例

[ドキュメント](https://storybook.js.org/docs/writing-tests/interaction-testing#writing-interaction-tests) から引用。
`play` 関数の中に実行したい操作を書いていきます。

```tsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, nextjs-vite, etc.
import type { Meta, StoryObj } from '@storybook/your-framework';

import { expect } from 'storybook/test';

import { LoginForm } from './LoginForm';

const meta = {
  component: LoginForm,
} satisfies Meta<typeof LoginForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const EmptyForm: Story = {};

export const FilledForm: Story = {
  play: async ({ canvas, userEvent }) => {
    // 👇 Simulate interactions with the component
    await userEvent.type(canvas.getByTestId('email'), 'email@provider.com');

    await userEvent.type(canvas.getByTestId('password'), 'a-random-password');

    // See https://storybook.js.org/docs/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole('button'));

    // 👇 Assert DOM structure
    await expect(
      canvas.getByText(
        'Everything is perfect. Your account is ready and we should probably get you started!'
      )
    ).toBeInTheDocument();
  },
};
```

### できること・できないこと

#### モジュールモック

Node の Subpath imports の機能を使ったモックがドキュメントで説明されています。

https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-modules

しかし、あらかじめファイルを定義しておく必要があったり、インポートパスの制限があるなどなかなか面倒です。

公式の方法ではありませんが、`storybook-addon-module-mock` または `storybook-addon-vite-mock` を使用するのが便利です。

https://storybook.js.org/addons/storybook-addon-module-mock

https://storybook.js.org/addons/storybook-addon-vite-mock

:::message

ただし、2025年6月時点の Storybook v9 + MSW アドオン + `storybook-addon-vite-mock` の組み合わせを試したところ、エラーで動作しませんでした。どの部分に問題があるか特定できていないため私の環境に問題がある可能性もあるのですが、導入の際はぜひ事前に動作確認を行ってください。

:::

#### モック関数

`storybook/test` （v8 までは `@storybook/test`）から提供される `fn` を使用することで、モック関数を使用できます。

#### ネットワークモック

MSW アドオンでネットワークモックを行うことができます。

https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-network-requests#set-up-the-msw-addon

#### ブラウザ固有の機能

ブラウザ上で動作するため、基本的にそのまま動きます。

#### ウィンドウ（ビューポート）サイズを指定したテスト

以下のように `viewport` を設定することで画面サイズを変更できます。
（Storybook v9 から指定方法が変更されているので注意）

https://storybook.js.org/docs/essentials/viewport

```tsx
export const 画面サイズ_狭い: Story = {
  globals: {
    viewport: { value: "mobile1" },
  },
  // ...
};
```

#### 見た目の確認

Storybook のローカルサーバーで対象コンポーネントを開いたときに自動で実行され、テスト内容は Interactions タブに表示されます。

![スクリーンショット。Storybook のローカルサーバーを開いた様子。右下部の Interactions テストの実行内容が表示されている。](/images/component-testing/2025-06-15-22-45-40.png)

左下の UI からテストを一括実行することも可能。

![](/images/component-testing/2025-06-15-22-47-46.png)

#### その他

- `describe` にあたる機能がないため、ファイル内で階層化ができないのが難点。

### CI での実行方法

CI での実行法にはいくつかの手段があります。

https://storybook.js.org/docs/writing-tests/in-ci

#### test-runner で実行する

https://storybook.js.org/docs/writing-tests/integrations/test-runner

`@storybook/test-runner` を追加し、 `npm run test-storybook` コマンドで実行します。
ただし、v9 以降では後述する Vitest Addon が推奨となっているため、詳細は省略します。

#### Vitest Addon で実行する

v9 以降では test-runner として提供されていた機能が Vitest addon に置き換えられました。

> The test runner has been superseded by the Vitest addon, which offers the same functionality, powered by the faster and more modern Vitest browser mode.
> https://storybook.js.org/docs/writing-tests/integrations/test-runner

https://storybook.js.org/docs/writing-tests/integrations/vitest-addon

`@storybook/addon-vitest` を追加し、CI 上では vitest のコマンドで実行します。

:::message

ただし、私の環境で Storybook v9 + `@storybook/addon-vitest` を試したところ、ローカルではうまくいくものの、CI 上で「1回目の実行では失敗するが、2回目の実行では成功する」という現象が発生しました（[実行ログ](https://github.com/kagankan/component-testing-sample/actions/runs/15714188258/job/44279685242)）。
私の設定に問題がある可能性もあるため、導入の際はぜひ事前に動作確認を行ってください。

:::

#### Chromatic で実行する

UI テストツールである Chromatic では `play` function のインタラクションテストも実行できます。
（ちなみに弊社キカガクでは、Storybook にコンポーネントテストを書いており、Chromatic で VRT と合わせて実行しています。）

スナップショット数によっては料金がかかることに注意してください。

https://www.chromatic.com/docs/interactions/

VRT とインタラクションテストをまとめてスナップショット 1 件のカウントになるため、すでに VRT を実行している場合、テストを足してもスナップショット数は増えません。
Chromatic には [TurboSnap](https://www.chromatic.com/docs/turbosnap/) という機能があり、差分ファイルに基づいて影響のあるテストだけ実行されます。

## Playwright Component Test

E2E テストツールである Playwright の機能です。
コンポーネント描画はブラウザ上で、テスト自体は node サーバー上で実行されます。

https://playwright.dev/docs/test-components

:::message

2025 年 6 月現在、実験的機能として提供されています。

:::

**メリット**

- ブラウザ上でコンポーネントを実行するため、忠実性が高い
- ブラウザ上で見た目の確認ができる

**デメリット**

- モジュールモックができない
- モック関数が使用できない
  - vitest の場合は `vi.fn` でモックできるが、playwright の場合はそういったモック関数を用意できない。
- 実行時間が長い

### コード例

[ドキュメント](https://playwright.dev/docs/test-components#step-2-create-a-test-file-srcappspectstsx)から引用。

```tsx:App.test.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import App from './App';

test('should work', async ({ mount }) => {
  const component = await mount(<App />);
  await expect(component).toContainText('Learn React');
});
```

#### 共通設定

全体共通で設定するものは `playwright/index.html` および `playwright/index.tsx` に記述します。
テスト単位でオプションを使うこともできるようです。
（Playwright Component Test では独立したページを開いてコンポーネントを描画することで、テスト間での影響が生まれることを避けているそうです。）

:::details コード例

```html:playwright/index.html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Component Testing Page</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./index.tsx"></script>
  </body>
</html>
```

```tsx:playwright/index.tsx
import { ChakraProvider } from '@chakra-ui/react';
import { beforeMount } from '@playwright/experimental-ct-react/hooks';
import { theme } from '../libs/chakra-ui';

beforeMount<HooksConfig>(async ({ App }) => {
  return (
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  );
});
```

各テストで設定するオプションを定義することもできる。
https://playwright.dev/docs/test-components#hooks

```tsx:playwright/index.tsx
import { beforeMount, afterMount } from '@playwright/experimental-ct-react/hooks';
import { BrowserRouter } from 'react-router-dom';

export type HooksConfig = {
  enableRouting?: boolean;
};

beforeMount<HooksConfig>(async ({ App, hooksConfig }) => {
  if (hooksConfig?.enableRouting)
    return <BrowserRouter><App /></BrowserRouter>;
});
```

```tsx:App.test.tsx
// 使い方
test('configure routing through hooks config', async ({ page, mount }) => {
  const component = await mount<HooksConfig>(<ProductsPage />, {
    hooksConfig: { enableRouting: true },
  });
  await expect(component.getByRole('link')).toHaveAttribute('href', '/products/42');
});
```

:::

### できること・できないこと

#### モジュールモック

意見は上がっているが、実装されていない。
そもそもが E2E テストツールであるため、仕方ない気はする。

https://github.com/microsoft/playwright/issues/14572

モジュールモックをしたいケースは多いため、個人的には採用が難しそう。

#### モック関数

[ドキュメント](https://playwright.dev/docs/test-components#example) にあるように、変数を用意して実行されたかテストするしかない。
Jest や Vitest のように、`toHaveBeenCalled` のようなアサーションを行うことはできない。

:::details Playwright Component Test で関数実行のテストをするコード例

```tsx
test("event should work", async ({ mount }) => {
  let clicked = false;

  // Mount a component. Returns locator pointing to the component.
  const component = await mount(
    <Button
      title="Submit"
      onClick={() => {
        clicked = true;
      }}
    ></Button>
  );

  // As with any Playwright test, assert locator text.
  await expect(component).toContainText("Submit");

  // Perform locator click. This will trigger the event.
  await component.click();

  // Assert that respective events have been fired.
  expect(clicked).toBeTruthy();
});
```

:::

#### ネットワークモック

`router` を介して、 MSW を使用したネットワークモックを行うことができる。

https://playwright.dev/docs/test-components#handling-network-requests

```tsx
import { http, HttpResponse } from "msw";

test("example test", async ({ mount, router }) => {
  await router.use(
    http.get("/data", async ({ request }) => {
      return HttpResponse.json({ value: "mocked" });
    })
  );

  // test as usual, your handler is active
  // ...
});
```

#### ブラウザ固有の機能

ブラウザで動作させるため、実際の環境と同じように動作します。

#### ウィンドウ（ビューポート）サイズを指定したテスト

以下のように指定することで、ビューポートサイズを指定して実行できます。

```tsx
test("モバイルサイズのとき", async ({ mount, page }) => {
  page.setViewportSize({ width: 375, height: 667 });
  const component = await mount(<App />);
  // ...
});
```

#### 見た目の確認

[VSCode の Playwright 拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)を使うと、テスト実行時のコンポーネント描画を確認できます。
テストコードの横に緑の実行ボタン ▶️ が出てくるので、それをクリックするとブラウザが立ち上がります。

![スクリーンショット。テストコードの書かれたエディタ。横に緑の実行ボタンがある。](/images/component-testing/2025-06-08-17-12-17.png)

ブラウザを開いた状態で要素取得のコードにカーソルを合わせると、該当する要素がハイライトされます。

![スクリーンショット。左側のエディタではテストコードにカーソルがあり、右側のブラウザでは該当する要素がハイライトされている。](/images/component-testing/2025-06-08-17-18-36.png)

#### ウォッチモード

`--ui` オプションを付けて実行して UI を起動することで、ウォッチモードを有効にできます。

https://playwright.dev/docs/test-ui-mode#watch-mode

#### Storybook との連携

Portable stories API により Storybook のストーリーをテストコードに利用できるそうです（実際に試したわけではないので詳細不明）。
Playwright 独自の test 関数を使用する代わりに、Storybook の特別な createTest 関数を使う。

https://storybook.js.org/docs/api/portable-stories/portable-stories-playwright

#### その他

- `playwright/.cache` にキャッシュが残されるためか、コンポーネントファイルを移動した際にキャッシュによってエラーが吐かれてしまうことがあった。

## Vitest Browser Mode

テストフレームワークである Vitest の機能。
Playwright (or WebdriverIO) を利用して、ブラウザ上でコンポーネントを動作させる。

https://vitest.dev/guide/browser/

:::message

2025 年 6 月現在、実験的機能として提供されています。

:::

### コード例

[Vitest Browser Mode のドキュメント](https://vitest.dev/guide/browser/react.html) から引用

```tsx
import { render } from "vitest-browser-react";
import Fetch from "./fetch";

test("loads and displays greeting", async () => {
  // Render a React element into the DOM
  const screen = render(<Fetch url="/greeting" />);

  await screen.getByText("Load Greeting").click();
  // wait before throwing an error if it cannot find an element
  const heading = screen.getByRole("heading");

  // assert that the alert message is correct
  await expect.element(heading).toHaveTextContent("hello there");
  await expect.element(screen.getByRole("button")).toBeDisabled();
});
```

### できること・できないこと

#### モジュールモック

Vitest の `vi.mock` を使用してモックを行うことができます。

:::message

ただし、Browser Mode ではまだ不安定なのか、最初の 1 回はうまくいくもののウォッチモードでの再実行でモジュールモックされなくなるということがありました。
私の設定が正しくない可能性や、今後のバージョンで改善される可能性もあるため、導入の際はぜひ事前に動作確認を行ってください。

:::

#### モック関数

Vitest の `vi.fn` を使用してモックを行うことができます。

#### ネットワークモック

MSW でネットワークモックを行うことができます。
Vitest Browser Mode での使用方法は、MSW のドキュメントに記載されています。

https://mswjs.io/docs/recipes/vitest-browser-mode/

#### ブラウザ固有の機能

ブラウザ上で動かすため、基本的にそのまま動きます。

ただし、`window.alert`, `window.confirm` はテストが止まってしまうためモックが必要。
実行時に使用された場合、そのことをコンソールで説明してくれる。親切 😌

![](/images/component-testing/2025-06-15-04-56-48.png)

#### ウィンドウ（ビューポート）サイズを指定したテスト

以下のように指定することで、ビューポートサイズを指定して実行できます。

```tsx
import { page } from "@vitest/browser/context";

test("モバイルサイズのとき", async () => {
  page.viewport(375, 667);
  // ...
});
```

#### 見た目の確認

ブラウザ上でテスト一覧の UI 表示できます。（この機能自体はコンポーネントテストに限らず使用できます）

https://vitest.dev/guide/ui

コンポーネントは iframe 内で描画されています。
左側のペインにはテストの一覧が表示されており、クリックして再実行したりできます。

![スクリーンショット。Vitest UI でコンポーネントテストを実行したときのブラウザの表示。左側にテストの一覧、真ん中にコンポーネントの表示、右側にコンソールが表示されている。](/images/component-testing/2025-06-15-23-37-34.png)

これもコンポーネントテストだけの機能ではないですが、モジュールグラフが表示されるのも便利です。

![スクリーンショット。Vitest UI でモジュールグラフを表示したときのブラウザの表示。](/images/component-testing/2025-06-15-23-39-37.png)

#### ウォッチモード

Vitest ではデフォルトでウォッチモードが有効になっています。
ファイルを保存すると、変更のあったファイルを元に影響のあるテストを実行します。
この手軽さが Vitest の大きな魅力の一つです。

#### グローバル設定

Storybook における `.storybook/preview.tsx` や Playwright Component Test における `playwright/index.tsx` のような、すべてのテストに適用するグローバル設定のようなものはなさそうです。

やるとしたら、`render` をラップしてた汎用関数を作るとよさそうです。

```tsx:test-utils.tsx
import { render as originalRender } from "vitest-browser-react";
import { ChakraProvider } from "@chakra-ui/react";

export const render = (component: React.ReactElement) => {
  return originalRender(<ChakraProvider>{component}</ChakraProvider>);
};
```

#### Storybook との連携

Portable stories API を使うことで、Storybook のストーリーをテストコードに利用できます。

https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest

### Playwright Component Test と Vitest Browser Mode の違い

Playwright の Issue 内に説明しているコメントがありました。

https://github.com/microsoft/playwright/issues/34819#issuecomment-2665819440

翻訳の上要約すると、以下の点が異なるようです。

- Playwright Component Test はテストをサーバー上で実行し、Vitest Browser Mode はブラウザ上で実行する。これによりPlaywright は高速で、flake（不安定な挙動）が起こりにくい。
- Vitest Browser Mode は独自のランナーを使用するためユニットテストと同様に動作する。一方で、Playwright の API を直接公開するわけではないので、新しい機能を使うには Vitest の対応を待つ必要がある。
- Playwright Component Test はテストごとに独立したブラウザインスタンスを提供するため、副採用が起きにくい。Vitest Browser Mode は iframe 内でコンポーネントを描画するため、テスト間で副作用が起こる可能性がある。

Vitest Browser Mode ではテストコードも含めてブラウザ上で実行されているため、以下のように window オブジェクトを参照することができます。
一方で、Playwright Component Test ではテストコードは Node 上で実行されているため、window オブジェクトを参照することはできずエラーになります。

```tsx
// Vitest Browser Mode では window オブジェクトを参照できる
// Playwright Component Test では window オブジェクトは存在せずエラーになる
expect(window.scrollY).toBe(0);
```

## 個人的感想

- jsdom（Node 上で DOM を再現する方法）は忠実性の低さが問題となりやすいためやはり避けたい。
  - 実行時間・安定性を求めたい場合は検討の価値あり。
- Storybook `play` function は、Stable な機能の中では最適。特にすでに Storybook を導入している場合は、導入しやすい。
  - 実行手段は Chromatic がおすすめ。VRTと合わせて実行でき、見た目のテストとインタラクションテストを同時に充実できる。
  - 料金が見合わない場合は、Vitest Addon (or test-runner) で実行。
- Playwright Component Test はモジュールモックやモック関数を使用できない点が難点で、テストケースを実現するコストが高そう。個人的には採用が難しそうな感覚。
- Vitest Browser Mode はかなりいい感じ。一部の不安定挙動だけ回避できそうであれば、十分選択肢に入る。

## 参考リンク集

### Storybook

https://zenn.dev/sora_kumo/articles/8a79531e726b29

https://zenn.dev/makotot/articles/b0729488282148

https://blog.cybozu.io/entry/2023/05/29/090000

https://zenn.dev/yumemi_inc/articles/do-not-let-the-storybook-rot

https://zenn.dev/yumemi_inc/articles/storybook-testing-next-navigation
https://storybook.js.org/docs/writing-tests/accessibility-testing#automate-accessibility-tests-with-test-runner

### Storybook + Vitest

https://zenn.dev/innovation/articles/e10e5b5842cf29

https://azukiazusa.dev/blog/storybook-and-vitest-integration

https://zenn.dev/yumemi_inc/articles/storybook-8-3-vitest

https://saneeeatsu.hatenablog.com/entry/2025/04/16/124656

### Vitest Browser Mode

https://developers.prtimes.jp/2025/02/21/vitest-browser-mode/

https://speakerdeck.com/odanado/vitest-browser-mode

### Playwright

https://qiita.com/hairihou/items/61f82636eef855af953e

https://speakerdeck.com/rakus_fe/kokogasugoize-playwright-component-test

### MSW

https://zenn.dev/azukiazusa/articles/using-msw-to-mock-frontend-tests

https://zenn.dev/takepepe/articles/jest-msw-mocking
