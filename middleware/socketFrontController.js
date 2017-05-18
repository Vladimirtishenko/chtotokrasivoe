var aucMod = require('./modules/Auction/AuctionModule');
var prodModule = require('./modules/Product/ProductModule');
var usersClass = require('./modules/Users/UsersModule');
var orderClass = require('./modules/Orders/OrdersModule');
var auctionModule = new aucMod();
var productsModule = new prodModule();
var usersModule = new usersClass();
var ordersModule = new orderClass();
var configOptions = require('./services/configOptions');
var socketClient = require('./services/socketClient');
var loadProductSleepTime = 5; // if product did not loaded server slepp for $ sec

function socketFrontController(io){
    this.io = io;
    //set starting data
    this.limit = 4;
    this.offset = 0;
    this.productsPull = {};
    this.auctionsPull = {};
    this.locksAuctions = {};
    this.curAuction = null;
    this.isTimerForLoadSet = false;
    productsModule.setListenere("productsLoaded",this.setProductList.bind(this));
    auctionModule.setListenere("finishAuction",this.sendNotifyThatAuctionFinished.bind(this));
    auctionModule.setListenere("auctionUpdated",this.notifyAuctionUpdated.bind(this));
    auctionModule.setListenere("startAuction",this.notifyAuctionStarted.bind(this));
    auctionModule.setListenere("pretendentAdded",this.notifyPretendentAdded.bind(this));
    //initialyze client connection
    io.on('connection', function(socket){
        var newClient = new socketClient(socket);
        newClient.setErrorHandler(this.onError.bind(this));
        newClient.setEvent('login', this.login.bind(this));
        newClient.setEvent('register_user', this.register_user.bind(this));
        newClient.setEvent('baseBuy', this.baseBuy.bind(this));
        newClient.setEvent('getCurrentAuction', this.getCurrentAuction.bind(this));
        newClient.setEvent('getAuctions', this.getAuctions.bind(this));
        newClient.setEvent('upCount', this.upCount.bind(this));
        newClient.setEvent('upPrice', this.upPrice.bind(this));
        newClient.setEvent('getCurrentTime', this.getCurrentTime.bind(this));
        newClient.setEvent('reloadAuction', this.reloadAuction.bind(this));
        newClient.setEvent('setClientTime', this.setClientTime.bind(this));
    }.bind(this));
    io.on('error', function(err) {
        //here i change options
        console.log(err);
    });
    this.productLoad();
}
socketFrontController.prototype.setClientTime = function(client, data){
    if (data.time)
    {
        var d = new Date();
        var diff = Math.round((d.getTime() - data.time)/1000);
        client.setTimeDiff(diff);
    }
};


socketFrontController.prototype.initStart = function(){
    var self = this;

    configOptions.getOption('date', function(err, conf){
        if (conf && conf.params)
        {
            var d = new Date();
            var timeInt = d.getTime();
            if (conf.params <= timeInt && self.curAuction){
                configOptions.updateOption('date', null, function(err, data){
                    if (!err && data)
                    {
                        auctionModule.startAuction(self.curAuction);
                    }
                });
                return;
            }
            else{
                var keys = Object.keys(self.productsPull);
                if (keys.length < self.limit && self.isTimerForLoadSet === false)
                {
                    self.isTimerForLoadSet = setTimeout(self.productLoad.bind(self),1000*10);
                }
                setTimeout(self.initStart.bind(self),1000*loadProductSleepTime);
            }
        }
        else{
            if (!self.curAuction)
            {
                var now = new Date();
                now.setDate(now.getDate()+14);
                configOptions.updateOption('date', now.getTime(), function(err, res){
                    if (!err)
                    {
                        this.sendToAll(this.createMessage('AuctionFinishedDataChanged', {"nextStartTime" : now.getTime()}));
                    }
                }.bind(self));
            }
            else
            {
                auctionModule.startAuction(self.curAuction);
            }
        }
    });
}

socketFrontController.prototype.login = function(client, data){
    if (client.isAutorize())
    {       
        client.socket.emit('serverMessage', this.createMessage('login', client.getUserData()));
    }
    //set listner for completed autorization
    usersModule.setListenere("autoryzeCompleted",function(event, data){
        var err;
        if (!data)
        {
            err = this.createError(401,"not autorize");
        }
        else{
            client.setUserData(data);
        }
        client.socket.emit('serverMessage', this.createMessage('login', data, err));
        usersModule.unsetListener(event);
    }.bind(this));

    //call autorization
    usersModule.autoryze(data.email, data.pass);
}

socketFrontController.prototype.register_user = function(client, data){
    //set listner for completed creating user
    usersModule.setListenere("userCreated",function(event, data){
        client.socket.emit('serverMessage', this.createMessage('register_user', data));
        usersModule.unsetListener(event);
    }.bind(this));

    //call registration
    usersModule.registerUser(data.email, data.pass, data.city);
}

socketFrontController.prototype.getAuctions = function(client, data){
    var auctions = JSON.parse(JSON.stringify(this.auctionsPull));
    delete auctions[this.curAuction];
    client.socket.emit('serverMessage', this.createMessage('getAuctions', auctions));
}

socketFrontController.prototype.getCurrentAuction = function(client, data){
    var curr = this.auctionsPull[this.curAuction] || auctionModule.getCurrent();
    return client.socket.emit('serverMessage', this.createMessage('getCurrentAuction', curr));
}
socketFrontController.prototype.baseBuy = function(client, data){
    var action = 'baseBuy';
    if (!client.isAutorize())
    {
        return this.sendNotAutorize(client, action);
    }
    var err;
    var auc = auctionModule.getCurrent();
    if (this.isLockAuction(auc._uid))
    {
        return this.sendLockError(client, action);
    }
    this.lockAuction(auc._uid);
    var response = {result: 'success', id: auc._uid, price: auc.currentPrice};
    if (auc._uid != data.auction_id)
    {
        response = null;
        err = this.createError(404, 'Auction with auction_id = '+data.auction_id+' not found');
    }
    else if (!auctionModule.setPretendent(auc._uid, client.getUserData()))
    {
        response = null;
        err = this.createError(304, 'You are already pretendent for this lot');
    }
    this.unlockAuction(auc._uid);
    client.socket.emit('serverMessage', this.createMessage(action, response, err));
};
//Lock auction section
//---------------------------------------------------------------
socketFrontController.prototype.lockAuction = function(uid)
{
    this.locksAuctions[uid] = 1;
};
socketFrontController.prototype.unlockAuction = function(uid)
{
    delete this.locksAuctions[uid];
};
socketFrontController.prototype.isLockAuction = function(uid)
{
    return this.locksAuctions[uid];
};
socketFrontController.prototype.sendLockError = function(client, action)
{
    var err = this.createError(405, 'Someone already working with auction');
    client.socket.emit('serverMessage', this.createMessage(action, null, err));
};
//---------------------------------------------------------------
socketFrontController.prototype.upCount = function(client, data){
    var action = 'upCount';
    if (!client.isAutorize())
    {
        return this.sendNotAutorize(client, action);
    }
    var response = true;
    var err;
    var auc = auctionModule.getCurrent();
    if (this.isLockAuction(auc._uid))
    {
        return this.sendLockError(client, action);
    }
    this.lockAuction(auc._uid);
    if (auc._uid != data.auction_id)
    {
        response = null;
        err = this.createError(404, 'Auction with auction_id = '+data.auction_id+' not found');
    }
    else if (!data.count)
    {
        response = null;
        err = this.createError(400, 'Incorrect "count" parameter');
    }
    else if (this.productsPull[auc.lot._id].countInWarehouse < data.count
        || !auctionModule.setCount(auc._uid, data.count, client.getUserData()))
    {
        response = null;
        err = this.createError(304, 'Incorrect request');
    }
    this.unlockAuction(auc._uid);
    client.socket.emit('serverMessage', this.createMessage(action, response, err));
};


socketFrontController.prototype.upPrice = function(client, data){
    var action = 'upPrice';
    if (!client.isAutorize())
    {
        return this.sendNotAutorize(client, action);
    }
    var response = true;
    var err;
    var auc = auctionModule.getCurrent();
    if (this.isLockAuction(auc._uid))
    {
        return this.sendLockError(client, action);
    }
    this.lockAuction(auc._uid);
    if (auc._uid != data.auction_id)
    {
        response = null;
        err = this.createError(404, 'Auction with auction_id = '+data.auction_id+' not found');
    }
    else if (!data.price)
    {
        response = null;
        err = this.createError(400, 'Incorrect "count" parameter');
    }
    else if (!auctionModule.setPrice(auc._uid, data.price, client.getUserData()))
    {
        response = null;
        err = this.createError(304, 'Incorrect request');
    }
    this.unlockAuction(auc._uid);
    client.socket.emit('serverMessage', this.createMessage(action, response, err));
};

socketFrontController.prototype.createMessage = function(action, params, errorMess){
    var mess = {
        action: action,
        data: params
    };
    if (errorMess)
    {
        mess.error = errorMess;
    }
    return mess;
};

socketFrontController.prototype.createError = function(code, message){
    return {errorCode: code, errorMessage: message};
};

socketFrontController.prototype.productLoad = function(){
    var keys = Object.keys(this.productsPull);
    var keysAuc = Object.keys(this.auctionsPull);
    if (keysAuc.length >= this.limit )
    {
        return;
    }
    var limit = this.limit;
    if (keysAuc.length)
    {
        limit = this.limit - keysAuc.length;
    }
    limit = (limit <= 0) ? 1 : limit;
    productsModule.loadProducts(this.offset, limit);
    this.isTimerForLoadSet = false;
}

socketFrontController.prototype.setProductList = function(event, products){
    //productsModule.createProduct(this.pro);
    var newProducts = [];
    if (products && products.length > 0)
    {
        for(var i = 0; i < products.length; i++)
        {
            if (!this.productsPull[products[i]._id])
            {
                this.productsPull[products[i]._id] = products[i];
                newProducts.push(products[i]);
            }
        }
    }

    if (newProducts.length > 0)
    {
        this.offset += newProducts.length;
        this.setAuctionList(newProducts);
    }
    else
    {
        this.offset = 0;
        var aucKeys = Object.keys(this.auctionsPull);
        if (this.isTimerForLoadSet === false)
        {
            this.isTimerForLoadSet = setTimeout(this.productLoad.bind(this),1000*loadProductSleepTime);
        }
    }
};

socketFrontController.prototype.setAuctionList = function(products){
    for(var i in products)
    {
        if (products.hasOwnProperty(i))
        {
            var auc = auctionModule.createAuction(products[i], products[i].auctionPrice);
            this.auctionsPull[auc._uid] = auc;
        }
    }
    var keys = Object.keys(this.auctionsPull);
    if (typeof keys[0] !== 'undefined' && !auctionModule.getCurrent())
    {
        this.curAuction = this.auctionsPull[keys[0]]._uid;
        this.initStart();
    }
    this.sendToAllGeAuctions();
}

socketFrontController.prototype.sendToAllGeAuctions = function(){
    var auctions = JSON.parse(JSON.stringify(this.auctionsPull));
    delete auctions[this.curAuction];
    this.sendToAll(this.createMessage('getAuctions', auctions));
}

socketFrontController.prototype.sendNotifyThatAuctionFinished = function(event, data){
    this.sendToAll(this.createMessage('auctionFinished', data));
    productsModule.setListenere("productUpdated",function(event, product)
    {
        productsModule.unsetListener(event);
        var keys = Object.keys(this.productsPull);
        if (keys.length < this.limit && this.isTimerForLoadSet === false)
        {
            this.isTimerForLoadSet = 1;
            this.productLoad();
        }
    }.bind(this));
    var auction = this.auctionsPull[data._uid];
    var countIwWarehouse = auction.lot.countInWarehouse - auction.count;
    if (data.winner && Object.keys(data.winner).length > 0)
    {
        var winKeys = Object.keys(data.winner);
        var prod = this.productsPull[data.lot._id];
        prod = JSON.parse(JSON.stringify(prod));
        countIwWarehouse = data.lot.countInWarehouse - (data.count * winKeys.length);
        auction.lot.countInWarehouse = countIwWarehouse;
        var updata = {
            _id: data.lot._id,
            countInWarehouse: auction.lot.countInWarehouse
        };
        productsModule.setListenere("productUpdated",function(event, product)
        {
            productsModule.unsetListener(event);
            for (var i = 0; i < winKeys.length; i++)
            {
                ordersModule.createOrder(
                    data.winner[winKeys[i]]._id,
                    data._id,
                    prod,
                    data.count,
                    data.price
                );
            }
        });
        productsModule.updateProduct(updata);
    }

    if (countIwWarehouse >= 0)
    {
        if (!data.winner || Object.keys(data.winner).length == 0)
        {
            auction.lot.unsoldCount += auction.count;
            auction.lot.countInWarehouse = countIwWarehouse;
            var updata = {
                _id: data.lot._id,
                countInWarehouse: auction.lot.countInWarehouse,
                unsoldCount: auction.lot.unsoldCount
            };
            productsModule.updateProduct(updata);
        }
        if (countIwWarehouse > 0)
        {
            sleep(3000);
            return this.initStart();
        }
    }
    delete this.productsPull[data.lot._id];
    delete this.auctionsPull[data._uid];
    auctionModule.removeAuction(data._uid);
    productsModule.removeProduct(data.lot._uid);
    //wait 3 sec besore start new auction
    sleep(3000);

    var keys = Object.keys(this.auctionsPull);
    if (typeof keys[0] !== 'undefined')
    {
        this.curAuction = this.auctionsPull[keys[0]]._uid;
        this.initStart();
    }
    else
    {
        this.curAuction = null;
        this.initStart();
    }
    this.sendToAllGeAuctions();
}

socketFrontController.prototype.notifyAuctionUpdated = function(event, data){
    this.sendToAll(this.createMessage('auctionUpdated', data));
}

socketFrontController.prototype.notifyAuctionStarted = function(event, data){    
    this.sendToAll(this.createMessage('actionStarted', data));
}

socketFrontController.prototype.sendToAll = function(message){
    this.io.sockets.emit('serverMessage', message);
}
socketFrontController.prototype.sendNotAutorize = function(client, action){
    var mes = this.createError(401, "not autorize");
    client.socket.emit('serverMessage', this.createMessage(action, null, mes));
}
socketFrontController.prototype.notifyPretendentAdded = function(event, data)
{
    this.sendToAll(this.createMessage('pretendentAdded', data));
}

socketFrontController.prototype.onError = function(client, action, errors){
    var mes = this.createError(500, "server error");
    client.socket.emit('serverMessage', this.createMessage(action, null, mes));
}

socketFrontController.prototype.getCurrentTime = function(client, data){
    var t = new Date().getTime();
    client.socket.emit('serverMessage', this.createMessage('getCurrentTime', {time:t}));
}

socketFrontController.prototype.reloadAuction = function(client, data){
    this.productsPull = {};
    this.current = null;
    this.offset = 0;
    this.auctionsPull = {};
    auctionModule.removeAll();
    productsModule.removeAll();
    this.sendToAll(this.createMessage('reloadAuction', {}));
    setTimeout(function(){
        var curr = this.auctionsPull[this.curAuction] || auctionModule.getCurrent();
        var mes = this.createMessage('getCurrentAuction', curr);
        return this.sendToAll(mes);
    }.bind(this),1000*(loadProductSleepTime+2));
    this.isTimerForLoadSet = false;
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

module.exports = socketFrontController;