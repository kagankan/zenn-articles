---
title: "【GitHub Actions】他のリポジトリの差分を持ってきてPR出してくれるワークフローを作って、ファイルを同期する（差分反映）"
emoji: "🔄"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["github", "githubactions"]
published: false
publication_name: "kikagaku"
---

## 想定状況

- GitHub で複数のリポジトリを管理している
- 同じようなファイルを複数リポジトリで管理している
  - 例： リンターの設定ファイル、GitHub Actions のワークフローファイル、PR テンプレート…
- どちらかのリポジトリでファイルを更新したら、他方のリポジトリでも同じように更新したい
- しかし、全く同じではなく、多少の差分がある

## どんなことがするか

- 他のリポジトリの差分を持ってきて、PR を出してくれるワークフローを作成します

## 背景

（TODO: 複数のリポジトリを触る必要があって…ということを書く）

## 参考にした情報

https://studist.tech/repo-file-sync-4fea6750294b

https://zenn.dev/tak_iwamoto/articles/c4e8677f2a50af

https://blog.wadackel.me/2023/files-sync-action/

https://github.com/BetaHuhn/repo-file-sync-action

https://github.com/adrianjost/files-sync-action

中でも、スタディストさんが作成された https://github.com/marketplace/actions/repo-file-sync をベースにしています。

## 準備

### GitHub App を作成

https://github.com/organizations/{org}/settings/apps（個人の場合は https://github.com/settings/apps）から GitHub App を作成します。

GitHub App name: アプリの名前をつけます。このアプリでプルリクエストを作成する際に、ユーザー名部分に表示されます。プライベートなアプリだとしても名前は GitHub 全体の中で一意である必要があるため、自分の名前や組織名を入れておくとよいでしょう。
Homepage URL: なんでもいいです。
Webhook: Active のチェックを外します（使わないので）


Permissions: 以下参照

- Repository permissions
  - Actions … Read-only（前回のワークフロー実行を取得するために必要）
  - Contents … Read and Write（プッシュするために必要）
  - Metadata … Read-only（他の権限を与える際に必須になる）
  - Pull requests … Read and Write（プルリクエストを作成するために必要）
  - Workflows … Read and write（`.github/workflows` 配下のファイルを編集するために必要）
- Organization permissions
  - Members … Read-only（レビュアーにチームを指定する場合必要）

Where can this GitHub App be installed?: Only on this account で OK。

その他は特に触らなくていいはず。

App の作成が終わったら 

- App ID
- Private key

を控えます。
Private key は生成する必要があります( generate a private key)

### インストール

Install App から、ユーザー/組織に対してインストールします。

Repository access で、使用したいリポジトリを設定します。
（All repositories にすると、全リポジトリにアクセスできるようになります）

### 環境変数・シークレットを格納

先ほど控えた App ID と Private key を、リポジトリのシークレットに格納します。
App ID は公開されても問題ないので環境変数のほうで問題ありません。
（Private key は絶対に公開しないでください）


### ワークフローファイルを作成

`.github/workflows` 配下にワークフローファイルを作成します。
手動実行またはスケジュール実行としています。
プライベートリポジトリの場合、billable time が加算されるため、スケジュール実行の間隔は注意してください。

```yaml
TODO: 記述整理の上掲載
```


前回の実行時点から現在時刻までの、対象ブランチでの差分をコミットして PR を作成してくれます。
実行すると以下のようにブランチが作成されます。
（`*-tmp` の方はコンフリクトしたときのみプッシュされます）

![](/images/github-actions-sync-files/2024-04-23-01-32-01.png)

`file-sync/{repo}/*` の PR が作成されます。
PR：

![](/images/github-actions-sync-files/2024-04-23-01-59-22.png)

コンフリクトしたとき

![](/images/github-actions-sync-files/2024-04-23-01-57-20.png)

## その他メモ

- 本当は actions/checkout を使いたかったのですが、matrix で回すと billable time が個別に計算されてしまうため、リポジトリを 2 つにすると、1 リポジトリに対する処理が 10 秒で終わるとしても、billable time が 2 分になってしまいます。これを避けたかったため、やむなく shell script でループを回すことにしました。
- Personal Access Token (PAT) ではなく、 GitHub App を使うことで、リポジトリの管理にできます
- GitHub App のトークン生成には `tibdex/github-app-token` がよく使われていましたが、公式の `actions/create-github-app-token` が使えるようになったので、こちらを使うとよいです。
