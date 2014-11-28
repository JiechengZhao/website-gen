var fp  = require('../lib/file-parser')
var expect = require('expect.js')

describe('head-parser' ,function() {
	var hp = fp.headParser
	var x 
	beforeEach(function(){
		x = hp("a: b\r\nc:d  \n\r  e : f \r\n hello : This is the title of the file.  \r\n has :  has : dones't matter \r\n utf8 : 可以输入中文\n---\n")
	})
	it ('can be called without new', function(){

		expect(x).not.to.be(global)
	})

	it ('should trim the keys',function(){
		expect(x.a).to.be.ok();
		expect(x.c).to.be.ok();
		expect(x.e).to.be.ok();
		expect(x.b).not.to.be.ok();
	})

	it ('should trim the values',function(){
		expect(x.a).to.be("b")
		expect(x.c).to.be("d")
		expect(x.e).to.be("f")
	})

	it('should work on words, symbols and unicodes', function(){
		expect(x.hello).to.be("This is the title of the file.")
		expect(x.has).to.be("has : dones't matter")
		expect(x.utf8).to.be("可以输入中文")
	})
})

describe('fileSpliter' , function(){
	var fs = fp.fileSpliter
	it ('can be called without new', function(){
		expect(fs('\n---\n')).not.to.be(global)
	})
	it ('can split linux file',function(){
		var r = fs('---\nhead part \n------\n main part\n')
		expect(r.head).to.be('---\nhead part \n------\n')
		expect(r.body).to.be(' main part\n')
	})

	it ('can split windows file',function(){
		var r = fs('---\r\nhead part \r\n------\r\n main part\r\n')
		expect(r.head).to.be('---\r\nhead part \r\n------\r\n')
		expect(r.body).to.be(' main part\r\n')
	})

	it ('can hold text with "---"',function(){
		var r = fs('---\r\nhead part ---\r\n------\r\n main part\r\n')
		expect(r.head).to.be('---\r\nhead part ---\r\n------\r\n')
		expect(r.body).to.be(' main part\r\n')
	})

	it ('can hold text without first "---"',function(){
		var r = fs('head part ---\r\n------\r\n main part\r\n')
		expect(r.head).to.be('head part ---\r\n------\r\n')
		expect(r.body).to.be(' main part\r\n')
	})

	it ('can hold text without unicode',function(){
		var r = fs('---\r\n 头部 ---\r\n------\r\n  躯干 \r\n')
		expect(r.head).to.be('---\r\n 头部 ---\r\n------\r\n')
		expect(r.body).to.be('  躯干 \r\n')
	})
})

describe('file-parser' ,function() {
	it('can run',function(){
		var r = fp.fileParser('---\nfdsa:fasdf\nfds:fds\n------\nfdsa\n====')
		expect(r).to.be.ok()
		expect(r.head).to.be.ok()
		expect(r.body).to.be.ok()
	})
})