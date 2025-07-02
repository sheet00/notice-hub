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
curl -X POST -H "Content-Type: application/json" -d '{"message":"こんちわー！✨"}' http://localhost:3000/send-notification
```

3. ブラウザの画面に、通知カードが「ポコン！」って表示されたら成功だよ！やったね！🥳
