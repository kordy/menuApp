var db = require('../db');


var MenuSchema = db.Schema({
    name: String,
    items: [
        { isGroup: Boolean,
          name: String,
          nameEng: String,
          price: Number,
          priceBase: Number,
          serving: String
        }
    ],
    image: {type: db.Schema.Types.ObjectId, ref: 'image'},
    noAdditionalExpenses: Boolean,
    serviceIncrease: String,
    commentAdditionalExpenses: String,
    isEnglish: Boolean,
    isImages: Boolean,
    noPrices: Boolean,
    discount: String
});

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