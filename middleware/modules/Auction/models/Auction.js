var parent = require('../../../core/model');
var mongoose = require('../../../../lib/mongoose');
var dProv = require('./SchemaModel');
function Auction() {
    parent.apply(this, arguments);
    // Model
    this.dataProvider = dProv;
    this.entityData = {
        lot: {},
        stDateTime: null,
        finDateTime: null,
        count: 1,
        basePrice: 0,
        price: 0,
        currentPrice: 0,
        nextPrice: 0,
        pretendents: {},
        winner: {},
        status: 'new',
        newPretendentInit: false,
        history: [],
        timer: 0,
        finishedTime: 0
    }
}
Auction.prototype = Object.create(parent.prototype);
Auction.prototype.setTimer = function(entity, timer, callback)
{
    entity.timer = timer;
    entity.finishedTime = this.getCurrTime() + entity.timer * 1000;
    var interval = null;
    var func = function(){
        entity.timer--;
        var d = new Date().getTime();
        //console.log(entity.timer);
        //if (entity.timer == 0)
        if (d >= entity.finishedTime)
        {
            clearInterval(interval);

            callback(entity);
        }
    };
    interval = setInterval(func,1000);
};

Auction.prototype.updateTimer = function(entity, timer)
{
    entity.timer = timer;
    entity.finishedTime = this.getCurrTime() + entity.timer * 1000;
};

Auction.prototype.getCurrTime = function()
{
    return new Date().getTime();
}

Auction.prototype.saveToStorage = function(entity, callback)
{
    var data = {
        productId: entity.lot._id,
        image: entity.lot.src,
        title: entity.lot.title,
        finalePrice: entity.price,
        status: entity.status,
        winnersUserId: (Object.keys(entity.winner).length > 0 ) ? [] : null,
        stDateTime: entity.stDateTime,
        finDateTime: entity.finDateTime,
        history: entity.history,
        count: entity.count
    };
    for(var key in entity.winner)
    {
        if (entity.winner.hasOwnProperty(key) )
        {
            data.winnersUserId.push(entity.winner[key]._id);
        }
    }

    this.dataProvider.create(data,function(err, result){
        if(err) return callback(false);
        return callback(result);
    });
    return;
};

module.exports = Auction;