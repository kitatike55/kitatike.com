# サイト更新ツール

## 普段の操作

1. Dropbox の `inbox/request.md` に日本語で変更内容を書く。
2. 次のサイトリポジトリへ移動する。

   ```sh
   cd /Users/tikekita/Dropbox/Personal/kitatike-site-updates/kitatike.com
   ```

3. `npm run update:site` を実行する。
4. Dropbox の `preview/summary.md` と `preview/proposed-site.json` を確認する。
5. 問題なければ `npm run update:site -- --apply` を実行する。
6. `git diff` で確認してから、自分で commit と push を行う。

文献一覧は従来どおり Google スプレッドシートで更新する。

## 設定

ローカルの `.env` に次の値を置く。このファイルは Git の対象外になる。

```text
OPENAI_API_KEY=...
SITE_UPDATE_DROPBOX_DIR=/Users/tikekita/Dropbox/Personal/kitatike-site-updates
```

必要な場合だけ `OPENAI_MODEL` でモデルを変更できる。

## 安全設計

- プレビューではサイトファイルを変更しない。
- 適用時も Git への commit や push は行わない。
- 外部リンクは HTTPS のみに制限する。
- スクリプトの追加は拒否する。
- 適用前のデータを Dropbox の `preview/previous-site.json` に保存する。
