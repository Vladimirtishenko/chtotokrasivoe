var dateToStart = require('../middleware/services/configOptions'),
    mongoose = require('../lib/mongoose'),
    ordersBucket = require('../middleware/modules/Orders/models/SchemaModel'),
    async = require("async"),
    orders = require('../models/order_save'),
    Rules = require('../models/rules'),
    Currency = require('../models/currency'),
    AuctionInfo = require('../models/auction_info'),
    AuctionDelivery = require('../models/info_delivery'),
    request = require('request'),
    useragent = require('useragent'),
    cheerio = require('cheerio');

module.exports.get = function(req, res, next) {

    var view = req.originalUrl.slice(1),
        agent = useragent.is(req.headers['user-agent']),
        timeDiff = req.session.timeDiff;

    if (req.session.user) {

        async.parallel({
            currency: function(callback) {
                currency(callback);
            },
            date: function(callback) {
                dataTry(callback);
            },
            orders: function (callback) {
                dataOrders(callback);
            },
            bucket: function (callback) {
                AuctionTry(callback);
            },
            rules: function (callback) {
                getRules(callback);
            },
            auction_info: function (callback) {
                auctionInfo(callback);
            },
            delivery_info: function (callback) {
                deliveryInfo(callback);
            }
        }, function(err, result) {
 
            if (view == 'privat' && typeof result.orders == 'object') {
                var paid = [],
                    unpaid = [],
                    cancel = [],
                    success = [],
                    processed = [];

                for (var i = 0; i < result.orders.length; i++) {
                    if (result.orders[i].status == 0) {
                        unpaid.push(result.orders[i]);
                    } else if (result.orders[i].status == 1) {
                        paid.push(result.orders[i]);
                    } else if (result.orders[i].status == 2) {
                        success.push(result.orders[i]);
                    } else if (result.orders[i].status == 3) {
                        cancel.push(result.orders[i]);
                    } else if (result.orders[i].status == 4){
                        processed.push(result.orders[i]);
                    }
                }

            }

            var $; 

            try{
                $ = cheerio.load(result.auction_info.text);
            } catch(e){
                $ = null;
            }

            res.render(view, {
                title: "Что-то красивое - Модные аукционы",
                currency: result.currency.currency,
                curencyUser: getCurrencyForUser(result.currency.currency, req.session.user),
                currencyValue: req.session.user.country == 1 ? "грн." : "руб.",
                // Bucket 
                bucketPrice: result.bucket.priseSum,
                bucketCount: result.bucket.count,
                // Date
                date: result.date || "",
                // Orders 
                data: result.bucket.data,
                ordersPaid: (paid && paid.length != 0) ? paid : null,
                ordersUnpaid: (unpaid && unpaid.length != 0) ? unpaid : null,
                ordersCancel: (cancel && cancel.length != 0) ? cancel : null,
                ordersSuccess: (success && success.length != 0) ? success : null,
                ordersProcessed: (processed && processed.length != 0) ? processed : null,
                // Session User
                sessionUser: req.session.user,
                // Text
                rules: result.rules,
                auctions_info: result.auction_info,
                auctions_info_sliced: $ ? $.text().slice(0, 105) + "..." : "Нет никакой информации!!!", 
                delivery_info: result.delivery_info,
                // User Agent
                agent: agent,
                // Time 
                timeDiff: timeDiff || 0
            });
        });

    } else {

         async.parallel({
            currency: function(callback) {
                currency(callback);
            },
            date: function(callback) {
                dataTry(callback);
            },
            rules: function (callback) {
                getRules(callback);
            },
            auction_info: function (callback) {
                auctionInfo(callback);
            },
            delivery_info: function (callback) {
                deliveryInfo(callback);
            }
        }, function(err, result) {

            var $; 

            try{
                $ = cheerio.load(result.auction_info.text);
            } catch(e){
                $ = null;
            }

            res.render(view, {
                title: "Что-то красивое - Модные аукционы",
                currency: result.currency.currency,
                date: result.date || "",
                rules: result.rules,
                auctions_info: result.auction_info,
                auctions_info_sliced: $ ? $.text().slice(0, 105) + "..." : "Нет никакой информации!!!", 
                delivery_info: result.delivery_info,
                sessionUser: null,
                timeDiff: timeDiff || 0
            });


        })

    }

    function currency(callback) {
        
        Currency.findOne({}, function (err, result) {
            if(err) {next(err)}

            var date = new Date(),
                today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf();


            if(!result || result.date < today){
                
                request('https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22USDRUB,USDUAH%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys', function (error, response, body) {

                    if(error) { next(error); }

                    var json = JSON.parse(body).query.results.rate;

                    
                    Currency.findOneAndUpdate({}, {
                        date: today,
                        currency: generateCurrency(json),
                    }, {upsert: true, new: true, returnNewDocument: true}, function (er, result) {
                        callback(null, result);
                    }); 


                });

            } else {
                callback(null, result);
            }

        })

    }

    function generateCurrency(result) {
        
        var currency = {};

        for (var i = 0; i < result.length; i++) {
            currency[result[i]['id']] = {
                id: result[i]['id'],
                rate: result[i]['Ask'],
                country: result[i]['id'] == 'USDRUB' ? 2 : 1,
                mark: result[i]['Name']
            }
        }

        return currency;

    }

    function getCurrencyForUser(currency, user){

        for(var k in currency){
            if(currency[k].country == [user.country]) {
                return currency[k].rate;
            }
        }

    }

    function dataTry(callback) {

        dateToStart.getOption('date', function(err, result) {
            if (err) next(err);
            var params = result && result.params ? result.params : null;
            callback(null, params);
        });

    }

    function dataOrders(callback) {
        orders.find({ "userId": req.session.user }, function(err, orders) {
            if (err) next(err);
            callback(null, orders);
        }).sort({orderNumber: -1});

    }

    function AuctionTry(callback) {

        ordersBucket.find({ userId: req.session.user._id }, function(err, data) {
            var priseSum = 0,
                count = 0;

            for (var i = 0; i < data.length; i++) {
                count += data[i].count;
                priseSum += parseInt(data[i].finalePrice) * data[i].count;
            }

            callback(null, {priseSum: priseSum, count: count, data: view == 'privat' ? data : null});


        })

    }

    function getRules(callback) {
        Rules.findOne({}, function(err, rules) {
            if (err) next(err);
            callback(null, rules || {});
        })
    }

    function auctionInfo(callback) {
        AuctionInfo.findOne({}, function(err, auctions_info) {
            if (err) next(err);
            callback(null, auctions_info || {});
        })
    }

    function deliveryInfo(callback) {
        AuctionDelivery.findOne({}, function(err, delivery_info) {
            if (err) next(err);
            callback(null, delivery_info || {});
        })
    }


}
