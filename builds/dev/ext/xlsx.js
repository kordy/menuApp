'use strict';

var nodexlsx = require('node-xlsx');
var Product = require('./db/schema/product');
var Group = require('./db/schema/group');


function dataSave(data, callback){

    var gr = new Group();
    gr.code = data[0];
    gr.name = data[1];
    gr.nameEng = data[3];

    gr.replace(function(){
        if(!data[2])return;

        var code = gr.code;
        var where = [];
        while(code.length){
            where.push({'code':code});
            code = code.substr(0,code.length-2);
        }
        (function(data){
            Group.find({ $or: where },null, {sort:{ code: 1 }}, function(err, groups){
                var prod = new Product();
                XLSX.cnt++;
                prod.name = data[2];
                prod.nameEng = data[3];
                prod.serving = data[4];
                prod.servingDrink = data[5];
                prod.priceServing = data[6];
                prod.priceKg = data[7];
                prod.priceBase = data[8];
                prod.image = data[9];
                prod.group = groups;
                prod.replace(function(){
                    XLSX.cnt--;
                    if(XLSX.cntAll == XLSX.dataLength && XLSX.cnt === 0 && typeof callback === 'function'){
                        callback();
                    }
                });
            });
        })(data);
    });

}

var XLSX = {
    cnt: 0,
    cntAll: 0,
    dataLength: 0,
    parse: function(files, callback){
        XLSX.cnt = 0;
        XLSX.cntAll = 0;
        for(var i in files){
            var obj = nodexlsx.parse(files[i].path); // parses a file;
            var data = obj[0].data;

            XLSX.dataLength = data.length;

            for(var j in data){
                XLSX.cntAll++;
                if (isNaN(parseInt(data[j][0])) || !data[j][0]) continue;
                dataSave(data[j], callback);
            }
        }
    }
};

module.exports = XLSX;