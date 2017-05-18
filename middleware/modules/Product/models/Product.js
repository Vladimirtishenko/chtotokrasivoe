var parent = require('../../../core/model');
var mongoose = require('../../../../lib/mongoose');
var dProv = require('./SchemaModel');
function Product() {
    parent.apply(this, arguments);
    // Model
    this.dataProvider = dProv;
    this.entityData = {
        _id: 0,
        title: '',
        description: '',
        src: '',
        size: '',
        color: '',
        consistOf: '',
        material: '',
        countInWarehouse: 0,
        auctionPrice: 0,
        price: 0,
        priority: false
    }
}
Product.prototype = Object.create(parent.prototype);
Product.prototype.getEntity = function(id, callback)
{
    this.dataProvider.findOne({_id: email}, function(err, product) {
        if(err) return callback(err);
        return callback(product);
    });
};

Product.prototype.getEntityCollection = function(ofsset, lim, callback)
{
    ofsset = ofsset || 0;
    var query = this.dataProvider.find()
        .where('countInWarehouse').gt(0).sort({"priority": -1, "date" : -1}).skip(ofsset);
    if (lim && lim > 0)
    {
        query.limit(lim);
    }
    query.exec(function(err, productColl) {
        //TODO: create error handler with AppServerError;
        if(err) return callback(err);
        return callback(productColl);
    });
};

Product.prototype.saveToStorage = function(entity, action, callback)
{
    if (action == 'create')
    {
        delete  entity._id;
        this.dataProvider.create(entity, function(err, newProd) {
            if(err) return callback(err);
            return callback(newProd);
        });
        return;
    }
    if (action == 'update')
    {
        this.dataProvider.update({_id: entity._id}, entity,function(err, prod) {
            if(err) return callback(err);
            return callback(entity);
        });
        return;
    }
    this.__throwError("Error 'saveToStorage' ","Action parameter incorrect", 1);
};
module.exports = Product;