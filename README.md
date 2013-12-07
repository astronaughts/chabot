Chabot
======

Chabot is Web-hook receiver for ChatWork.

## Chabot とは

Chabot は ChatWork と Webhook を提供しているサービスとを連携させるアプリケーションです。

WebHook で受け取ったデータを、ejs テンプレートで定義したメッセージを指定したチャットに送信することが出来ます。

### インストール

```
npm install -g chabot
```

### 使い方

インストールが完了すると `chabot` コマンドが利用できるようになります。

```bash
$ chabot -h

  Usage: chabot [options] [command]

  Commands:

    create [options] [appname] create chabot app

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

#### Chabot アプリケーションを作成する

 `chabot` アプリの作成は `chabot create` です。`-d` オプションで作成したい場所のディレクトリパスを指定します。

```bash
chabot create -h

  Usage: create [options] [appname]

  Options:

    -h, --help        output usage information
    -d, --dist [dir]  the directory to place the app in [default: CWD]
    -f, --force       overwrite existing directory
```

#### コマンドを実行してみる

実際に `chabot` アプリを作成してみましょう。

```bash
$ chabot create -d ~/ my_first_chabot
  copying files.
  completed!
   > /Users/astronaughts/chabot/my_first_chabot
```

#### 設定

設定ファイルを開いてみましょう。

```bash
$ cd ~/chabot/my_first_chabot
$ vi config.json
```

初期値として `github` というボットの設定があります。

```json 
{
    "port": 5000,
    "bots": {
        "github": {
            "token": "YOUR_TOKEN",
            "route": "/github/hooks/:roomid"
        }
    }
}
```

##### port

ポートを指定します。

##### bots

ボットの設定を指定します。複数定義可能です。

##### bot: token

ボットの発言としたいアカウントの ChatoWork API のトークンを指定します。

##### bot: route

外部サービスの WebHook の送信先として URL を指定します。
URL には `:roomid` を必ず含めるようにします。
`:roomid` はボットに発言させたいチャットの ID を指定します。

#### アプリの構造

* my_first_chabot/
    * bots/
    * templates/
    * node_modules/
    * app.js
    * config.json
    * package.json

##### bots ディレクトリ

bot の実装ファイルをここに配置します。

##### templates ディレクトリ

bot が送信するメッセージのテンプレートファイルをここに配置します。

#### ボットの実装

`chabot create` で最初にサンプルとして `bots/github.js` が配置されています。

```js
module.exports = function (chabot) {

    var endpoint = '/rooms/' + chabot.roomid + '/messages',
        template = chabot.readTemplate('github.ejs');

    chabot.client
        .post(endpoint, {
            body: chabot.render(template, chabot.data)
        })
        .done(function (res) {
            chabot.log('done');
        })
        .fail(function (err) {
            chabot.error(err);
        });
};
```

#### chabot オブジェクト

##### chabot.roomid

URL に指定されたチャットルームの ID です。

##### chabot.client

ChatWork API を操作するクライアントです。詳細は以下を参照。

[astronaughts/simple-cw-node - github](https://github.com/astronaughts/simple-cw-node)

##### chabot.data

WebHook から受け取った response です。

##### chabot.readTemplate

templates で配置したテンプレートファイルを読み込みます。

##### chabot.render

読み込んだテンプレートファイルを描画します。

#### テンプレートの作成

テンプレートは ejs が利用できます。

[visionmedia/ejs - github](https://github.com/visionmedia/ejs) 

`github` ボットのテンプレートは以下のように定義してあります。

```
プッシュのお知らせ♪
[info]<%= head_commit.message %>
[hr]変更のあったファイル：
<% if (head_commit.added.length) { %>【追加】
<% head_commit.added.forEach(function (file) { %>　<%= file %>
<% }) %><% } else { %>【追加】
　なし
<% } %><% if (head_commit.removed.length) { %>【削除】
<% head_commit.removed.forEach(function (file) { %>　<%= file %>
<% }) %><% } else { %>【削除】
　なし
<% } %><% if (head_commit.modified.length) { %>【修正】
<% head_commit.modified.forEach(function (file) { %>　<%= file %>
<% }) %><% } else { %>【修正】
　なし
<% } %>[hr]リポジトリ：<%= repository.name %>
コミット　：<%= head_commit.url %>
コミッター：<%= head_commit.committer.username %>
[/info]
```

### 実行

以下のコマンドで簡単に実行可能です。

```bash
$ node app
loaded bot: github
```

`curl` などで、github の WebHook のデータを試しに送信してみてください。

[github WebHook sample JSON](https://gist.github.com/gjtorikian/5171861#file-sample_payload-json)