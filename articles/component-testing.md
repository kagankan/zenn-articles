---
title: "コンポーネントテストの方法4種類比較してみる（2025年版）"
emoji: "🐣"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["react", "playwright", "vitest", "storybook", "jest"]
published: false
---

コンポーネントの挙動をテストしたいときに使える手段が増えてきており、新たに導入する際にはどの方法を選べばいいか迷います。
ここでは、コンポーネントテストの方法を 4 つ紹介し、それぞれのメリット・デメリットを比較します。

## この記事で比較するコンポーネントテストの方法

1. **jsdom** (or happy-dom) + Jest, Vitest + Testing Library
2. **Playwright Component Test**
3. **Vitest Browser Mode**
4. **Storybook `play` function**

:::details 除外したもの：Cypress component testing

Cypress にも Component Testing がありますが、今回の調査対象からは外しています。

- 個人的・社内的に Cypress の使用例がなく、自分が今後使うことはないと思われる
- Playwright 等で提供されている `.getByRole` に相当する ARIA ロールを元にした要素取得手段がなく、アクセシビリティを意識したテストコードを書くことができない

すでに Cypress を導入している場合は選定対象になるかもしれませんが、そうでなければ Playwright Component Test を選ぶのがよさそうなため調査していません。

https://docs.cypress.io/app/component-testing/get-started

:::

:::message

以降の説明では基本的に **React コンポーネントを前提**として説明しています。ただし、いずれの方法も他のフレームワークでも対応していることが多いので、他のフレームワークでの対応状況はそれぞれのドキュメントを参照してください。

:::

### 簡易まとめ

|                    | jsdom, happy-dom          | Playwright Component Test | Vitest Browser Mode   | Storybook                         |
| ------------------ | ------------------------- | ------------------------- | --------------------- | --------------------------------- |
| 実行環境           | Node                      | ブラウザ（テストは Node） | ブラウザ              | ブラウザ（Node にすることも可能） |
| 忠実さ             | ❌ 低い                   | ✅ 高い                   | ✅ 高い               | ✅ 高い                           |
| 実行速度           | 🐇 速い                   | 🐢 遅い                   | 🐢 遅い               | 🐢 遅い                           |
| モジュールモック   | ✅ `jest.mock`, `vi.mock` | ❌ 不可                   | ✅ `vi.mock`          | ⚠️ 可能だがやや扱いづらい         |
| モック関数         | ✅ `jest.fn`, `vi.fn`     | ❌ 不可                   | ✅ `vi.fn`            | ✅ `fn` (`storybook/test`)        |
| ネットワークモック | ✅ MSW                    | ✅ MSW                    | ✅ MSW                | ✅ MSW（アドオン）                |
| 見た目の確認       | ❌ 表示が見れない         | ✅ ブラウザで表示可能     | ✅ ブラウザで表示可能 | ✅ ブラウザで表示可能             |

## jsdom (or happy-dom) + Jest, Vitest + Testing Library

メジャーな方法で、ウェブ上の資料も多い。
Node 環境上で擬似的に DOM を描画する手法。

https://jestjs.io/ja/docs/tutorial-jquery

https://testing-library.com/


**メリット**

- ブラウザを動かさないため、動作が早い
- ウェブ上の資料が充実している

**デメリット**

- Node で動作させる関係上、**「ブラウザでは動くのに、テストでは動かない」** といったケースが多く発生する。
  - 動かすために多くのモックが必要になりがち。`matchMedia`, `ResizeObserver` などのブラウザ上の関数がないためにいちいちモックしなきゃいけないのが面倒。
  - 個人的にはこのデメリットが大きいため、選択肢から外れている。

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

#### 見た目の確認

Node 上で動いているので、見た目を確認することはできない。
特にテストが失敗したときに、どういう状態で失敗したのかがわかりにくい。

[Jest Preview](https://www.jest-preview.com/)、[Vitest Preview](https://www.vitest-preview.com/) というツールが存在しているようですが、最終更新が 2022 年でメンテが止まっているため、積極的な採用は避けたいです。

参考記事: https://azukiazusa.dev/blog/jest-preview/

### Storybook との連携

各フレームワークで提供されている `composeStories` 関数を使用して、`*.stories.tsx` で定義したストーリーをテストコードに利用できます。

https://storybook.js.org/docs/writing-tests/integrations/stories-in-unit-tests

<!-- jest の場合、DB アクセスする箇所をモックしたりするとき、Storybook にも jest にもモックを追加する必要があって面倒  -->



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
  - （もし方法があれば教えてください）

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

全体共通で設定するものは `playwright/index.html` に記述します。
テスト単位でオプションを使うこともできるようです。

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

モジュールモックをしたいケースは多いため、個人的には採用が難しい。

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

`router` を介してネットワークモックを行うことができる。

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


msw によるネットワークのモックは可能だが、呼び出しの検証は手間です。
[モック関数を使った手法](https://zenn.dev/takepepe/articles/jest-msw-mocking) が使えません。

#### 見た目の確認

[VSCode の Playwright 拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)を使うと、テスト実行時のコンポーネント描画を確認できます。

![](/images/component-testing/2025-06-08-17-12-17.png)

![](/images/component-testing/2025-06-08-17-14-01.png)

要素取得のコードにカーソルを合わせると、該当する要素がハイライトされます。
![](/images/component-testing/2025-06-08-17-18-36.png)


#### ウォッチモード

`--ui` オプションを付けて実行してUIを起動することで、ウォッチモードを有効にできます。

https://playwright.dev/docs/test-ui-mode#watch-mode


### Storybook との連携

Portable stories API により Storybook のストーリーをテストコードに利用できるそうです（実際に試したわけではないので詳細不明）。
Playwright 独自の test 関数を使用する代わりに、Storybook の特別な createTest 関数を使う。

https://storybook.js.org/docs/api/portable-stories/portable-stories-playwright


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

#### モック関数

Vitest の `vi.fn` を使用してモックを行うことができます。

#### ネットワークモック

MSW でネットワークモックを行うことができます。
Vitest Browser Mode での使用方法は、MSW のドキュメントに記載されています。

https://mswjs.io/docs/recipes/vitest-browser-mode/


#### テストの UI

ブラウザ上で表示できます。
（コンポーネントは iframe 内で描画されます。

#### グローバル設定

Storybook における `.storybook/preview.tsx` や Playwright Component Test における `playwright/index.tsx` のようなグローバル設定はなさそう？

やるとしたら、`render` をラップしてエクスポートするしかないかも。

```tsx
import { render as originalRender } from "vitest-browser-react";
import { ChakraProvider } from '@chakra-ui/react';

export const render = (component: React.ReactElement) => {
  return originalRender(<ChakraProvider>{component}</ChakraProvider>);
};
```

### Storybook との連携

Portable stories API を使うことで、Storybook のストーリーをテストコードに利用できます。

https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest


### Playwright Component Test と Vitest Browser Mode の違い

Playwright の Issue 内に説明しているコメントがありました。

https://github.com/microsoft/playwright/issues/34819

Vitest Browser Mode ではテストコードも含めてブラウザ上で実行されているため、以下のように window オブジェクトを参照することができます。
一方で、Playwright Component Test ではテストコードは Node 上で実行されているため、window オブジェクトを参照することはできずエラーになります。

```tsx
// Vitest Browser Mode では window オブジェクトを参照できる
// Playwright Component Test では window オブジェクトは存在せずエラーになる
expect(window.scrollY).toBe(0);
```

## Storybook `play` function

見た目の確認に使える Storybook ですが、インタラクションテストを書くことが可能です。

https://storybook.js.org/docs/writing-stories/play-function


### コード例

[ドキュメント](https://storybook.js.org/docs/writing-stories/play-function#writing-stories-with-the-play-function) から引用。

```tsx
// Replace your-framework with the framework you are using, e.g. react-vite, nextjs, vue3-vite, etc.
import type { Meta, StoryObj } from "@storybook/your-framework";

import { RegistrationForm } from "./RegistrationForm";

const meta: Meta<typeof RegistrationForm> = {
  component: RegistrationForm,
};
export default meta;

type Story = StoryObj<typeof RegistrationForm>;

/*
 * See https://storybook.js.org/docs/writing-stories/play-function#working-with-the-canvas
 * to learn more about using the canvas to query the DOM
 */
export const FilledForm: Story = {
  play: async ({ canvas, userEvent }) => {
    const emailInput = canvas.getByLabelText("email", {
      selector: "input",
    });

    await userEvent.type(emailInput, "example-email@email.com", {
      delay: 100,
    });

    const passwordInput = canvas.getByLabelText("password", {
      selector: "input",
    });

    await userEvent.type(passwordInput, "ExamplePassword", {
      delay: 100,
    });

    const submitButton = canvas.getByRole("button");
    await userEvent.click(submitButton);
  },
};
```

### できること・できないこと

#### モジュールモック

Node の　Subpath imports の機能を使ったモックがドキュメントで説明されています。

https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-modules

しかし、あらかじめファイルを定義しておく必要があったり、インポートパスの制限があるなどなかなか面倒です。

公式の方法ではありませんが、`storybook-addon-module-mock` を使用するのが便利です。

https://storybook.js.org/addons/storybook-addon-module-mock

#### モック関数

`@storybook/test` から提供される `fn` を使用することで、モック関数を使用できます。

#### ネットワークモック

MSW アドオンでネットワークモックを行うことができます。

https://storybook.js.org/docs/writing-stories/mocking-data-and-modules/mocking-network-requests#set-up-the-msw-addon

#### 見た目の確認

Storybook のローカルサーバーで対象コンポーネントを開いたときに自動で実行され、テスト内容は Interactions タブに表示されます。

![](/images/component-testing/2025-06-09-02-32-46.png)


### CI での実行方法

CI での実行法にはいくつかの手段があります。

https://storybook.js.org/docs/writing-tests/in-ci

#### test-runner で実行する

https://storybook.js.org/docs/writing-tests/integrations/test-runner

`@storybook/test-runner` を追加し、 `npm run test-storybook` コマンドで実行します。
ただし、最新バージョンでは後述する Vitest Addon が推奨となっているため、詳細は省略します。

#### Vitest Addon で実行する

これまで test-runner として提供されていた機能が Vitest addon に置き換えられました。

> The test runner has been superseded by the Vitest addon, which offers the same functionality, powered by the faster and more modern Vitest browser mode.
> https://storybook.js.org/docs/writing-tests/integrations/test-runner

https://storybook.js.org/docs/writing-tests/integrations/vitest-addon

`@storybook/addon-vitest` を追加し、CI 上では vitest のコマンドで実行します。


#### Chromatic で実行する

UI テストツールである Chromatic では `play` function のインタラクションテストも実行できます。
（スナップショット数によっては料金がかかることに注意）

https://www.chromatic.com/docs/interactions/

すでに VRT を実行している場合、テストを足しただけではスナップショット数が増えるわけではないので、テストを足しただけでは料金は変わらない。
VRT とテストをまとめて実行して 1 スナップショット。

Chromatic には [TurboSnap](https://www.chromatic.com/docs/turbosnap/) という機能があり、差分ファイルに基づいて影響のあるテストだけ実行されます。


## 参考リンク集


[@storybook/test を使って next/navigation をテストする](https://zenn.dev/yumemi_inc/articles/storybook-testing-next-navigation)

[[Next.js]フロントテストのコストは Storybook で削減出来る](https://zenn.dev/sora_kumo/articles/8a79531e726b29)

[Storybook のテストランナー](https://zenn.dev/makotot/articles/b0729488282148)

[Storybook をフル活用してテストを実装した話 - Cybozu Inside Out | サイボウズエンジニアのブログ](https://blog.cybozu.io/entry/2023/05/29/090000)

[Playwright Component Test に思いを馳せる - Qiita](https://qiita.com/hairihou/items/61f82636eef855af953e)

[Storybook 腐らせない](https://zenn.dev/yumemi_inc/articles/do-not-let-the-storybook-rot)

[Accessibility tests • Storybook docs](https://storybook.js.org/docs/writing-tests/accessibility-testing#automate-accessibility-tests-with-test-runner)

https://zenn.dev/innovation/articles/e10e5b5842cf29

https://developers.prtimes.jp/2025/02/21/vitest-browser-mode/

https://speakerdeck.com/rakus_fe/kokogasugoize-playwright-component-test

https://speakerdeck.com/odanado/vitest-browser-mode

https://zenn.dev/azukiazusa/articles/using-msw-to-mock-frontend-tests

https://azukiazusa.dev/blog/storybook-and-vitest-integration

https://zenn.dev/yumemi_inc/articles/storybook-8-3-vitest

https://developers.prtimes.jp/2025/02/21/vitest-browser-mode/

https://saneeeatsu.hatenablog.com/entry/2025/04/16/124656