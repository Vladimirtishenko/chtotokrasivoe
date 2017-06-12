var parent = require('../../core/module');
var auctionClass = require('./models/Auction');
var auctionModel = new auctionClass();
function AuctionModule() {
    parent.apply(this, arguments);
    this.started = null;
    this.events = ['startAuction','finishAuction', 'auctionUpdated', 'pretendentAdded'];
    this.auctionTimer = 30;
    this.upPrice = 1;
}

AuctionModule.prototype = Object.create(parent.prototype);
AuctionModule.prototype.constructor = AuctionModule;

AuctionModule.prototype.createAuction = function(product, basePrice){
    var data = {
        lot: product,
        basePrice: basePrice,
        price: basePrice,
        currentPrice: basePrice,
        nextPrice: basePrice + this.upPrice,
        count: 1
    };
    return auctionModel.createEntity(data);
};
AuctionModule.prototype.setToExpired = function(auction){
    var predKeys = Object.keys(auction.pretendents);
    if (predKeys.length > 0 && auction.newPretendentInit === false)
    {
        auction.price = auction.currentPrice;
        auction.currentPrice = auction.nextPrice;
        auction.nextPrice += this.upPrice;
        auction.newPretendentInit = true;
        auctionModel.setTimer(auction, this.auctionTimer, this.setToExpired.bind(this));
        var mess = "Auction for lot - "+auction.lot._id+". Updated timer";
        this.dispatchEvent('auctionUpdated', auction, mess);
    }
    else
    {
        auction.winner = this.getWinner(auction._uid);
        var mess = "Auction for lot - "+auction.lot._id+" was finished";
        this.started = null;
        this.dispatchEvent('finishAuction', auction, mess);
    }
};
//TODO:: set it to model
AuctionModule.prototype.removeAuction = function(uid){
    if (this.started && this.started._uid == uid)
    {
        this.started = null;
    }
    auctionModel.removeEntity(uid);
};
AuctionModule.prototype.startAuction = function(uid){
    if (this.started && this.started._uid == uid)
    {
        return false;
    }
    var auction = auctionModel.getEntity(uid);
    //set default data
    auction.price = auction.basePrice;
    auction.count = 1;
    auction.currentPrice = auction.basePrice;
    auction.nextPrice =  auction.basePrice + this.upPrice;
    auction.winner = null;
    auction.pretendents = {};
    auction.newPretendentInit = false;
    //
    auctionModel.setTimer(auction, this.auctionTimer, this.setToExpired.bind(this));
    this.started = auction;
    var mess = "Auction for lot - "+auction.lot._id+" was started. currentPrice - "+auction.currentPrice;
    this.dispatchEvent('startAuction', auction, mess);
};
AuctionModule.prototype.getCurrent = function(){
    return this.started;
};

AuctionModule.prototype.setPretendent = function(uid, user, action){
    action = action || 'setPretendent';
    var auction = auctionModel.getEntity(uid);
    if (auction.newPretendentInit)
    {
        auction.pretendents = {};
    }
    if (!auction.pretendents[auction.currentPrice])
    {
        auction.pretendents[auction.currentPrice] = {};
    }
    if (typeof auction.pretendents[auction.currentPrice][user._id] !== 'undefined')
    {
        return false;
    }

    auction.newPretendentInit = false;
    auction.pretendents[auction.currentPrice][user._id] = user;
    auction.price = auction.currentPrice;
    var mess = "New pretendent - "+user._id+". Price - "+auction.currentPrice;
    this.dispatchEvent('pretendentAdded', auction, mess, action);
    return true;
};

AuctionModule.prototype.setCount = function(uid, count, user){
    var action = 'setCount';
    var auction = auctionModel.getEntity(uid);
    var auc_count = auction.count;
    if (!auction || auction.count > count)
    {
        return false;
    }
    else if (auction.count == count)
    {
        return this.setPretendent(uid, user, action);
    }
    auction.count = count;
    auction.newPretendentInit = true;
    var res = this.setPretendent(uid, user, action);
    if (res)
    {
        auctionModel.updateTimer(auction, this.auctionTimer);
        var mess = "Pretendent updated auction - "+auction.lot._id+" count";
        this.dispatchEvent('auctionUpdated', auction, mess);
    }
    else
    {
        auction.count = auc_count;
    }
    return res;
};

AuctionModule.prototype.setPrice = function(uid, price, user){
    var action = 'setPrice';
    var auction = auctionModel.getEntity(uid);
    if (!auction)
    {
        return false;
    }
    auction.price = auction.price + price;
    auction.currentPrice = auction.currentPrice + price;
    auction.nextPrice = auction.currentPrice + this.upPrice;
    auction.newPretendentInit = true;
    if ( this.setPretendent(uid, user, action))
    {
        auctionModel.updateTimer(auction, this.auctionTimer);
        var mess = "Pretendent updated auction - "+auction.lot._id+" price";
        this.dispatchEvent('auctionUpdated', auction, mess);
        return true;
    }
    else{
        auction.price = auction.price - price;
        auction.currentPrice = auction.currentPrice - price;
        auction.nextPrice = auction.currentPrice + this.upPrice;
        auction.newPretendentInit = false;
        return false;
    }
};

AuctionModule.prototype.getWinner = function(uid){
    var auction = auctionModel.getEntity(uid);
    if (!auction || !auction.pretendents[auction.price])
    {
        return null;
    }
    var keys = Object.keys(auction.pretendents[auction.price]);
    var winners = (keys.length > 0) ? {} : null;
    shuffle(keys);
    var winnerCounts = Math.floor(auction.lot.countInWarehouse / auction.count);

    keys = keys.slice(0, winnerCounts);
    for (var i = 0; i < keys.length; i++)
    {
        winners[keys[i]] = auction.pretendents[auction.price][keys[i]]
    }
    return winners || null;
};

AuctionModule.prototype.dispatchEvent = function(eventName, auction, historyMessage, action){
    action = action || null;
    auction = auctionModel.getEntity(auction._uid) || auction;
    auction.history.push({action:eventName, data:historyMessage});
    var sended = JSON.parse(JSON.stringify(auction));
    delete sended.history;
    sended.pretendents = sended.pretendents[sended.price] || {};
    sended.action = action;
    if (eventName == 'startAuction')
    {
        auction.status = 'started';
        sended.status = 'started';
        var dateSt = new Date();
        auction.stDateTime = dateSt.toString();
        return this._base_dispatchEvent(eventName, sended);
    }
    if (eventName == 'finishAuction')
    {
        var dateFin = new Date();
        auction.status = 'finished';
        sended.status = 'finished';
        auction.finDateTime = dateFin.toString();
        if (auction.winner && auction.winner._id)
        {
            auctionModel.saveToStorage(auction, function(result){
                if (result)
                {
                    sended._id = result._id;
                    this._base_dispatchEvent(eventName, sended);
                }
                //auctionModel.removeEntity(auction._uid);
            }.bind(this))
        }
        else{
            //auctionModel.removeEntity(auction._uid);
            this._base_dispatchEvent(eventName, sended);
        }
        return;
    }
    else{
        return this._base_dispatchEvent(eventName, sended);
    }
};
AuctionModule.prototype._base_dispatchEvent = parent.prototype.dispatchEvent;

AuctionModule.prototype.removeAll = function(){
    if (this.started && this.started._uid)
    {
        this.removeAuction();
    }
    auctionModel.clearTable();
}


module.exports = AuctionModule;

/**
 * Shuffles array in place.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}