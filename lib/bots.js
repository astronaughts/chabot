var fs      = require('fs'),
    path    = require('path'),
    colors  = require('colors'),
    cwd     = path.relative(__dirname, process.cwd()),
    bots    = module.exports;

fs.readdirSync(path.join(process.cwd(), 'bots')).forEach(function (botfile) {
    if (path.extname(botfile) !== '.js') return;

    var botname = path.basename(botfile, '.js');

    bots[botname] = function (req, res, next) {
        var cw      = require('simple-cw-node')(),
            ejs     = require('ejs'),
            config  = require(cwd + '/config'),
            bot     = require(cwd + '/bots/' + botname);

        if (req.headers.host !== config.bots[botname].hostname) {
            res.statusCode = 404;
            res.end();
            return;
        }

        // chatwork client initialize.
        cw.init({ token: config.bots[botname].token });

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

    console.log('loaded bot: '.green + botname);
});