var mongoose = require('../lib/mongoose');
var schema = new mongoose.Schema({
    fieldId: { type: Number, default: 0 },
    text: String
}, { collection: 'auction_info' });
// Model
module.exports = mongoose.model('auction_info', schema);