var chabot      = require('chabot'),
    middleware  = chabot.middleware,
    config      = require('./config');

var app = chabot()
    .use(middleware.favicon())
    .use(middleware.logger('dev'))
    .use(middleware.bodyParser())
    .set();

app.listen(config.port);