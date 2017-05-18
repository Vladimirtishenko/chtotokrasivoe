var parent = require('../../core/module');
var productClass = require('./models/Product');
var productModel = new productClass();
var http = require('http');
function ProductModule() {
    parent.apply(this, arguments);
    this.events = ['productsLoaded','productCreated', 'productUpdated'];
}

ProductModule.prototype = Object.create(parent.prototype);
ProductModule.prototype.constructor = ProductModule;

//TODO:: add module for requests
ProductModule.prototype.loadProducts = function(offset, limit){
    productModel.getEntityCollection(offset, limit, function(productColl)
    {
        this.dispatchEvent('productsLoaded', productColl);
    }.bind(this));
};

ProductModule.prototype.createProduct = function(productData){
    var product = productModel.createEntity(productData);
    productModel.saveToStorage(product, 'create', function(createdProd)
    {
        this.dispatchEvent('productCreated', createdProd);
    }.bind(this));
};

ProductModule.prototype.updateProduct = function(productData){
    productModel.saveToStorage(productData, 'update', function(updatedProd)
    {
        this.dispatchEvent('productUpdated', updatedProd);
    }.bind(this));
};


ProductModule.prototype.getProducts = function(uid, offset, limit){
    return productModel.table;
};

ProductModule.prototype.removeAll = function(){
    productModel.clearTable();
};
ProductModule.prototype.removeProduct = function(uid){
    productModel.removeEntity(uid);
};

module.exports = ProductModule;