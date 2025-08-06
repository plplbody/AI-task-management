# DICTIONARY.md (用語集)

このドキュメントは、`@frontend`および`@backend`のソースコードで使用されるメソッド、関数、コンポーネントについて、初心者にも分かりやすく具体例を交えて説明します。

---

## バックエンド (`@backend/server.js`)

バックエンドは、フロントエンドからのリクエストに応じて、データベースとやり取りをしたり、データ処理を行ったりするサーバー側のプログラムです。

### 依存関係 (Dependencies)

このプロジェクトが動作するために必要な、外部のライブラリ（部品）のことです。

- **`express`**: Node.jsでWebサーバーを簡単に構築するためのフレームワークです。APIの土台として機能します。

  **使用例 (`server.js`):**
  ```javascript
  const express = require('express');
  const app = express(); // expressアプリを作成

  // '/api/tasks' というURLにGETリクエストが来たら、タスク一覧を返す
  app.get('/api/tasks', (req, res) => {
    // ...データベースからタスクを取得する処理...
    res.json(tasks); // JSON形式でレスポンスを返す
  });
  ```

- **`pg`**: Node.jsからPostgreSQLデータベースに接続し、データの読み書き（クエリ）を行うためのライブラリです。

  **使用例 (`server.js`):**
  ```javascript
  const { Pool } = require('pg');
  const pool = new Pool({ // データベース接続情報を設定
    connectionString: process.env.DATABASE_URL,
  });

  // 'SELECT * FROM tasks' というSQLクエリを実行して、全タスクを取得
  const result = await pool.query('SELECT * FROM tasks');
  ```

- **`cors`**: フロントエンドとバックエンドが異なるドメイン（この場合は`localhost:5173`と`localhost:3001`）で動作している場合に、ブラウザのセキュリティ制限（CORSポリシー）を回避し、通信を許可するためのミドルウェアです。

  **使用例 (`server.js`):**
  ```javascript
  const cors = require('cors');
  app.use(cors()); // これでCORSが有効になる
  ```

- **`uuid`**: 世界中で一意（ユニーク）なID（識別子）を生成するためのライブラリです。タスクIDなど、重複してはいけないIDの作成に使用します。

  **使用例:**
  ```javascript
  const { v4: uuidv4 } = require('uuid');
  const newId = uuidv4(); // 例: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed' のようなIDが生成される
  ```

### APIエンドポイント (API Endpoints)

フロントエンドがバックエンドと通信するための窓口（URL）です。

- **`GET /api/tasks`**: 全てのタスクを取得します。
  - **レスポンスの例:**
    ```json
    [
      { "id": "task-1", "title": "デザインを作成する", "status": "Done" },
      { "id": "task-2", "title": "コーディングする", "status": "In Progress" }
    ]
    ```

- **`POST /api/tasks`**: 新しいタスクを1件作成します。
  - **レスポンスの例 (作成されたタスク):**
    ```json
    { "id": "task-3", "title": "New Task", "status": "Todo" }
    ```

- **`PUT /api/tasks/:id`**: 指定したIDのタスクを更新します。`:id`の部分には実際のタスクIDが入ります (例: `/api/tasks/task-2`)。
  - **リクエストボディの例 (更新内容):**
    ```json
    {
      "title": "フロントエンドのコーディングをする",
      "status": "In Progress"
    }
    ```

- **`POST /api/tasks/delete`**: 複数のタスクをまとめて削除します。
  - **リクエストボディの例 (削除したいタスクIDの配列):**
    ```json
    {
      "ids": ["task-1", "task-3"]
    }
    ```

- **`GET /api/headers`**: テーブルのヘッダー情報を全て取得します。
- **`PUT /api/headers/:id`**: 指定したIDのヘッダー情報を更新します。

### 関数 (Functions)

- **`app.listen(port, callback)`**: Expressサーバーを指定したポート番号で起動し、リクエストの待ち受けを開始します。
  **使用例 (`server.js`):**
  ```javascript
  const port = 3001;
  app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
  });
  ```

---

## フロントエンド (`@frontend/src`)

フロントエンドは、ユーザーがブラウザで直接見て操作する部分（UI）です。

### 依存関係 (Dependencies)

- **`react`**: UIをコンポーネントという部品の組み合わせで構築していくためのライブラリです。
- **`react-dom`**: Reactで作成したコンポーネントを、実際のWebページ（HTML）に描画するために使います。
- **`styled-components`**: CSSをJavaScript内に直接記述して、コンポーネントにスタイルを適用するためのライブラリです。

  **使用例:**
  ```javascript
  import styled from 'styled-components';

  // 'Button'という名前の、スタイルが適用されたボタンコンポーネントを作成
  const Button = styled.button`
    background-color: #70AD47; /* 緑色 */
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
  `;
  ```

### コンポーネント (Components)

UIを構成する再利用可能な部品です。

- **`App.tsx`**: アプリケーション全体の親となるコンポーネント。タスクやヘッダーの全データを持ち、APIとの通信などを担当します。
- **`TaskList.tsx`**: タスクの一覧をテーブル形式で表示するコンポーネント。`App`コンポーネントからタスクデータを受け取り、`TaskItem`コンポーネントを使って各タスクを行として表示します。
- **`TaskItem.tsx`**: テーブルの中の1行（1つのタスク）を表すコンポーネント。入力フォームを持ち、タスク内容の編集ができます。

### 関数 (Functions)

- **`useState(initialState)`**: コンポーネント内で状態（変化するデータ）を管理するためのReactの機能（フック）です。
  - `const [状態変数, 状態を更新する関数] = useState(初期値);`
  **使用例 (`App.tsx`):**
  ```javascript
  const [tasks, setTasks] = useState([]); // tasksという状態を空の配列で初期化
  // APIから取得したデータを setTasks(newTasks) のようにして更新する
  ```

- **`useEffect(setup, dependencies)`**: 特定のデータが変更された時など、特定のタイミングで処理を実行するためのReactフックです。APIからのデータ取得や、イベントの監視などに使われます。
  **使用例 (`App.tsx`):**
  ```javascript
  useEffect(() => {
    // この中身は、コンポーネントが最初に表示された時に1回だけ実行される
    fetchData(); // APIからデータを取得する関数を呼び出す
  }, []); // 第2引数の配列が空なので、最初の一度しか実行されない
  ```

- **`useCallback(callback, dependencies)`**: 関数の再生成を抑制し、パフォーマンスを最適化するためのReactフックです。子コンポーネントに渡す関数などに使います。

- **`fetch(url, options)`**: バックエンドAPIと通信（HTTPリクエスト）を行うための、ブラウザに標準で備わっている機能です。
  **使用例 (`App.tsx`):**
  ```javascript
  // タスクを更新するリクエスト
  const response = await fetch(`http://localhost:3001/api/tasks/${updatedTask.id}`, {
    method: 'PUT', // 更新なのでPUTメソッドを指定
    headers: { 'Content-Type': 'application/json' }, // データ形式はJSON
    body: JSON.stringify(updatedTask), // 更新するタスクデータをJSON文字列にして送信
  });
  ```

- **`JSON.stringify(value)`**: JavaScriptのオブジェクトを、API通信で使えるJSON形式の文字列に変換します。
  **使用例:**
  ```javascript
  const task = { id: "task-1", title: "コーディング" };
  const jsonString = JSON.stringify(task); // '{"id":"task-1","title":"コーディング"}' という文字列になる
  ```

- **`response.json()`**: `fetch`で受け取ったレスポンス（JSON形式の文字列）を、JavaScriptで扱えるオブジェクトに変換します。
  **使用例 (`App.tsx`):**
  ```javascript
  const tasksResponse = await fetch('http://localhost:3001/api/tasks');
  const tasksData = await tasksResponse.json(); // JSON文字列をJavaScriptの配列に変換
  ```

### 型定義 (`types.ts`)

TypeScriptで使われる、データの「型」（形状）を定義するファイルです。これにより、予期せぬデータ型によるエラーを防ぎます。

- **`Task`**: タスクオブジェクトが持つべきプロパティとそのデータ型を定義します。
  **定義 (`types.ts`):**
  ```typescript
  export interface Task {
    id: string;
    title: string;
    status: 'Todo' | 'In Progress' | 'Done';
    assignee?: string; // '?'は、このプロパティがなくても良いことを示す
  }
  ```
  **実際のデータ例:**
  ```json
  {
    "id": "task-123",
    "title": "ドキュメントを書く",
    "status": "Todo",
    "assignee": "Alice"
  }
  ```

- **`Header`**: テーブルヘッダーオブジェクトが持つべきプロパティとそのデータ型を定義します。
  **定義 (`types.ts`):**
  ```typescript
  export interface Header {
    id: number;
    column_key: string;
    label: string;
  }
  ```
  **実際のデータ例:**
  ```json
  {
    "id": 1,
    "column_key": "title",
    "label": "Task Name"
  }
  ```
