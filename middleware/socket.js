//var config = require('./config/http');
//var io = require('socket.io').listen(config.port);
var ctrl = require('./socketFrontController');
//new ctrl(io);
var aucMod = require('./modules/Auction/AuctionModule');
var prodModule = require('./modules/Product/ProductModule');
var auctionModule = new aucMod();
var productsModule = new prodModule();

function socketFrontController(io){
    productsModule.setListenere("productsLoaded",ctrl.setAuctionList);
    auctionModule.setListenere("finishAuction",ctrl.sendNotifyThatAuctionFinished);
    io.on('connection', ctrl);
}