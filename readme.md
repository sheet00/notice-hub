# WebSocket リアルタイム通知サーバー 📢✨

このプロジェクトは、WebSocketを使って、Webブラウザにリアルタイムで通知を送るためのサーバーだよ！
管理画面とかから、ユーザーにすぐお知らせしたい時にちょー便利！💖

## ✨ 主な機能

- **リアルタイム通知**: WebSocketで、サーバーからブラウザにリアルタイムでメッセージをプッシュ通知するよ！
- **一斉通知API**: `POST`リクエストを１回送るだけで、接続してる全てのブラウザに一斉に通知できる！
- **フロントエンド表示**: 受け取った通知を、サウンド付きでオシャレなカードUIに表示するよ！😎

## 🛠️ 使ってる技術

- **バックエンド**: Node.js, Express, ws
- **フロントエンド**: HTML, CSS, JavaScript (特別なフレームワークは使ってないよ！)

## 🚀 動かし方

### 1. 準備

- [Docker](https://www.docker.com/) と [Docker Compose](https://docs.docker.com/compose/) をインストールしといてね！

### 2. 起動

リポジトリをクローンしたら、下のコマンドを叩くだけで、一発でサーバーが起動するよ！

```bash
docker-compose up -d --build
```

コンソールに「Container websocket-notice-server Started」みたいに表示されたら成功！🎉

### 3. 終了

サーバーを止めたい時は、このコマンドを使ってね！

```bash
docker-compose down
```

## 使い方

1. まず、ブラウザで `http://localhost:3000` を開いてね！「接続完了！」って表示されるはず！

2. 次に、ターミナルとかから、下の`curl`コマンドを実行してみて！

```bash
curl -X POST -H "Content-Type: application/json" -d '{"message":"こんちわー！✨"}' http://localhost:3000/notice
```

3. ブラウザの画面に、通知カードが「ポコン！」って表示されたら成功だよ！やったね！🥳

## 🔧 Claude Code Hook 設定方法

このプロジェクトは Claude Code の Hook 機能と連携して、作業完了時に自動で通知を送信するよ！😊

### Hook 設定ファイルの場所

Hook 設定は `~/.claude/settings.json` ファイルで管理されてるよ！
（`~` は、あなたのホームディレクトリを表すよ！）

### 設定内容

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST -H 'Content-type: application/json' -d '{\"message\":\"Claude作業完了！✨\"}' http://localhost:3000/notice"
          }
        ]
      }
    ]
  }
}
```

### Hook の種類

- **Stop**: Claude の作業が完了した時に実行される
- **PostToolUse**: ツール実行完了時に実行される（オプション）

### 使い方

1. まず、このサーバーを起動しておく：
   ```bash
   docker-compose up -d --build
   ```

2. ブラウザで `http://localhost:3000` を開いて準備完了！

3. Claude Code で作業すると、作業完了時に自動でブラウザに通知が表示されるよ！

### 設定確認方法

Hook が正しく設定されているか確認したい場合は、Claude Code で以下のコマンドを実行してね！

```
/hooks
```

このコマンドで、現在設定されている Hook の一覧を表示できるよ！

これで、Claude が作業を終えるたびに、リアルタイムで通知を受け取れるようになるよ！✨

### 参考ドキュメント

Hook 機能についてもっと詳しく知りたい場合は、公式ドキュメントをチェックしてね！

📚 [Claude Code Hooks - 公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/hooks)
