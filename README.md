# mokuhyouListAPII
医院目標リストアプリで使うAPIのコード

## 環境構築
### GAS 関係
```
npm init -y
npm i @google/clasp -g --save-dev
npm install @types/google-apps-script

clasp login
```
```clasp login``` を実行すると、google の認証画面へのリンクがターミナルに表示されるので、そのリンクを開いて認証を行う。
その際、gitHub codespace などの web container 環境では「サイトにアクセスできません」画面になってしまう。その場合の解決方法は以下の zenn 記事を参照。

[devcontainer で clasp がログインできない](https://zenn.dev/st_little/articles/can-not-clasp-login-with-devcontainer)


