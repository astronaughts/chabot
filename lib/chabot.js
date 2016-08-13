var connect = require('connect'),
    routing = require('connect-route'),
    http    = require('http'),
    path    = require('path'),
    cwd     = path.relative(__dirname, process.cwd()),
    utils   = connect.utils,
    bots    = require('./bots');

module.exports = function (config) {
    var chabot = connect();

    utils.merge(chabot, {
        // load various bots.
        set: function () {
            chabot.use(routing(function (router) {
                for (var key in config.bots) {
                    var botConfig = config.bots[key];
                    router.post(botConfig.route, bots(key, botConfig));
                };
            }));
            return this;
        },
        listen: function () {
            var server = http.createServer(this);
            return server.listen.apply(server, arguments);
        }
    });

    return chabot;
};

// define middleware.
module.exports.middleware = connect.middleware;
