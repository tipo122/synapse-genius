# Synapse X Genius

Synapse X Genius のプロトタイプのためのレポジトリです。

## セットアップ方法

以下の手順でアプリケーションをセットアップします。

1. **プロジェクトのクローンを作成します：**

   ```bash
   git clone git@github.com:tipo122/synapse-genius.git
   cd synapse-genius
   ```

1. **依存関係をインストールします：**

   ```bash
   yarn install
   ```

1. **環境変数を設定します：**

   プロジェクトのルートに`.env.local`ファイルを作成し、Firebase の設定を含む環境変数を記述します。

   ```
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   ...
   ```

1. **開発サーバーを起動します：**

   ```bash
   yarn start
   ```

   これでアプリケーションは`localhost:3000`で動作します。

## ビルド方法

以下のコマンドを実行すると、プロジェクトのビルドが作成されます：

```bash
yarn build
```
