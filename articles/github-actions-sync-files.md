---
title: "【GitHub】他のリポジトリの変更を持ってきてPR出してくれるワークフローを作って、ファイルを同期する（差分反映）"
emoji: "🔄"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["github", "githubactions"]
published: false
---

## 想定状況とやりたいこと

- GitHub で複数のリポジトリを管理している
- それぞれのリポジトリに同じ内容のファイルを配置している
  - 例： リンターの設定ファイル (`.eslintrc`, `.stylelintrc`)、GitHub Actions のワークフローファイル(`.github/workflows/*.yaml` )、ドキュメント(`README.md`)…
- いずれかのリポジトリでファイルを更新したら、他のリポジトリでも同じように更新したい
- しかし、全く同じではなく、多少の差分を許したい

## 参考にした情報

既存の GitHub Action でも同様のことができるものがあります。

https://studist.tech/repo-file-sync-4fea6750294b

https://zenn.dev/tak_iwamoto/articles/c4e8677f2a50af

https://blog.wadackel.me/2023/files-sync-action/

https://github.com/BetaHuhn/repo-file-sync-action

https://github.com/adrianjost/files-sync-action

中でも、スタディストさんが作成された https://github.com/marketplace/actions/repo-file-sync をベースにしています。

全く同じ内容で上書きするのではなく、差分のみ反映したいということから、独自にワークフローを作成しました。

[スタディストさんの記事でも書かれている](https://studist.tech/repo-file-sync-4fea6750294b) ように、依存はコピー先リポジトリに持たせたい

- だって、JS のファイルでも import は持ってくる側に書きますし
- 即時性が必要ない

## 準備

### GitHub App を作成

<https://github.com/organizations/{org}/settings/apps>（個人の場合は <https://github.com/settings/apps>）から GitHub App を作成します。

**GitHub App name**: アプリの名前をつけます。このアプリでプルリクエストを作成する際に、ユーザー名部分に表示されます。プライベートなアプリだとしても名前は GitHub 全体の中で一意である必要があるため、自分のユーザー名や組織名を入れておくとよいでしょう。
**Homepage URL**: なんでもいいです。
**Webhook**: Active のチェックを外します（使わないので）

**Permissions**: 以下参照

- Repository permissions
  - Actions … Read-only（前回のワークフロー実行を取得するために必要）
  - Contents … Read and Write（プッシュするために必要）
  - Metadata … Read-only（他の権限を与える際に必須になる）
  - Pull requests … Read and Write（プルリクエストを作成するために必要）
  - Workflows … Read and write（`.github/workflows` 配下のファイルを編集するために必要）
- Organization permissions
  - Members … Read-only（レビュアーにチームを指定する場合必要）

**Where can this GitHub App be installed?**: Only on this account で OK。

その他は特に触らなくていいはず。

### ID と Key を取得

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

<https://github.com/{owner}/{repo}/settings/secrets/actions> から、先ほど控えた値を格納します。

- リポジトリの環境変数 (Variables) の `FILE_SYNC_APP_ID` に App ID 
- リポジトリのシークレット (Secrets) の `FILE_SYNC_PRIVATE_KEY` に  Private key

（**Private key は絶対に公開しない**ように注意してください）

### 設定ファイルを作成

`.github/file-sync-config.yaml` として設定ファイルを作成します。
ファイルを持ってきたいリポジトリと、そこから持ってきたいファイルのパスを書きます。

```yaml:.github/file-sync-config.yaml
repos:
  - owner: kagankan
    repo: sync-test-b
    paths:
      - README.md
      # コメントテスト
      - .eslintrc
      - test/*.md
      - .github/workflows/test.yaml
      - .github/workflows/test.yml
  
  - owner: kagankan
    repo: sync-test-c
    paths:
      - README.md

reviewer: kagankan
```

### ワークフローファイルを作成

`.github/workflows/file-sync.yaml` のワークフローファイルを作成します。
※ワークフロー内でファイル名を参照しているため、ファイル名は変更しないでください。
※ `main` ブランチの前提で書いています。
※ `main` ブランチへの直接のコミットはなく、PR によるマージのみを想定しています。

手動実行またはスケジュール実行としています。
プライベートリポジトリの場合、billable time が加算されるため、実行回数が多くならないよう注意してください。

```yaml:.github/workflows/file-sync.yaml
name: File Sync

on:
  workflow_dispatch: 
  schedule:
    - cron: "0 0 * * MON,THU" # 月・木 9:00 JST

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Generate token
        id: generate_token
        uses: actions/create-github-app-token@v1
        with:
          app-id: ${{ vars.FILE_SYNC_APP_ID }}
          private-key: ${{ secrets.FILE_SYNC_PRIVATE_KEY }}
          owner: ${{ github.repository_owner }}
      - uses: actions/checkout@v4
        with:
          token: ${{ steps.generate_token.outputs.token }}
      - name: 前回の同期時刻を取得
        id: get_previous_run
        uses: actions/github-script@v7
        with:
          github-token: ${{ steps.generate_token.outputs.token }}
          script: |
            const { data: runs } = await github.rest.actions.listWorkflowRuns({
              owner: context.repo.owner,
              repo: context.repo.repo,
              workflow_id: "file-sync.yaml",
              per_page: 2,
            });
            console.log(runs);
            const previousRun = runs.workflow_runs[1];
            if (!previousRun) {
              return '';
            }
            return previousRun.run_started_at;
      - name: 設定ファイルを読み込み
        id: load_config
        run: |
          config_json=$(cat .github/file-sync-config.yaml | yq -o json '.')
          echo $config_json
          {
            echo 'config<<EOF'
            echo $config_json
            echo EOF
          } >> "$GITHUB_OUTPUT"
      - name: ファイル反映
        env:
          # ghコマンドを使うために必要
          GITHUB_TOKEN: ${{ steps.generate_token.outputs.token }}
          CONFIG: ${{ steps.load_config.outputs.config }}
        run: |
          git config user.name "file-sync [bot]"
          git config user.email "<email@example.com>"

          previous_run="${{ steps.get_previous_run.outputs.result }}"
          echo "previous_run: $previous_run"
          # previous_runが空の場合は初回
          [ -z "$previous_run" ] && initial_run=true || initial_run=false

          workspace_dir=$(pwd)
          reviewer=$(echo "$CONFIG" | jq -c '.reviewer')

          # 対象リポジトリごとにループ
          repos=$(echo "$CONFIG" | jq -c '.repos[]')
          for entry in $repos; do
            owner=$(echo "$entry" | jq -r '.owner')
            repo=$(echo "$entry" | jq -r '.repo')
            paths=$(echo "$entry" | jq -r '.paths[]' | sed 's/\n/ /g')
            branch_tmp="file-sync/$repo-${{ github.run_id }}-tmp"
            branch_new="file-sync/$repo-${{ github.run_id }}"
            repo_full="$owner/$repo"
            tmp_dir="tmp"

            echo "========================================"
            echo "$repo_full の反映"
            echo "========================================"

            # クローン
            git clone --filter=blob:none --no-checkout --sparse --depth 0 https://x-access-token:${{ steps.generate_token.outputs.token }}@github.com/$repo_full.git $tmp_dir
            
            pushd $tmp_dir

            # コミット履歴からマージされたプルリクエストを取得
            merge_logs=$(git log --sparse --merges --first-parent --since "$previous_run" --oneline --pretty=format:'%s' -- $paths)
            
            # 取り込む変更がない場合は何もしない
            if [ -z "$merge_logs" ] && [ $initial_run = false ]; then
              echo "反映する変更がありません"
              popd
              rm -rf $tmp_dir
              continue
            fi

            # sparse-checkoutを設定
            git config core.sparseCheckout true
            git sparse-checkout set --no-cone $paths
            git checkout

            # 作業ブランチを作成
            popd
            git checkout -b $branch_tmp origin/main  
            
            # 初回は丸ごとコピーするので、前回時点のファイルを反映しない
            if [ $initial_run = false ]; then
              # 前回時点のファイルを反映
              pushd $tmp_dir
              previous_commit=$(git rev-list -1 --before="${{ steps.get_previous_run.outputs.result }}" main)
              echo "previous_commit: $previous_commit"
              git -c advice.detachedHead=false checkout $previous_commit
              popd
              rm -rf $paths
              rsync $tmp_dir/ . -r --exclude '.git/'

              # コミット作成
              git add . ":!$tmp_dir"
              git commit -m "$repo の前回時点を反映" || echo "No changes to commit"
            fi

            # 追加分のファイル同期
            pushd $tmp_dir
            git checkout origin/main
            popd
            rm -rf $paths
            rsync $tmp_dir/ . -r --exclude '.git/'

            # コミット作成
            git add . ":!$tmp_dir"
            git commit -m "$repo の変更を反映" || echo "No changes to commit"

            commit_hash=$(git rev-parse HEAD)
            git checkout -b $branch_new origin/main  
            rm -rf $tmp_dir

            conflict=false
            # コンフリクトしたときと、何も差分がないときにエラーになる
            git cherry-pick $commit_hash || {
              git_status=$(git status -s)
              [ -z "$git_status" ] && {
                echo "差分がありません"
                git cherry-pick --skip
                continue
              }

              conflict=true
              echo "コンフリクトしました"
              git checkout --theirs .
              git add . ":!$tmp_dir"
              git cherry-pick --continue
              git push origin $branch_tmp
            }
            git push origin $branch_new

            # マージされたプルリクエストを整形
            merged_pulls=$(echo $merge_logs | grep -o '#[0-9]\+' | sed "s|^|$repo_full|")

            # プルリクエストを作成
            echo "Creating pull request"
            gh pr create \
            -B main -H $branch_new \
            --reviewer $reviewer \
            --title "$repo 取り込み $($conflict && echo '（コンフリクト）' || echo '')" \
            --body "$($conflict && echo "反映中にコンフリクトが発生しました。
            
          - 上書きする場合：このままマージしてください。
          - 手動で修正する場合：このPRはクローズし、新しいブランチで \`git cherry-pick $commit_hash\` を実行してPRを作成してください。
          - 反映する必要がない場合：クローズしてください。" || echo '自動生成の取り込みです。マージするかクローズしてください。')

          ## 関連PR
          $($initial_run && echo '初回反映です' || echo "$merged_pulls")"

          done
```

詳しい解説コメントつきのバージョンを書いておきます

:::details

```yaml
# .github/workflows/file-sync.yaml
name: File Sync

# 実行方法
on:
  # 手動実行
  workflow_dispatch: 
  # スケジュール実行
  schedule:
    - cron: "0 0 * * MON,THU" # 月・木 9:00 JST

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      # GitHub App トークン生成
      # 公式の `actions/create-github-app-token` を使います。
      # これまでは `tibdex/github-app-token` が使われることが多く、それを紹介している記事も多いですが、
      # 公式のものが使えるようになったので、こちらが推奨です。
      - name: Generate token
        id: generate_token
        uses: actions/create-github-app-token@v1
        with:
          app-id: ${{ vars.FILE_SYNC_APP_ID }}
          private-key: ${{ secrets.FILE_SYNC_PRIVATE_KEY }}
          # actions/create-github-app-token では、owner を指定しない場合、ワークフローを実行したリポジトリのみにスコープが制限されます。
          # 他のリポジトリにアクセスするためには、owner を指定する必要があります。
          owner: ${{ github.repository_owner }}
      - uses: actions/checkout@v4
        with:
          # ここに権限を与えないと、workflowsの書き換え（push）ができません
          token: ${{ steps.generate_token.outputs.token }}
      - name: 前回の同期時刻を取得
        id: get_previous_run
        uses: actions/github-script@v7
        with:
          github-token: ${{ steps.generate_token.outputs.token }}
          # ワークフローの実行履歴を取得して、前回の実行時刻を取得します。
          # ファイル名を変更する場合は、ここも変更する必要があります。
          # （ファイル名がコンテキストから取得できそうなものですが、取得できないようです）
          script: |
            const { data: runs } = await github.rest.actions.listWorkflowRuns({
              owner: context.repo.owner,
              repo: context.repo.repo,
              workflow_id: "file-sync.yaml",
              per_page: 2,
            });
            console.log(runs);
            const previousRun = runs.workflow_runs[1];
            if (!previousRun) {
              // 初回の場合は空文字を返す
              return '';
            }
            return previousRun.run_started_at;
      - name: 設定ファイルを読み込み
        id: load_config
        # 設定ファイルを読み込んでJSON形式に変換した上で、出力に追加します。
        # YAMLファイルとして別ファイルにしているのは、コメントを書きたかったためです。
        run: |
          config_json=$(cat .github/file-sync-config.yaml | yq -o json '.')
          echo $config_json
          {
            echo 'config<<EOF'
            echo $config_json
            echo EOF
          } >> "$GITHUB_OUTPUT"
      - name: ファイル反映
        env:
          # ghコマンドを使うために必要
          GITHUB_TOKEN: ${{ steps.generate_token.outputs.token }}
          CONFIG: ${{ steps.load_config.outputs.config }}
        run: |
          # コミットに使われるユーザー名とメールアドレスを設定
          git config user.name "file-sync [bot]"
          git config user.email "<email@example.com>"

          previous_run="${{ steps.get_previous_run.outputs.result }}"
          echo "previous_run: $previous_run"
          # previous_runが空の場合は初回
          [ -z "$previous_run" ] && initial_run=true || initial_run=false

          workspace_dir=$(pwd)
          reviewer=$(echo "$CONFIG" | jq -c '.reviewer')

          # 対象リポジトリごとにループ
          repos=$(echo "$CONFIG" | jq -c '.repos[]')
          for entry in $repos; do
            owner=$(echo "$entry" | jq -r '.owner')
            repo=$(echo "$entry" | jq -r '.repo')
            paths=$(echo "$entry" | jq -r '.paths[]' | sed 's/\n/ /g')
            # ブランチ名を変えたい場合はここを変更
            branch_tmp="file-sync/$repo-${{ github.run_id }}-tmp"
            branch_new="file-sync/$repo-${{ github.run_id }}"
            repo_full="$owner/$repo"
            tmp_dir="tmp"

            echo "========================================"
            echo "$repo_full の反映"
            echo "========================================"

            # 対象リポジトリクローン
            # `--filter=blob:none --no-checkout --sparse` で、logのみを取得
            # もしlogが多すぎて重い場合は、`--depth 100` などで取得するコミット数を制限するとよい
            git clone --filter=blob:none --no-checkout --sparse --depth 0 https://x-access-token:${{ steps.generate_token.outputs.token }}@github.com/$repo_full.git $tmp_dir
            
            pushd $tmp_dir

            # コミット履歴からマージされたプルリクエストを取得
            # `--sparse --merges --first-parent` でmainブランチのマージコミットのみを取得
            # `--since` で前回の実行時刻からのログのみに制限
            # パスを指定することで、そのパスに変更があったコミットのみを取得
            # mainブランチはマージコミットのみを想定しているので、これにより対象ファイルが変更されたPRを取得できる
            merge_logs=$(git log --sparse --merges --first-parent --since "$previous_run" --oneline --pretty=format:'%s' -- $paths)
            
            # 取り込む変更がない場合は何もしない
            # 初回の場合は必ず変更があるとみなす
            if [ -z "$merge_logs" ] && [ $initial_run = false ]; then
              echo "反映する変更がありません"
              popd
              rm -rf $tmp_dir
              continue
            fi

            # sparse-checkoutを設定することで、指定したパスのファイルを取得
            git config core.sparseCheckout true
            git sparse-checkout set --no-cone $paths
            git checkout

            # 作業ブランチを作成
            popd
            git checkout -b $branch_tmp origin/main  
            
            # 初回は丸ごとコピーするので、前回時点のファイルを反映しない
            if [ $initial_run = false ]; then
              # 前回時点のファイルを反映
              pushd $tmp_dir
              previous_commit=$(git rev-list -1 --before="${{ steps.get_previous_run.outputs.result }}" main)
              echo "previous_commit: $previous_commit"
              git -c advice.detachedHead=false checkout $previous_commit
              popd
              rm -rf $paths # 削除ファイルを反映するために一旦削除
              rsync $tmp_dir/ . -r --exclude '.git/'

              # コミット作成
              git add . ":!$tmp_dir"
              git commit -m "$repo の前回時点を反映" || echo "No changes to commit"
            fi

            # 追加分のファイル同期
            pushd $tmp_dir
            git checkout origin/main
            popd
            rm -rf $paths # 削除ファイルを反映するために一旦削除
            rsync $tmp_dir/ . -r --exclude '.git/'

            # コミット作成
            git add . ":!$tmp_dir"
            git commit -m "$repo の変更を反映" || echo "No changes to commit"

            commit_hash=$(git rev-parse HEAD)
            git checkout -b $branch_new origin/main  
            rm -rf $tmp_dir

            conflict=false
            # cherry-pickすることで、差分のみを取り込む
            # コンフリクトしたときと、何も差分がないときにエラーになる
            git cherry-pick $commit_hash || {
              git_status=$(git status -s)
              # 差分がなければスキップ
              [ -z "$git_status" ] && {
                echo "差分がありません"
                git cherry-pick --skip
                continue
              }

              # コンフリクトしたときは上書きして続行
              conflict=true
              echo "コンフリクトしました"
              git checkout --theirs .
              git add . ":!$tmp_dir"
              git cherry-pick --continue
              git push origin $branch_tmp
            }
            git push origin $branch_new

            # マージされたプルリクエストを整形
            # repo_fullにはスラッシュが入るため、sedコマンドではスラッシュではなくパイプを使う
            merged_pulls=$(echo $merge_logs | grep -o '#[0-9]\+' | sed "s|^|$repo_full|")

            # プルリクエストを作成
            # コンフリクトしたときとそうでないときでメッセージを変える
            echo "Creating pull request"
            gh pr create \
            -B main -H $branch_new \
            --reviewer $reviewer \
            --title "$repo 取り込み $($conflict && echo '（コンフリクト）' || echo '')" \
            --body "$($conflict && echo "反映中にコンフリクトが発生しました。
            
          - 上書きする場合：このままマージしてください。
          - 手動で修正する場合：このPRはクローズし、新しいブランチで \`git cherry-pick $commit_hash\` を実行してPRを作成してください。
          - 反映する必要がない場合：クローズしてください。" || echo '自動生成の取り込みです。マージするかクローズしてください。')

          ## 関連PR
          $($initial_run && echo '初回反映です' || echo "$merged_pulls")"

          done
```

:::

## 実行する

ワークフローが実行されると、前回の実行時点から現在時刻までの、対象ブランチでの差分をコミットして PR を作成してくれます。
実行すると以下のようにブランチが作成されます。
（`*-tmp` の方はコンフリクトしたときのみプッシュされます）

![](/images/github-actions-sync-files/2024-04-23-01-32-01.png)

`file-sync/{repo}-*` の PR が作成されます。
PR：

![](/images/github-actions-sync-files/2024-04-23-01-59-22.png)

コンフリクトしたとき

![](/images/github-actions-sync-files/2024-04-23-01-57-20.png)

## その他補足

- 本当はすべてをシェルスクリプトで書くつもりはなく、例えばリポジトリのクローンは  `actions/checkout` を使うなどしたかったのですが、そうしようとする場合、 `matrix` で複数のリポジトリを設定する必要があります。しかし、 `matrix` で回すと billable time が個別に計算されてしまいます。例えば対象リポジトリを 2 つにすると、1 リポジトリに対する処理が 10 秒で終わるとしても、billable time が 2 分になってしまいます。これを避けたかったため、やむなくシェルスクリプト内でループを回すことにしました。
- Personal Access Token (PAT) ではなく、 GitHub App を使うことで、リポジトリの管理にできます・
- GitHub App のトークン生成には `tibdex/github-app-token` がよく使われていましたが、公式の `actions/create-github-app-token` が使えるようになったので、こちらを使うとよいです。
- 設定ファイルは同じファイル内に書いてもよかったのですが、YAML ファイルにすることでコメントを書けるようにしました。
