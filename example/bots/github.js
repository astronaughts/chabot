module.exports = function (chabot) {

    var endpoint = '/rooms/' + chabot.roomid + '/messages',
        template = chabot.readTemplate('github.ejs');

    chabot.client
        .post(endpoint, {
            body: chabot.render(template, JSON.parse(chabot.data.payload));
        })
        .done(function (res) {
            chabot.log('done');
        })
        .fail(function (err) {
            chabot.error(err);
        });
};