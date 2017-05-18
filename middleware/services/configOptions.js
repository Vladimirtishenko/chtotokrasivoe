/**
 * Created by maxim.bondarenko on 15/11/2016.
 */
var mongoose = require('../../lib/mongoose');
var schema = mongoose.Schema({
    fieldName:String,
    params: String
}, { collection: 'config' });
// Model
var configOptions = mongoose.model('config', schema);

module.exports = {
    getOptions: function(callback){
        configOptions.find({}, function(err, date){
            callback(err, date);
        });
    },
    getOption: function(name, callback){
        configOptions.findOne({'fieldName': name}, function(err, date){
            callback(err, date);
        });
    },
    updateOption: function(name, param, callback){
        configOptions.update({'fieldName': name}, {"params" : param}, function(err, date){
            callback(err, date);
        });
    },
    saveOption: function(name, param, callback){
        configOptions.update(
            {'fieldName': name},
            { "fieldName" : name, "params" : param},
            { upsert : true }, function(err, date){
            callback(err, date);
        });
    }
};