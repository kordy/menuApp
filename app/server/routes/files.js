var fs = require('fs');
var path = require('path');
var mime = require('mime');

module.exports = function (app) {
  app.get('/files/:file', function (req, res) {
    var file = __approot + '/files/' + req.params.file;
    var filename = path.basename(file);
    var mimetype = mime.lookup(file);

    if (mimetype !== 'image/jpeg' || mimetype !== 'image/png' || mimetype !== 'image/gif') {
      res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    }
    res.setHeader('Content-type', mimetype);

    var filestream = fs.createReadStream(file);
    filestream.pipe(res);
  });

};