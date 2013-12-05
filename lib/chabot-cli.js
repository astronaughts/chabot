var cli = module.exports;

cli.run = function() {

    var fs      = require('fs-extra'),
        path    = require('path'),
        program = require('commander'),
        colors  = require('colors'),
        pack    = require('../package');

    program
        .version(pack.version.cyan)
        .command('create [appname]')
        .description('create chabot app'.cyan)
        .option('-d, --dist [dir]', 'the directory to place the app in [default: ~/]')
        .action(function(appname, options){
            var dir = options.dist || '~/';
            console.log('  copying files.'.cyan);
            fs.copySync(path.resolve(__dirname, '../example'), dir);
            fs.copySync(path.resolve(__dirname, '../'), dir + '/node_modules/chabot');
            console.log('  completed!'.magenta);
        });

    program.parse(process.argv);
};