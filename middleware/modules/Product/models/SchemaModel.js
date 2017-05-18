/**
 * Created by maxim.bondarenko on 07/11/2016.
 */
var mongoose = require('../../../../lib/mongoose');
var schema = mongoose.Schema({
    art: {type: String, default: "Нет артикула"},
    title:String,
    description: String,
    src: String,
    size: String,
    color: String,
    consistOf: String,
    material: String,
    countInWarehouse: {type: Number, default: 1},
    auctionPrice: {type: Number, default: 100},
    price: {type: Number, default: 0},
    priority: {type: Number, default: 0},
    unsoldCount: {type: Number, default: 0},
    date: Date
}, { collection: 'goods' });
// Model
module.exports = mongoose.model('goods', schema);