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

1. **環境変数を設定します**

   ### 通常の方法

   .env.local ファイルを作成し、以下の内容を設定します

   ```
   OPENAI_API_KEY=
   REACT_APP_FIREBASE_APIKEY=
   REACT_APP_FIREBASE_AUTHDOMAIN=
   REACT_APP_FIREBASE_PROJECTID=
   REACT_APP_FIREBASE_STORAGEBUCKET=
   REACT_APP_FIREBASE_MESSAGINGSENDERID=
   REACT_APP_FIREBASE_APPID=
   REACT_APP_FIREBASE_MEASUREMENTID=
   ```

   ### dotenv-vault を使って取り出す方法(調整中)

   dotenv-vault を使って、.env ファイルを取得します。

   ```
   npx dotenv-vault@latest pull
   ```

   functions の.env ファイルも取得する必要があります。

   ```
   cd functions
   npx dotenv-vault@latest pull
   ```

1. **開発サーバーを起動します：**

   ```bash
   yarn start
   ```

   これでアプリケーションは`localhost:3000`で動作します。

## firebase cloud functions デプロイ方法

1. **Firebase へのログインと project の指定**

   ブラウザで許可をします。

   ```bash
   $ firebase login
   ```

   開発環境の場合:

   ```bash
   $ firebase use synapse-genius-dev-fbe11
   ```

1. **Funtions Python の環境設定**
   functions フォルダに移って、以下のコマンドを実行します

   ```bash
   $ cd functions

   $ python3 -m venv venv

   $ source ./venv/bin/activate && python3 -m pip install -r requirements.txt
   ```

1. **デプロイ**

   ```bash
   $ firebase deploy --only functions
   ```

## 開発ワークフロー

1.  ブランチ作成
    `development`ブランチから新しいブランチを作成し、`feature/<機能名>`の命名規則に従います。

    ```bash
    git checkout -b feature/xxxx development
    ```

1.  機能開発
    新しいブランチで必要な変更を行い、それをコミットします。

    ```bash
    git add .
    git commit -m "新機能 xxxx の実装"
    ```

1.  プルリクエスト作成
    ブランチをリモートリポジトリにプッシュし、development ブランチへのプルリクエストを作成します。

1.  コードレビューとマージ
    チームメイトがコードをレビューします。修正が必要な場合は、それを行い、再度プッシュします。
    承認されたら、プルリクエストを development ブランチにマージします。

    development ブランチにマージされると、開発環境にコードがデプロイされます。
    デプロイされたコードは以下の url からアクセスできます。

    https://synapse-genius-dev-fbe11.web.app/

1.  デプロイ
    準備が整ったら、development ブランチから main ブランチへのプルリクエストを作成します。適切なレビューとテストの後、このプルリクエストをマージして新機能を本番環境にデプロイします。

    https://synapse-genius.web.app/

# FireStore Collections

```ts
canvases: {
   uid: string,
   user_id: string,
   template_id: string,
   copydata: map {
      strings: array [
         strings: string,
         ...
      ]
   }
   bg_image_uid: reference,
   bg_image_prompt: string,
   collaborators: array [
      email: string,
      ...
   ]
   item_property: map {
      item_name: string,
      item_category: string,
      item_description: string,
   }
   campaign_property: map {
      campaign_name: string,
      campaign_description: string,
   }
   collaborators: array [
      {user_id: string}
      ...
   ]
   create_dt: timestamp,
   update_dt: timestamp,
}

prompts: {
   uid: string,
   user_id: string,
   prompt: PromptObject,
   messages: array [
      {role: string, message: string}
   ]
   create_dt: timestamp,
   update_dt: timestamp,
}
```

## フォルダ構成

```
src/
  |- components/ (UIの一部を構成する再利用可能な部品)
  |   |- Header/
  |   |   |- Header.tsx
  |   |   |- Header.css
  |   |
  |   |- Footer/
  |   |   |- Footer.tsx
  |   |   |- Footer.css
  |   |
  |   |- Button/
  |   |   |- Button.tsx
  |   |   |- Button.css
  |
  |- containers/ (ビジネスロジックやデータの処理など、コンポーネントよりも上位の階層に位置する要素、複数のコンポーネントをまとめる役割を果た)
  |   |- Main/
  |   |   |- TopKV/
  |   |   |   |- TopKV.tsx
  |   |   |   |- TopKV.css
  |   |   |
  |   |   |- TopFeature/
  |   |   |   |- TopFeature.tsx
  |   |   |   |- TopFeature.css
  |   |   |
  |   |   |- TopFunction/
  |   |   |   |- TopFunction.tsx
  |   |   |   |- TopFunction.css
  |   |- Container1/
  |   |   |- Container1.tsx
  |   |   |- Container1.css
  |   |- Container2/
  |   |   |- Container2.tsx
  |   |   |- Container2.css
  |
  |- hooks/
  |   |- useCustomHook1.ts
  |   |- useCustomHook2.ts
  |
  |- models/
  |   |- Model1.ts
  |   |- Model2.ts
  |
  |- pages/
  |   |- Page1/
  |   |   |- Page1.tsx
  |   |   |- Page1.css
  |   |
  |   |- Page2/
  |   |   |- Page2.tsx
  |   |   |- Page2.css
  |
  |- styles/
  |   |- variables.css (カスタムプロパティ)
  |   |- reset.css (リセットCSS)
  |   |- global.css (全体共通のスタイル)
  |   |- utils/
  |   |   |- l-container.css (コンポーネント間で共有するスタイル)
  |
  |- index.tsx
  |- index.css
  |- App.tsx
  |- App.css
```

## シーケンス図

### キャンバスの流れ

```mermaid
sequenceDiagram
   participant storage/template
   participant storage/canvasdata
   participant canvas
   participant web
   participant firestore
   participant functions
   participant ChatGPT
   participant Pinecone
   web->>functions: 商品販売URLとAD_TYPEを送る
   functions->>ChatGPT: 商品名、カテゴリ、商品詳細、商品のキャッチコピーを取得
   functions->>ChatGPT: AD_TYPEに合う文字列を取得する
   functions->>firestore: 商品情報やコピーの情報をcanvasesに書き込む
   web->>functions: 適切なテンプレートの検索指示
   functions->>Pinecone: マッチするテンプレートの問い合わせ
   functions->>web: マッチするテンプレートIDの一覧を返す
   storage/template->>functions: テンプレートの読み込み
   functions->>web: 文字列が埋め込まれたテンプレート画像を返す
   web->>firestore: ユーザに選択されたテンプレートIDをcanvasにセット
   web->>storage/canvasdata: 使用するテンプレートIDを使って<br>テンプレートをjsonデータに変換する
   web->>storage/canvasdata:すでにcanvasesに画像データがあれば、jsonデータに変換する
   web->storage/canvasdata: クリエイティブのデータの読み書きは、storageを使って行う
   firestore-->>web: onSnapshotの通知
   storage/canvasdata-->>web: onSnapshotの通知(?)
   canvas->>web: editorの更新の通知
   web->>storage/canvasdata: thumbnailとcanvasdataの保存
   

```
