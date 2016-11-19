var fs = require('electron').remote.require('fs');

var ls = function ls() {
	return fs.readdirSync('.');
}

module.exports = {
	ls: ls
};