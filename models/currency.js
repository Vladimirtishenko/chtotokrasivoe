var mongoose = require('../lib/mongoose');
var schema = new mongoose.Schema({
    currency: Object,
    date: Number
}, { collection: 'currency' });
// Model
module.exports = mongoose.model('currency', schema);