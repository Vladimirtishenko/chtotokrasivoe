var mongoose = require('../lib/mongoose');
var schema = new mongoose.Schema({
    fieldId: { type: Number, default: 0 },
    text: String
}, { collection: 'info_delivery' });
// Model
module.exports = mongoose.model('info_delivery', schema);