var mongoose = require('mongoose');
var config = require('../config');
mongoose.Promise = global.Promise;
mongoose.connect(config.get("mongoose:uri"), {server:{auto_reconnect:true, socketOptions: { keepAlive: 1 }}});
mongoose.connection.on("open", function(){
    console.log("open");
});
mongoose.connection.on("error", function(){
    console.error(arguments);
})
mongoose.connection.on("disconnected", function(){
    console.warn("dicsonnected from mongo")
})
mongoose.connection.on("reconnected", function(){
    console.info("connected to mongo")
})
module.exports = mongoose;