var fs = require('fs');

var source = './payload.zip';
var target = './payload-js.zip';

var start = new Date();
var threads = 4;
var count = 0;
for(var i = 0; i < threads; i++)
{
	var out = fs.createWriteStream('./payload' + i + '-js.zip');
	out.on('close', function(e) {
		console.log('Done?!');
		count++;
		if(count == threads - 1) {
			var elapsed = new Date() - start;
			console.log('finished! ' + elapsed);
		}
	})
	fs.createReadStream('./payload' + i + '.zip').pipe(out);
}