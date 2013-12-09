module.exports = function (chabot) {

    // WebHook で受けたデータをセット
    var payload = JSON.parse(chabot.data.payload);
    // ChatWork API の endpoint をセット
    var endpoint = '/rooms/' + chabot.roomid + '/messages';
    // templats/ 内のメッセージテンプレートを読み込む
    var template = chabot.readTemplate('github.ejs');
    // WebHook で受けたデータでメッセージテンプレートを描画
    var message_body = chabot.render(template, payload);

    // ChatWork API でメッセージ送信
    chabot.client
        .post(endpoint, {
            body: message_body
        })
        .done(function (res) {
            chabot.log('done');
        })
        .fail(function (err) {
            chabot.error(err);
        });
};