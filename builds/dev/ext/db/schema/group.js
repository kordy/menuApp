var db = require('../db');

var GroupSchema = db.Schema({
    name: String,
    code: {
        type: String,
        unique: true
    }

});

var Group = db.model('group', GroupSchema);

Group.prototype.updateById = function(callback){
    var that = this;
    Group.update({_id: that._id}, that, false, function(err){
        if (err) console.log(err);
        if(typeof callback === 'function')callback(that);
    })
};

Group.prototype.deleteById = function(callback){
    var that = this;
    Group.findOne({_id:that._id}, function(err, group) {
        if (err) throw err;
        group.remove(callback);
    });
};

Group.prototype.replace = function(callback){
    var that = this;
    if(that._id && that.isDelete){
        that.deleteById(callback);
        return;
    }
    if(that._id){
        Group.findOne({_id:that._id}, function(err, group) {
            if(group){
                that._id = group._id;
                that.__v = group.__v;
                that.updateById(callback);
            }else{
                Group.findOne({code:that.code}, function(err, group) {
                    if(group){
                        that._id = group._id;
                        that.__v = group.__v;
                        that.updateById(callback);
                    }else{
                        that.save(function (err) {
                            if (err) console.log(err);
                            if(typeof callback === 'function')callback(that);
                        });
                    }
                });
            }
        })
    }
};

module.exports = Group;