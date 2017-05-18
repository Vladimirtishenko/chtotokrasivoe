/**
 * Created by maxim.bondarenko on 07/11/2016.
 */
var mongoose = require('../../../../lib/mongoose');
var schema = mongoose.Schema({
    uname: String,
    date: {type: Date, default: Date.now},
    email: {type: String, unique: true},
    city: String,
    role: {type: String, default: 'customer'},
    pass: String
}, { collection: 'users' });
// Model
module.exports = mongoose.model('users', schema);