var parent = require('../../core/module');
var ordertModelClass = require('./models/Orders');
var ordertModel = new ordertModelClass();
var http = require('http');

function OrdersModule() {
    parent.apply(this, arguments);
    this.events = ['orderCreated'];
}

OrdersModule.prototype = Object.create(parent.prototype);
OrdersModule.prototype.constructor = OrdersModule;


OrdersModule.prototype.createOrder = function(userID, auctionID, prod, lotCount, lotPrice) {
    var order = ordertModel.createEntity({
            userId: userID,
            auctionId: auctionID,
            product: prod,
            count: lotCount,
            finalePrice: lotPrice
        }
    );
    ordertModel.saveToStorage(order, function(createdProd) {
        this.dispatchEvent('orderCreated', createdProd);
    }.bind(this));
};
module.exports = OrdersModule;
