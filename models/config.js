var mongoose = require('../lib/mongoose');
var schema = mongoose.Schema({
    fieldName:String,
    params: String
}, { collection: 'config' });
// Model
module.exports = mongoose.model('config', schema);