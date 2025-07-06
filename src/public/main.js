document.addEventListener('DOMContentLoaded', () => {
  const statusElement = document.getElementById('status');
  const statusDot = document.getElementById('status-dot');
  const notificationCountElement = document.getElementById('notification-count');
  const themeToggle = document.getElementById('theme-toggle');
  const notificationSound = new Audio('/new-notification-010-352755.mp3'); // 通知音のURL
  
  let notificationCount = 0;
  
  // テーマ切り替え機能
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    // ローカルストレージに保存
    localStorage.setItem('theme', newTheme);
  }
  
  // 保存されたテーマを読み込み
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  
  themeToggle.addEventListener('click', toggleTheme);
  
  // 通知カウンターを更新
  function updateNotificationCount() {
    notificationCount++;
    notificationCountElement.textContent = notificationCount;
  }
  
  // ステータスドットの色を更新
  function updateStatusDot(status) {
    statusDot.className = `status-dot ${status}`;
  }

  function connect() {
    // WebSocketサーバーのURLを動的に解決
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('サーバーに接続したよ！✅');
      statusElement.textContent = '接続完了！';
      updateStatusDot('connected');
    };

    ws.onmessage = (event) => {
      console.log('メッセージ受信！', event.data);
      try {
        const data = JSON.parse(event.data);
        const message = data.message || '新しい通知だよん！💌';
        const timestamp = data.timestamp || getCurrentTimestamp();
        showNotification(message);
        addMessageCard(message, timestamp);
        updateNotificationCount();
      } catch (error) {
        console.error('受信したデータのパースに失敗したよ😢', error);
        const errorMessage = 'よくわからない通知が来たよ！';
        showNotification(errorMessage);
        addMessageCard(errorMessage, getCurrentTimestamp());
        updateNotificationCount();
      }
    };

    ws.onclose = () => {
      console.log('サーバーから切断されちゃった...😢');
      statusElement.textContent = '再接続中...';
      updateStatusDot('error');
      // 5秒後に再接続を試みる
      setTimeout(connect, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocketエラー発生！😱', error);
      statusElement.textContent = 'エラー発生！';
      updateStatusDot('error');
      ws.close();
    };
  }

  function showNotification(message) {
    // ブラウザが通知に対応してるかチェック
    if (!('Notification' in window)) {
      alert('このブラウザは通知機能に対応してないみたい😢');
      return;
    }

    // 通知の許可を求める
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        const notification = new Notification('🔔 新着通知！ 🔔', {
          body: message,
          icon: 'https://i.gyazo.com/a6931b698c6862528696a42113754053.png' // かわいいアイコン
        });

        // 通知がクリックされたら音を鳴らす
        notification.onclick = () => {
            notificationSound.play().catch(e => console.error("サウンドの再生に失敗したよ: ", e));
            window.focus();
        };

        // 通知が表示されたときにも音を鳴らす
        notificationSound.play().catch(e => console.error("サウンドの再生に失敗したよ: ", e));

      } else {
        alert('通知がブロックされちゃった！許可してくれないと通知できないよー😭');
      }
    });
  }

  // 現在時刻をyyyy/mm/dd hh:mm:ss形式で取得
  function getCurrentTimestamp() {
    return moment().format('YYYY/MM/DD HH:mm:ss');
  }

  function addMessageCard(message, timestamp) {
    const messagesList = document.getElementById('messages-list');
    
    // 空の状態を非表示にする
    const emptyState = messagesList.querySelector('.empty-state');
    if (emptyState) {
      emptyState.style.display = 'none';
    }
    
    const card = document.createElement('div');
    card.className = 'message-card';

    // timestampが渡されていない場合は現在時刻を使用
    const displayTimestamp = timestamp || getCurrentTimestamp();

    card.innerHTML = `
      <p>${message}</p>
      <p class="timestamp">${displayTimestamp}</p>
    `;

    // 新しいメッセージをリストの先頭に追加
    messagesList.prepend(card);
  }

  // WebSocket接続を開始
  connect();

  // テストボタンの処理
  const testButton = document.getElementById('test-button');
  testButton.addEventListener('click', () => {
    console.log('テスト通知ボタンが押されたよ！');

    // ボタンを無効化して、テキストを変更
    testButton.disabled = true;
    testButton.textContent = '送信中... 📨';

    fetch('/notice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'これはブラウザからのテスト通知だよん！😉' }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('テスト通知リクエスト成功！🎉', data);
    })
    .catch(error => {
        console.error('テスト通知リクエスト失敗...😢', error);
    })
    .finally(() => {
        // ボタンを再度有効化して、テキストを元に戻す
        setTimeout(() => {
            testButton.disabled = false;
            testButton.textContent = '🔔 テスト通知を送る 🔔';
        }, 1000); // 1秒後にボタンを戻す（余韻）
    });
  });

  // 起動時に初期メッセージを追加
  setTimeout(() => {
    addMessageCard('🎉 Notice Hub へようこそ！', getCurrentTimestamp());
    updateNotificationCount();
  }, 500);
});