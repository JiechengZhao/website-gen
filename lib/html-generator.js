var fileParser = require('./file-parser')
var fs = require('fs')

var hg = exports = module.exports = {};

hg.processSingleFile = function processSingleFile(filename, callback){
	fs.readFile(filename, function(err, data){
		if (err){
			throw err
		}
		var f = fileParser.fileParser(data.toString())
		callback(null, f)
	})
}


