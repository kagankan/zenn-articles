---
title: "Storybook 8.1 で next/router と next/navigation のモックが扱いやすくなったので next-router-mock を使っちゃおう" #を使ってテストを便利に
emoji: "🙌"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["storybook", "nextjs", "nextrouter"]
published: false
---

`@storybook/nextjs` では[デフォルトで next/router や next/navigation がモックされて](https://storybook.js.org/blog/integrate-nextjs-and-storybook-automatically/) おり、複雑な設定なしに使用できます。

しかし、これらのモックはあくまで固定値の `pathname` や `query` を設定できるのみで、これらが書き換わったときの挙動を再現できませんでした。

https://github.com/storybookjs/storybook/discussions/25470

`next-router-mock` を使おうにも、これまでは内部の実装を書き換えることが難しかったため、モックの挙動を変更することが難しかったです。
^[正確には、もしかしたら方法があったのかもしれませんが、詳しく調査する前に 8.1 のこの方法にたどり着いたのであまり詳しく調べていません]

それがなんと、Storybook 8.1 で

- [`@storybook/nextjs/router.mock`](https://storybook.js.org/docs/get-started/nextjs#storybooknextjsroutermock)
- [`@storybook/nextjs/navigation.mock`](https://storybook.js.org/docs/get-started/nextjs#storybooknextjsnavigationmock)

というモジュールが追加されています。

これと、同じく 8.1 で追加されている `beforeEach` 関数を活用することで、 `next/router` `next/navigation` のモック実装を自由に書き換えることができます。
ここに、`next-router-mock` を使った Storybook の設定例を示します。

## next/router (Pages Router) の場合

```tsx .storybook/preview.tsx
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

```tsx src/Sample.tsx
import { useRouter } from "next/router";

export const Sample = () => {
  const router = useRouter();
  const path = router.pathname;
  const currentMode = router.query.mode;

  return (
    <button
      onClick={() => {
        void router.push(
          `${path}?mode=${currentMode === "dark" ? "light" : "dark"}`
        );
      }}
    >
      Toggle
    </button>
  );
};
```

```tsx src/Sample.stories.tsx
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
    await expect(mockRouter).toMatchObject({ pathname: "/home" });
    await userEvent.click(canvas.getByRole("button", { name: "Toggle" }));
    await expect(mockRouter).toMatchObject({
      pathname: "/home",
      query: { mode: "dark" },
    });
  },
};
```

## next/navigation (App Router) の場合

```tsx .storybook/preview.tsx
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

```tsx src/app/Sample.tsx
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const Sample = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  return (
    <div>
      <h1>Sample</h1>
      <p>pathname: {pathname}</p>
      <p>searchParams: {JSON.stringify(Object.fromEntries(searchParams))}</p>
      <p>query: {JSON.stringify(router.query)}</p>
    </div>
  );
};
```

```tsx src/app/Sample.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
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
  play: async () => {
    await expect(mockRouter).toMatchObject({ asPath: "/home" });
  },
};
```

## おわりに

モックできるようになると、テストもしやすくなります。

## 関連記事

https://zenn.dev/yumemi_inc/articles/storybook-testing-next-navigation

https://github.com/storybookjs/storybook/discussions/25470
