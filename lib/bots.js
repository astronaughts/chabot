var fs      = require('fs'),
    path    = require('path'),
    colors  = require('colors'),
    cwd     = path.relative(__dirname, process.cwd());

module.exports = function(botname, botConfig) {
    console.log('loaded bot: '.green + botname);

    return function (req, res, next) {
        var cw      = require('simple-cw-node')(),
            ejs     = require('ejs'),
            bot     = require(cwd + '/bots/' + botname);

        if (req.headers.host !== botConfig.hostname) {
            res.statusCode = 404;
            res.end();
            return;
        }

        // chatwork client initialize.
        cw.init({ token: botConfig.token });

        // run bot.
        bot({
            next: next,
            client: cw,
            roomid: req.params.roomid,
            data: req.body,
            render: ejs.render,
            readTemplate: function (filepath) {
                return fs.readFileSync(path.join('./templates/', filepath), 'utf8');
            },
            log: function (s) { console.log('  ' + s); },
            error: function (s) { console.error('  ' + s); }
        });

        res.end(botname);
    };
};
