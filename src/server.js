
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 接続されているクライアントを管理するSet
const clients = new Set();

// WebSocket接続処理
wss.on('connection', (ws) => {
  console.log('クライアントが接続したよ！🎉');
  clients.add(ws);

  ws.on('close', () => {
    console.log('クライアントが切断したよ😢');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocketでエラー発生！😱:', error);
    clients.delete(ws);
  });
});

// publicフォルダの中の静的ファイルを配信する
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // POSTリクエストのbodyをJSONとしてパースするため

// 通知用のAPIエンドポイント
app.post('/notice', (req, res) => {
  const message = req.body.message || 'お仕事おわったよー！🎉';
  console.log(`通知メッセージを受信したよ: "${message}"`);

  // 接続している全てのクライアントにメッセージを送信
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ message }));
    }
  });

  res.status(200).send({ status: 'ok', message: '通知を送ったよん！💌' });
});

// ルートURLにアクセスがあったらindex.htmlを返す
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`サーバーが起動したよ！🚀`);
});
