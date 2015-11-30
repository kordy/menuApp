'use strict';

// need __approot

var fs = require('fs');
var officegen = require('officegen');
var ejs = require('ejs');
var slugify = require('transliteration').slugify;

var DOCX = {

  create: function(menu, callback){

    var docx = officegen('docx');
    var menuName = menu.name;
    if (!menu.name) menuName = 'menu';
    var pObj = docx.createP({ align: 'center' });
    pObj.addText(menuName, {font_face: 'Arial', font_size: 18});
    menu.items.forEach(function (item, index) {
      if (item.isDelimiter) return;

      var name = menu.isEnglish === 'true' ? item.nameEng : item.name;
      var serving = item.serving ? item.serving + ' г' : '';
      var priceBase = item.priceBase ? item.priceBase + ' руб' : '';

      var pObj = docx.createP ();
      if (item.isGroup === 'true') {
        pObj.addLineBreak();
        pObj.addText ( name, { bold: true, font_face: 'Arial', font_size: 12 } );
      }
      else {
        pObj.addText ( name + '(' + serving + ')', {font_face: 'Arial', font_size: 10});
        pObj.addText ( ' - ' + priceBase, { bold: true, font_face: 'Arial', font_size: 10});
      }
    });

    var fileURL = 'files/' + slugify(menuName) + '.docx';

    var out = fs.createWriteStream(__approot + '/' + fileURL);

    out.on ( 'error', function ( err ) {
      console.log ( err );
    });

    docx.generate ( out, {
      'finalize': function ( written ) {
        console.log ( 'Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n' );
        if (typeof callback==='function') callback(fileURL);
      },
      'error': function ( err ) {
        console.log ( err );
      }
    });

    //fs.writeFile(__approot + '/' + fileURL, "", function(err) {
    //  if(err) throw err;
    //  htmlPdf.create(html,options).toStream(function(err, stream){
    //    stream.pipe(fs.createWriteStream(__approot + '/' + fileURL));
    //    if(typeof callback==='function')callback(fileURL);
    //  });
    //});
    //
    // htmlPdf.create(html).toBuffer(function(err, buffer){
    // console.log(err);
    // console.log('This is a buffer:', Buffer.isBuffer(buffer));
    // });
  }
};

module.exports = DOCX;