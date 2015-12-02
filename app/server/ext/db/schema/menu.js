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
    name: String,
    nameEng: String,
    items: [
        {
          _id: {type: db.Schema.Types.ObjectId, ref: 'product'},
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

MenuSchema.statics.fetch = function(callback){
    this.find({})
      .populate('items._id')
      .exec(function (err, menus) {
          if (menus)
              menus.forEach(function(menu, index) {
                  if (menu.items)
                      menu.items.forEach(function(product, index) {
                          if (product && product._id && product._id._id) {
                              extend(product, product._id);
                              product._id = product._id._id;
                          }
                      });
              });
          if (typeof callback === 'function') callback(err, menus);
      });
};

var Menu = db.model('menu', MenuSchema);




Menu.prototype.updateById = function(callback){
    var that = this;
    Menu.update({_id: that._id}, that, false, function(err){
        if (err) console.log(err);
        if(typeof callback === 'function')callback();
    })
};

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