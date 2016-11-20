var fs = require('fs');

var source = './payload.zip';
var target = './payload-js1.zip';

fs.createReadStream(source).pipe(fs.createWriteStream(target));