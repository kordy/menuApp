'use strict';

// need __approot

var fs = require('fs');
var htmlPdf = require('html-pdf');
var ejs = require('ejs');
var slugify = require('transliteration').slugify;

var PDF = {
    create: function(menu, callback){
        var str = fs.readFileSync(__approot + '/views/pdf.ejs', 'utf8');
        var html = ejs.render(str, menu);
        if(menu.image){
            var h = parseInt(menu.image.height) + 1 + 'px';
            var w = parseInt(menu.image.width) + 'px';
        }
        var options = {
            "border": "0",
            "height": h,
            "width": w
        };
      var menuName = menu.name;
      if (!menu.name) menuName = 'menu';
      var fileURL = 'files/' + slugify(menuName) + '.pdf';
      fs.writeFile(__approot + '/' + fileURL, "", function(err) {
        if(err) throw err;
        htmlPdf.create(html,options).toStream(function(err, stream){
          stream.pipe(fs.createWriteStream(__approot + '/' + fileURL));
          if(typeof callback==='function')callback(fileURL);
        });
      });


		
		// htmlPdf.create(html).toBuffer(function(err, buffer){
			// console.log(err);
		  // console.log('This is a buffer:', Buffer.isBuffer(buffer));
		// });
    },
    get: function(menu){
        var str = fs.readFileSync(__approot + '/views/pdf.ejs', 'utf8');
      console.log(menu);
        var html = ejs.render(str, menu);
        return html;
    }
};

module.exports = PDF;