var db = require('../db');
var fs = require('fs');
var imagesize = require('imagesize');
var crypto = require('crypto');
var fileDirectory = '/files/';
var conf = require('config');
var imageSchema = db.Schema({
//    _id : { type: Number, ref: 'menu' },
    name: String,
    ext: String,
    src: String,
    width: String,
    height: String
});

imageSchema.post('find', function(result) {
    result.forEach(function(item) {
        item.src = conf.get('domainFull') + fileDirectory + item.url();
    })
});


imageSchema.post('remove', function(item) {
    console.log(item.path());
    fs.unlinkSync(item.path());
});

var Image = db.model('image', imageSchema);

Image.prototype.url = function(){
   var that = this;
   return "i_" + that._id + "." + that.ext;
};

Image.prototype.path = function(){
    var that = this;
    return __approot + fileDirectory + that.url();
};


Image.prototype.updateById = function(callback){
    var that = this;
    Image.update({_id: that._id}, that, false, function(err){
        if (err) console.log(err);
        if(typeof callback === 'function')callback();
    })
};

Image.prototype.deleteById = function(callback){
    var that = this;
    Image.findOne({_id:that._id}, function(err, image) {
        if (err) throw err;
        image.remove(callback);
    });
};

Image.prototype.saveIMG = function(file,callback){
    var that = this,
        filePath = __approot + fileDirectory,
        tmpName = crypto.createHash('md5').update(file.path).digest('hex'),
        source = fs.createReadStream(file.path),
        tmpPath = filePath + tmpName,
        target = fs.createWriteStream(tmpPath);

    source.pipe(target);
    imagesize(source, function (err, result) {
        that.ext = result.format;
        that.width = result.width;
        that.height = result.height;
        that.name = file.name;
        that.save(function (err) {
            if (err) console.log(err);
            fs.rename(tmpPath, that.path(), function (err) {
                console.log('rename callback ', err);
            });
            that.src = conf.get('domainFull') + fileDirectory + that.url();
            if(typeof callback === 'function')callback(that);
        });
    });


};

Image.prototype.replace = function(callback){
    var that = this;
    if(that._id && that.isDelete){
        that.deleteById(callback);
        return;
    }
    if(that._id){
        Image.findOne({_id:that._id}, function(err, image) {
            if(image){
                that._id = image._id;
                that.__v = image.__v;
                that.updateById(callback);
            }else{
                that.save(function (err) {
                    if (err) console.log(err);
                    if(typeof callback === 'function')callback();
                });
            }
        })
    }
};





module.exports = Image;