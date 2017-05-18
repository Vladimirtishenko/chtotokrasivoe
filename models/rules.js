var mongoose = require('../lib/mongoose');
var schema = new mongoose.Schema({
    fieldId: { type: Number, default: 0 },
    text: String
}, { collection: 'rules' });
// Model
module.exports = mongoose.model('rules', schema);