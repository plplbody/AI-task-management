# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


## 開発環境の起動方法

このプロジェクトをローカルで実行するための手順は以下の通りです。

### 1. バックエンドとデータベースの起動

プロジェクトのルートディレクトリで、以下のコマンドを実行してDockerコンテナを起動します。

```bash
docker-compose up --build -d
```

このコマンドは、バックエンドサーバーとPostgreSQLデータベースをバックグラウンドで起動します。初回起動時や`Dockerfile`に変更があった場合は、`--build`フラグによってイメージが再構築されます。

### 2. フロントエンドの起動

次に、別のターミナルを開いてフロントエンドアプリケーションを起動します。

```bash
cd frontend
npm install
npm run dev
```

`npm install`は初回のみ、または依存関係に変更があった場合に実行してください。`npm run dev`を実行すると、開発サーバーが起動し、ブラウザでアプリケーションにアクセスできるようになります。

### 3. 環境の停止

開発環境を停止するには、プロジェクトのルートディレクトリで以下のコマンドを実行します。

```bash
docker-compose down
```

これにより、起動しているDockerコンテナが停止・削除されます。