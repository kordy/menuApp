var Menu = require(__approot + '/server/ext/db/schema/menu');

module.exports = function (app) {
  app.get('/api/menus', function (req, res) {
    Menu.find({})
      .populate('image')
      .exec(function (err, menus) {
        res.json(menus);
      });
  });

  app.post('/api/menu', function (req, res) {
    var params = req.body;
    delete params._id;
    if (!params.image._id) delete params.image;
    var menu = new Menu(params);
    menu.save(function (err) {
      if (err) {
        console.log(err);
        res.send({'result': false});
      } else {
        Menu.find({})
          .populate('image')
          .exec(function (err, menus) {
            res.json({menus: menus, currentMenuId: menu._id});
          });
      }
    });
  });

  app.put('/api/menu/:id', function (req, res) {
    var params = req.body;
    delete params._id;
    if (!params.image._id) delete params.image;
    Menu.findOneAndUpdate({_id: req.params.id}, params, null, function (err, menu) {
      Menu.find({})
        .populate('image')
        .exec(function (err, menus) {
          res.json({menus: menus, currentMenuId: menu._id});
        });
    });
  });

  app.delete('/api/menu/:id', function (req, res) {
    Menu.findOne({_id: req.params.id}, function (err, menu) {
      menu.remove({}, function (err, menu) {
        Menu.find({})
          .populate('image')
          .exec(function (err, menus) {
            res.json({menus: menus});
          });
      });
    });
  });
};