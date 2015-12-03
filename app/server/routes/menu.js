var Menu = require(__approot + '/server/ext/db/schema/menu');

module.exports = function (app) {


  app.get('/api/menus', function (req, res) {
    var params = {};
    if (req.decodedUser && req.decodedUser.type !== 'admin'){
      params = {userId: req.decodedUser};
    }
    Menu.fetch(params, function(err, menus) {
      if (err) console.log(err);
      res.json(menus);
    })
  });

  app.post('/api/menu', function (req, res) {
    var params = req.body;
    delete params._id;
    if (!params.image._id) delete params.image;
    if (params.items) {
      params.items.forEach(function(item, index) {
        if (item._id) item.product = item._id;
      });
    }
    params.userId = req.decodedUser;
    var menu = new Menu(params);
    menu.save(function (err) {
      if (err) {
        res.send({'result': false});
      } else {
        var params = {};
        if (req.decodedUser && req.decodedUser.type !== 'admin'){
          params = {userId: req.decodedUser};
        }
        Menu.fetch(params, function(err, menus) {
          if (err) console.log(err);
          res.json({menus: menus, currentMenuId: menu._id});
        });
      }
    });
  });

  app.put('/api/menu/:id', function (req, res) {
    var params = req.body;
    delete params._id;
    if (!params.image || !params.image._id) delete params.image;
    if (params.items) {
      params.items.forEach(function(item, index) {
        if (item._id) item.product = item._id;
        console.log(item);
      });
    }
    params.userId = req.decodedUser;
    Menu.findOneAndUpdate({_id: req.params.id}, params, null, function (err, menu) {
      params = {};
      if (req.decodedUser && req.decodedUser.type !== 'admin'){
        params = {userId: req.decodedUser};
      }
      Menu.fetch(params, function(err, menus) {
        if (err) console.log(err);
        res.json({menus: menus, currentMenuId: menu._id});
      });
    });
  });

  app.delete('/api/menu/:id', function (req, res) {
    Menu.findOne({_id: req.params.id}, function (err, menu) {
      menu.remove({}, function (err, menu) {
        var params = {};
        if (req.decodedUser && req.decodedUser.type !== 'admin'){
          params = {userId: req.decodedUser};
        }
        Menu.fetch(params, function(err, menus) {
          if (err) console.log(err);
          res.json({menus: menus});
        });
      });
    });
  });
};