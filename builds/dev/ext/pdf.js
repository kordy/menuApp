'use strict';

// need __approot

var fs = require('fs');
var htmlPdf = require('html-pdf');
var ejs = require('ejs');

var PDF = {
    create: function(menu, callback){
        var str = fs.readFileSync(__approot + '/views/pdf.ejs', 'utf8');
        var html = ejs.render(str, menu);
		console.log(menu);
        if(menu.image){
            var h = parseInt(menu.image.height) + 220 + 'px';
            var w = parseInt(menu.image.width) + 160 + "px";
        }
        var options = {
            "border": "0",
            "height": h,
            "width": w
        };
		console.log('1111222333');
		console.log(w + ' : ' + h);
        htmlPdf.create(html,options).toStream(function(err, stream){
		
            var fileURL = '/files/foo.pdf';
			console.log(err);
            stream.pipe(fs.createWriteStream(__approot + fileURL));
            if(typeof callback==='function')callback(fileURL);
        });
		
		// htmlPdf.create(html).toBuffer(function(err, buffer){
			// console.log(err);
		  // console.log('This is a buffer:', Buffer.isBuffer(buffer));
		// });
    },
    get: function(menu){
        var str = fs.readFileSync(__approot + '/views/pdf.ejs', 'utf8');
        var html = ejs.render(str, menu);
        return html;
    }
};

module.exports = PDF;