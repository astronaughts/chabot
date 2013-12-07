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
        .option('-d, --dist [dir]', 'the directory to place the app in [default: CWD]')
        .option('-f, --force', 'overwrite existing directory')
        .action(function(appname, options){
            var dirpath = path.join(options.dist || process.cwd(), appname);
            if (fs.existsSync(dirpath) && !options.force) {
                console.log('  directory with specified name already exists.'.red);
                console.log('   > ' + dirpath);
                return;
            }
            console.log('  copying files.'.cyan);
            fs.copySync(path.resolve(__dirname, '../example'), dirpath);
            fs.copySync(path.resolve(__dirname, '../'), dirpath + '/node_modules/chabot');
            console.log('  completed!'.magenta);
            console.log('   > ' + dirpath);
        });

    program.parse(process.argv);
};