var hg  = require('../lib/html-generator')
var rf  = require('../lib/readFiles')

var expect = require('expect.js')
describe('processSingleFile' ,function() {

	var ps = hg.processSingleFile

	it('should be able to run', function(done){
		ps("./test/resource/test1.md", function(err,data){
			expect(data).to.be.ok()
			done()
		})
	})

})


describe('buildFileTree' ,function() {

	var bft = rf.buildFileTree

	it('should be able to run', function(done){
		bft(".", function(err,data){
			expect(data).to.be.ok()
			done()
		})
	})

	it('should be able to run', function(done){
		bft("./test", function(err,data){
			console.log(data)
			done()
		})
	})

})

describe('fileCatcher' ,function() {

	var bft = rf.fileCatcher

	it('should be able to run', function(done){
		bft("./test", function(data){
			console.log(data.file)
		},function(){
			done()
		})
	})

})


describe('fileFilter' ,function() {

	var bft = rf.fileCatcher
	var fileFilterExec = rf.fileFilterExec

	it('should be able to filter', function(done){
		var c = 0;
		function ddone(){
			if(c == 0) done();
		}

		bft("./test", function(data){
			fileFilterExec([
				[function(fstat){
					return fstat.file.match(/.*\.md$/)
				},function(fstat){
					var ps = hg.processSingleFile
					ps(fstat.dir+'/'+fstat.file, function(err,data){
						expect(data).to.be.ok()
						expect(data.head).to.be.ok()
						expect(data.body).to.be.ok()
					})
				}]
			])(data)
		},function(){
			setTimeout(done,100)
		})
	})

})

