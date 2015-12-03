var db = require('../db');

function extend(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            if (prop !== '_id') {
                target[prop] = source[prop];
            }
        }
    });
    return target;
}

var MenuSchema = db.Schema({
    userId: db.Schema.Types.ObjectId,
    name: String,
    nameEng: String,
    items: [
        {
          _id: {type: db.Schema.Types.ObjectId},
          product: {type: db.Schema.Types.ObjectId, ref: 'product'},
          isGroup: Boolean,
          isDelimiter: Boolean,
          name: String,
          nameEng: String
        }
    ],
    paddingLeft: Number,
    paddingRight: Number,
    paddingTop: Number,
    paddingBottom: Number,
    image: {type: db.Schema.Types.ObjectId, ref: 'image'},
    noAdditionalExpenses: Boolean,
    serviceIncrease: String,
    commentAdditionalExpenses: String,
    isEnglish: Boolean,
    isImages: Boolean,
    noPrices: Boolean,
    isTwoColumns: Boolean,
    discount: String
});

MenuSchema.statics.fetch = function(options, callback){
    var that = this;
    that.find(options)
      .populate('image items.product')
      .exec(function (err, menus) {
          if (menus)
              menus.forEach(function(menu, index) {
                  if (menu.items) {
                      var newItems = [];
                      menu.items.forEach(function(item, index) {
                          if (!item.isGroup && !item.isDelimiter && (!item.product || !item.product._id)) {
                              return;
                          }
                          if (item && item.product && item.product._id) {
                              extend(item, item.product);
                          }
                          newItems[newItems.length] = item;
                      });
                      if (menu.items.length !== newItems.length) {
                          menu.items = newItems;
                      }
                  }
              });
          if (typeof callback === 'function') callback(err, menus);
      });
};

MenuSchema.statics.updateById = function(param, callback){
  this.update({_id: param._id}, param, false, function(err, menu){
    if (typeof callback === 'function') callback(err, menu);
  })
};

var Menu = db.model('menu', MenuSchema);

Menu.prototype.deleteById = function(callback){
    var that = this;
    Menu.findOne({_id:that._id}, function(err, menu) {
        if (err) throw err;
        menu.remove(callback);
    });
};

Menu.prototype.replace = function(callback){
    var that = this;
    if(that._id && that.isDelete){
        that.deleteById(callback);
        return;
    }
    if(that._id){
        Menu.findOne({_id:that._id}, function(err, menu) {
            if(menu){
                that._id = menu._id;
                that.__v = menu.__v;
                that.updateById(callback);
            }else{
                Menu.findOne({name:that.name}, function(err, product) {
                    if(product){
                        that._id = product._id;
                        that.__v = product.__v;
                        that.updateById(callback);
                    }else{
                        that.save(function (err) {
                            if (err) console.log(err);
                            if(typeof callback === 'function')callback();
                        });
                    }
                });
            }
        })
    }
};

module.exports = Menu;