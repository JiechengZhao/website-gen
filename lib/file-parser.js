var markdown = require( "markdown" )
var fs = require("fs")

function fileSpliter(data){
	var idx = data.indexOf('\n')
	if (idx<0){
		throw "should have an end of line in the File"
	}
	idx = data.indexOf('\n---',idx)
	var r = {}

	if (idx < 0){
		throw "should have head seperater in the file"
	}
	idx = data.indexOf('\n',idx+1)
	return {
		head : data.substring(0,idx+1),
		body : data.substring(idx+1)
	}
} 

function headParser(data){
	var r = {}
	var lines = data.split('\n')
	for (var i = 0; i < lines.length ; i++){
		var line = lines[i]
		var idx = line.indexOf(':')
		if (idx != -1){
			r[line.substring(0,idx).trim()] = line.substring(idx+1).trim()
		}
	}
	return r
}

 function fileParser(data){
	var f = fileSpliter(data)
	return {
		head : headParser(f.head),
		body : markdown.parse(f.body)
	}
}

module.exports  = {
	fileSpliter : fileSpliter,
	headParser : headParser,
	fileParser : fileParser
}