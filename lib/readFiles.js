var path = require('path'),
	fs = require('fs')

exports = module.exports = {};

exports.buildFileTree = function buildFileTree(dir,callback){
	var c1 = 0,
	c2 = 0,
	flist = {}
	var topdir = path.resolve(dir)
	doReadFiles(topdir,flist)

	function collect(){
		if(c1 == 0 && c2 == 0){
			 callback(null,flist)
		}
	}

	function doReadFiles(dir,fl){
		dir = path.resolve(dir)
		if (dir.slice(0,topdir.length) != topdir){
			return
		}
		c1++
		fl.dirs = []
		fl.files = []

		fs.readdir(dir,function(err,files){
			if(err) return console.log('doReadFiles : '+err);
			files.forEach(function(file){
				++c2;
				fs.stat(dir+"/"+file,function(err,stat){
					if (err) return console.log(err);
					if(stat.isDirectory()){

						var sfl = {'d':file,'x':{}}
						fl.dirs.push(sfl)
						doReadFiles(dir+"/"+file,sfl.x );
					}else if(stat.isFile()){
						fl.files.push(file);
					}

					--c2;
					collect()
				})
			})
			--c1;
			collect()
		})
	}
}



exports.fileCatcher = function fileCatcher(dir,callback,endCallback){
	var c1 = 0,
		c2 = 0
	var topdir = path.resolve(dir)
	doReadFiles(topdir)

	function collect(){
		if( endCallback && c1 == 0 && c2 == 0 ){
			endCallback()
		}
	}

	function doReadFiles(dir){
		dir = path.resolve(dir)
		if (dir.slice(0,topdir.length) != topdir){
			return
		}
		c1++
		fs.readdir(dir,function(err,files){
			if(err) return console.log('doReadFiles : '+err);
			files.forEach(function(file){
				++c2;
				fs.stat(dir+"/"+file,function(err,stat){
					if (err) return console.log(err);
					if(stat.isDirectory()){
						doReadFiles(dir+"/"+file);
					}
					callback({
						file : file,
						dir : dir,
						stat : stat
					})
					--c2;
					collect()
				})
			})
			--c1;
			collect()
		})
	}
}


exports.fileFilterExec = function (filterList){
	var filter = filterList || []

	function execFileFilter (fileState){
		for (var i = 0; i < filter.length ; ++i){
			if ( filter[i][0](fileState) ){
				filter[i][1](fileState)
				break
			}
		}
	}

	return execFileFilter

}