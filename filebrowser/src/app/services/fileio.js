(function (ng) {
    "use strict";

    ng
        .module('browser.app.service.fileservice', [  ])
        .factory('fileio', [ function() {
            var serv = {  };

            var remote = require('electron').remote;

            var pathlib = remote.require('path'),
                fslib = remote.require('fs'),
                process = remote.require('process')
                ;

            serv.sep = pathlib.sep;
            serv.join = pathlib.join;


            serv.ls = function(path) {
                return fslib.readdirSync(path);
            };
            serv.lsl = function(path) {
                var ret = [  ];

                var files = serv.ls(path);
                for(file in files) {
                    var stat = fslib.lstatSync(pathlib.join(path, file));
                    var ext = file.contains('.') ? file.split('.').pop() : '';
                    ret.push({ name: file, path: pathlib.join(path, file), ext: ext, stat: stat });
                }

                return ret;
            };

            serv.stat = function(path) {
                return fs.lstatSync(path);
            }
            serv.fileInfo = function(path) {
                var filename = path.split(pathlib.sep).pop();
                var ext = filename.split('.').pop();
                return {
                    name: filename,
                    path: path,
                    ext: ext,
                    icon: serv.getFileIcon(ext),
                    stat: fslib.lstatSync(path)
                };
            };


            serv.getFileIcon = function(ext) {
                switch(ext) {
                    case 'txt': return 'fa-file-text-o'; break;
                    case 'pdf': return 'fa-file-pdf-o'; break;
                    case 'js': return 'fa-file-code-o'; break;
                    case 'png': case 'jpg': case 'jpeg': case 'gif':
                        return 'fa-file-image-o'; break;

                    default: return 'fa-file-o';
                }
            };



            serv.getHomeDirectory = function() {
                return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
            }
            serv.getUser = function() {
                return process.env['USER'] || process.env['USERNAME'];
            }



            return serv;
        }])
        .factory('appio', [ function() {
            var serv = {  };

            var remote = require('electron').remote;

            var sys = remote.require('sys'),
                exec = remote.require('child_process').exec,
                process = remote.require('process')
                ;


            function launchCmd() {
                switch (process.platform) { 
                    case 'darwin': return 'open';
                    case 'win32': case 'win64': return 'start';
                    default: return 'xdg-open';
               }
            }
            serv.launch = function(path) {
                exec(launchCmd() + ' ' + path);
            }

            return serv;
        }]);

})(angular);
