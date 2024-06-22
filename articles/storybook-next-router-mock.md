---
title: "Storybook 8.1 で next/router と next/navigation のモックが扱いやすくなったよ" #を使ってテストを便利に、next-router-mock を使っちゃおう
emoji: "🙌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["storybook", "nextjs", "nextrouter", "approuter"]
published: false
publication_name: "kikagaku"
---

Storybook の Next.js 用フレームワークである `@storybook/nextjs` では[デフォルトで `next/router` や `next/navigation` がモックされて](https://storybook.js.org/blog/integrate-nextjs-and-storybook-automatically/) おり、複雑な設定なしに Next.js 用のコンポーネントを利用できます。

しかし、これらのモックはあくまで固定値の `pathname` や `query` を設定できるのみで、これらが変化したときの挙動を再現できませんでした（そんな [Discussions のスレッド](https://github.com/storybookjs/storybook/discussions/25470)もありました）。

それがなんと、**Storybook 8.1 で以下のモック用のモジュールが追加**されました！

- [`@storybook/nextjs/router.mock`](https://storybook.js.org/docs/get-started/nextjs#storybooknextjsroutermock)
- [`@storybook/nextjs/navigation.mock`](https://storybook.js.org/docs/get-started/nextjs#storybooknextjsnavigationmock)

これと、同じく 8.1 で追加された `beforeEach` 関数を活用することで、 `next/router` `next/navigation` のモック実装を自由に書き換えることができます 🎉

この記事では、`next-router-mock` を使った Storybook の設定例を示します。

## next/router (Pages Router) の場合

`beforeEach` 関数内でモックの実装を定義します。
`getRouter().push` と `getRouter().replace` のモックは、`import router from "next/router"` で利用する際に使われ、
`useRouter` のモックは、`import { useRouter } from "next/router"` で利用する際に使われます。

なお、 `import router from "next/router"` から参照する `router.pathname` と `router.query` は、値が変化しないため注意です（[参考記事](https://zenn.dev/yoshiishunichi/articles/ed67d3cf1b9b41)）。

```tsx:.storybook/preview.tsx
import type { Preview } from "@storybook/react";
import { getRouter, useRouter } from "@storybook/nextjs/router.mock";
import mockRouter, { useRouter as mockUseRouter } from "next-router-mock";

const preview: Preview = {
  beforeEach: () => {
    getRouter().push.mockImplementation(
      (...args: Parameters<typeof mockRouter.push>) => mockRouter.push(...args)
    );
    getRouter().replace.mockImplementation(
      (...args: Parameters<typeof mockRouter.replace>) =>
        mockRouter.replace(...args)
    );
    useRouter.mockImplementation(() => mockUseRouter());
  },
};

export default preview;
```

例として、クリックするとクエリパラメータを書き換えるボタンのコンポーネントを作成します（単に router を使ったコンポーネントの例であり、中身は特に重要ではありません）。

```tsx:src/components/Sample.tsx
import { useRouter } from 'next/router';

export const Sample = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        void router.push(
          `${router.pathname}?mode=${router.query.mode === 'dark' ? 'light' : 'dark'}`,
        );
      }}
    >
      Toggle
    </button>
  );
};
```

```tsx:src/components/Sample.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import mockRouter from "next-router-mock";
import { Sample } from "./Sample";

const meta: Meta<typeof Sample> = {
  component: Sample,
};
export default meta;

type Story = StoryObj<typeof Sample>;
export const Default: Story = {
  beforeEach: () => {
    // ページの URL を設定
    mockRouter.setCurrentUrl("/home");
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 初期状態の URL を検証
    await expect(mockRouter).toMatchObject({ pathname: "/home" });
    // 一度クリックしたら mode=dark になることを検証
    await userEvent.click(canvas.getByRole("button", { name: "Toggle" }));
    await expect(mockRouter).toMatchObject({ pathname: '/home', query: { mode: 'dark' } });
    // もう一度クリックしたら mode=light になることを検証
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle' }));
    await expect(mockRouter).toMatchObject({ pathname: '/home', query: { mode: 'light' } });
  },
};
```

## next/navigation (App Router) の場合

App Router の場合は `"@storybook/nextjs/navigation.mock"` を使います。

```tsx:.storybook/preview.tsx
import type { Preview } from "@storybook/react";
import {
  ReadonlyURLSearchParams,
  getRouter,
  usePathname,
  useSearchParams,
} from "@storybook/nextjs/navigation.mock";
import { useMemo } from "react";
import mockRouter from "next-router-mock";

const preview: Preview = {
  parameters: {
    nextjs: {
      // https://storybook.js.org/docs/get-started/nextjs#set-nextjsappdirectory-to-true
      appDirectory: true,
    },
  },
  beforeEach: () => {
    getRouter().push.mockImplementation(
      (...args: Parameters<typeof mockRouter.push>) => mockRouter.push(...args)
    );
    getRouter().replace.mockImplementation(
      (...args: Parameters<typeof mockRouter.replace>) =>
        mockRouter.replace(...args)
    );
    usePathname.mockImplementation(() => mockRouter.pathname);
    useSearchParams.mockImplementation(() => {
      const searchParams = useMemo(
        () =>
          new ReadonlyURLSearchParams(
            new URLSearchParams(mockRouter.query as Record<string, string>)
          ),
        [mockRouter.query]
      );
      return searchParams;
    });
  },
};

export default preview;
```

```tsx:src/app/_components/Sample.tsx
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const Sample = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <button
      onClick={() => {
        router.push(
          `${pathname}?mode=${searchParams.get("mode") === 'dark' ? 'light' : 'dark'}`,
        );
      }}
    >
      Toggle
    </button>
  );
};
```

Story ファイルの書き方は Pages Router と全く同じです。

```tsx:src/app/_components/Sample.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import mockRouter from "next-router-mock";
import { Sample } from "./Sample";

const meta: Meta<typeof Sample> = {
  component: Sample,
};
export default meta;

type Story = StoryObj<typeof Sample>;
export const Default: Story = {
  beforeEach: () => {
    // ページの URL を設定
    mockRouter.setCurrentUrl("/home");
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 初期状態の URL を検証
    await expect(mockRouter).toMatchObject({ pathname: "/home" });
    // 一度クリックしたら mode=dark になることを検証
    await userEvent.click(canvas.getByRole("button", { name: "Toggle" }));
    await expect(mockRouter).toMatchObject({ pathname: '/home', query: { mode: 'dark' } });
    // もう一度クリックしたら mode=light になることを検証
    await userEvent.click(canvas.getByRole('button', { name: 'Toggle' }));
    await expect(mockRouter).toMatchObject({ pathname: '/home', query: { mode: 'light' } });
  },
};
```

## おわりに

モック実装を定義できるようになったことで、 `play` 関数内でのテストがより柔軟にできるようになりました！
Storybook を使ったインタラクションテストがより捗りますね ☺️

## 関連記事

https://zenn.dev/yumemi_inc/articles/storybook-testing-next-navigation

https://github.com/storybookjs/storybook/discussions/25470
