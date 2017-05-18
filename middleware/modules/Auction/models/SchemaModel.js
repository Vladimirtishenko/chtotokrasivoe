/**
 * Created by maxim.bondarenko on 07/11/2016.
 */
var mongoose = require('../../../../lib/mongoose');
var schema = mongoose.Schema({
    productId:String,
    image:String,
    title:String,
    size:String,
    finalePrice: {type: Number, default: 1},
    status:String,
    winnersUserId:[{type: String}],
    stDateTime: Date,
    finDateTime: Date,
    count: {type: Number, default: 1},
    history:  [{
        action: String,
        data: String
    }]
}, { collection: 'auctions' });
// Model
module.exports = mongoose.model('auctions', schema);