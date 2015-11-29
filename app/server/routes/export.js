var fs = require('fs');
var pdf = require(__approot + '/server/ext/pdf');
var xlsx = require(__approot + '/server/ext/xlsx');
var word = require(__approot + '/server/ext/word');

module.exports = function (app) {
  app.post('/api/pdf', function (req, res) {
    var html = pdf.get(req.body);
    res.send(html);
  });

  app.get('/api/pdfTemplate', function (req, res) {
    var path = __approot + '/server/views/pdf.ejs';
    var file = fs.readFileSync(path, "utf8");
    res.send(file);
  });

  app.post('/api/exportPDF', function (req, res) {
    pdf.create(req.body, function (fileURL) {
      res.send(fileURL);
    });
  });

  app.post('/api/exportExcel', function (req, res) {
    xlsx.build(req.body, function (fileURL) {
      res.send(fileURL);
    });
  });

  app.post('/api/exportWord', function (req, res) {
    word.create(req.body, function (fileURL) {
      res.send(fileURL);
    });
  });
};