# ベースイメージを指定
FROM node:18-alpine

# 作業ディレクトリを設定
WORKDIR /usr/src/app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションがリッスンするポートを公開
EXPOSE 8080

# アプリケーションを起動
CMD [ "node", "server.js" ]
