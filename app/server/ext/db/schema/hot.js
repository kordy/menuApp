var db = require('../../../../../builds/dev/ext/db/db');
var fs = require('fs');
var imagesize = require('imagesize');
var crypto = require('crypto');
var fileDirectory = '/hots/'

var hotSchema = db.Schema({
//    _id : { type: Number, ref: 'menu' },
    name: String,
    ext: String,
    src: String,
    width: String,
    height: String
});

hotSchema.post('find', function(result) {
    result.forEach(function(item) {
        item.src = fileDirectory + item.url();
    })
});


hotSchema.post('remove', function(item) {
    console.log(item.path());
    fs.unlinkSync(item.path());
});

var Hot = db.model('hot', hotSchema);

Hot.prototype.url = function(){
   var that = this;
   return "i_" + that._id + "." + that.ext;
};

Hot.prototype.path = function(){
    var that = this;
    return __approot + fileDirectory + that.url();
};


Hot.prototype.updateById = function(callback){
    var that = this;
    Hot.update({_id: that._id}, that, false, function(err){
        if (err) console.log(err);
        if(typeof callback === 'function')callback();
    })
};

Hot.prototype.deleteById = function(callback){
    var that = this;
    Hot.findOne({_id:that._id}, function(err, image) {
        if (err) throw err;
        image.remove(callback);
    });
};

Hot.prototype.saveIMG = function(file,callback){
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
            that.src = fileDirectory + that.url();
            if(typeof callback === 'function')callback(that);
        });
    });


};

Hot.prototype.replace = function(callback){
    var that = this;
    if(that._id && that.isDelete){
        that.deleteById(callback);
        return;
    }
    if(that._id){
        Hot.findOne({_id:that._id}, function(err, image) {
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





module.exports = Hot;