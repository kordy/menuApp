var Group = require(__approot + '/server/ext/db/schema/group');

module.exports = function (app) {
  app.get('/api/groups', function (req, res) {
    Group.find({}, null, {sort: {'code': 1}}, function (err, groups) {
      res.send(groups);
    });
  });
};