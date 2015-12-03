'use strict';

var nodexlsx = require('node-xlsx');
var xl = require('excel4node');
var fs = require('fs');
var Product = require('./db/schema/product');
var Group = require('./db/schema/group');
var slugify = require('transliteration').slugify;


function dataSave(data, callback) {

  var gr = new Group();
  gr.code = data[0];
  gr.name = data[1];
  gr.nameEng = data[3];

  gr.replace(function () {
    if (!data[2])return;

    var code = gr.code;
    var where = [];
    while (code.length) {
      where.push({'code': code});
      code = code.substr(0, code.length - 2);
    }
    (function (data) {
      Group.find({$or: where}, null, {sort: {code: 1}}, function (err, groups) {
        var prod = new Product();
        XLSX.cnt++;
        prod.name = data[2];
        prod.nameEng = data[3];
        prod.serving = data[4];
        prod.servingDrink = data[5];
        if (prod.servingDrink) {
          prod.serving = prod.servingDrink;
          prod.isDrink = true;
        }
        prod.priceBase = data[6];
        prod.coefficient = data[7];
        prod.image = data[8];
        prod.group = groups;
        prod.replace(function () {
          XLSX.cnt--;
          if (XLSX.cntAll == XLSX.dataLength && XLSX.cnt === 0 && typeof callback === 'function') {
            callback();
          }
        });
      });
    })(data);
  });

}


var XLSX = {
  cnt: 0,
  cntAll: 0,
  dataLength: 0,

  parse: function (files, callback) {
    XLSX.cnt = 0;
    XLSX.cntAll = 0;
    for (var i in files) {
      var obj = nodexlsx.parse(files[i].path); // parses a file;
      var data = obj[0].data;

      XLSX.dataLength = data.length;
      //Product.remove({}, function(err) {
      //  console.log(err);
      //  console.log('collection removed');
      //});
      //Group.remove({}, function(err) {
      //  console.log(err);
      //  console.log('collection removed');
      //});
      for (var j in data) {
        XLSX.cntAll++;
        if (isNaN(parseInt(data[j][0])) || !data[j][0]) continue;
        dataSave(data[j], callback);
      }
    }
  },

  build: function (menu, callback) {
    var wb = new xl.WorkBook();
    var wsOpts = {
      view: {
        zoom: 100
      }
    };
    var ws = wb.WorkSheet(slugify(menu.name), wsOpts);
    menu.items.forEach(function (item, index) {
      if (item.isDelimiter) return;
      index++;
      var name = menu.isEnglish === 'true' ? item.nameEng : item.name;
      var serving = item.serving ? item.serving + ' г' : '';
      var price = item.priceBase && item.coefficient ? parseFloat(item.priceBase) * parseFloat(item.coefficient) + ' руб' : '';

      //myStyle.Font.Italics();
      //myStyle.Font.Underline();
      //myStyle.Font.Family('Times New Roman');
      //myStyle.Font.Color('FF0000');
      //myStyle.Font.Size(16);
      //myStyle.Font.Alignment.Vertical('top');
      //myStyle.Font.Alignment.Horizontal('left');
      //myStyle.Font.Alignment.Rotation('90');
      //myStyle.Font.WrapText(true);
      ws.Column(1).Width(60);
      ws.Cell(index, 1).String(name);
      if (item.isGroup === 'true') {
        var style = wb.Style();
        style.Font.Bold();
        style.Font.Alignment.Vertical('center');
        ws.Row(index).Height(24);
        ws.Cell(index,1).Style(style);
      }

      ws.Cell(index, 2).String(serving);
      ws.Cell(index, 3).String(price);
      //ws.Cell(index,3).Formula("A2+B2");
      //ws.Cell(index,4).Formula("A2/C2");
      //ws.Cell(index,5).Date(new Date());
      //ws.Cell(index,6).Link('http://google.com'); or ws.Cell(2,6).Link('http://google.com','Link name');
      //ws.Cell(index,7).Bool(true);

    });
    var fileURL = 'files/' + slugify(menu.name) + '.xlsx';
    wb.write(__approot + '/' + fileURL,function(err) {
      if (err) throw err;
      if (typeof callback==='function') callback(fileURL);
    });

    //var data = items;
    //var buffer = build([{name: slugify(menu.name), data: data}]);
    //var fileURL = 'files/' + slugify(menu.name) + '.xlsx';
    //fs.writeFile(__approot + '/' + fileURL, buffer, function(err) {
    //    if (err) throw err;
    //    if (typeof callback==='function') callback(fileURL);
    //});
  }

};

module.exports = XLSX;