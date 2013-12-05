var connect = require('connect'),
    routing = require('connect-route'),
    http    = require('http'),
    path    = require('path'),
    cwd     = path.relative(__dirname, process.cwd()),
    utils   = connect.utils,
    bots    = require('./bots');

module.exports = function () {
    var chabot = connect(),
        config = require(cwd + '/config');

    utils.merge(chabot, {
        // load various bots.
        set: function () {    
            chabot.use(routing(function (router) {
                for (var key in config.bots) {
                    router.post(config.bots[key].route, bots[key]);
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