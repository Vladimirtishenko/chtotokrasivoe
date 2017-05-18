var dateToStart = require('../middleware/services/configOptions'),
    mongoose = require('../lib/mongoose'),
    ordersBucket = require('../middleware/modules/Orders/models/SchemaModel'),
    async = require("async"),
    orders = require('../models/order_save'),
    Rules = require('../models/rules'),
    AuctionInfo = require('../models/auction_info'),
    AuctionDelivery = require('../models/info_delivery'),
    useragent = require('useragent'),
    cheerio = require('cheerio');

module.exports.get = function(req, res, next) {

    var view = req.originalUrl.slice(1),
        agent = useragent.is(req.headers['user-agent']),
        timeDiff = req.session.timeDiff;


    if (req.session.user) {

        async.waterfall([
            dataTry,
            dataOrders,
            AuctionTry,
            getRules,
            auctionInfo,
            deliveryInfo
        ], function(err, result) {

            if (view == 'privat' && typeof result.data.orders == 'object') {
                var paid = [],
                    unpaid = [],
                    cancel = [],
                    success = [],
                    processed = [];


                console.log(result.data.orders);

                for (var i = 0; i < result.data.orders.length; i++) {
                    if (result.data.orders[i].status == 0) {
                        unpaid.push(result.data.orders[i]);
                    } else if (result.data.orders[i].status == 1) {
                        paid.push(result.data.orders[i]);
                    } else if (result.data.orders[i].status == 2) {
                        success.push(result.data.orders[i]);
                    } else if (result.data.orders[i].status == 3) {
                        cancel.push(result.data.orders[i]);
                    } else if (result.data.orders[i].status == 4){
                        processed.push(result.data.orders[i]);
                    }
                }

            }

            var $; 

            try{
                $ = cheerio.load(result.auctions_info.text);
            } catch(e){
                $ = null;
            }

            res.render(view, {
                title: "Chechelyka - Модные аукционы",
                bucketPrice: result.data.priseSum,
                bucketCount: result.data.count,
                date: result.data.date || "",
                data: result.data.data,
                ordersPaid: (paid && paid.length != 0) ? paid : null,
                ordersUnpaid: (unpaid && unpaid.length != 0) ? unpaid : null,
                ordersCancel: (cancel && cancel.length != 0) ? cancel : null,
                ordersSuccess: (success && success.length != 0) ? success : null,
                ordersProcessed: (processed && processed.length != 0) ? processed : null,
                sessionUser: req.session.user,
                rules: result.rules,
                auctions_info: result.auctions_info,
                auctions_info_sliced: $ ? $.text().slice(0, 105) + "..." : "Нет никакой информации!!!", 
                delivery_info: result.delivery_info,
                agent: agent,
                timeDiff: timeDiff || 0
            });
        });

    } else {

        dataTry(function(err, data) {
            if (err) next(err);
            getRules(data, function(err, data) {
                if (err) next(err);
                auctionInfo(data, function(err, data) {
                    if (err) next(err);
                    deliveryInfo(data, function(err, data) {
                        if (err) next(err);
                        
                        var $; 

                        try{
                            $ = cheerio.load(data.auctions_info.text);
                        } catch(e){
                            $ = null;
                        }

                        console.log(req.session.timeDiff);

                        res.render(view, {
                            title: "Chechelyka - Модные аукционы",
                            date: data.data || "",
                            rules: data.rules,
                            auctions_info: data.auctions_info,
                            auctions_info_sliced: $ ? $.text().slice(0, 105) + "..." : "Нет никакой информации!!!", 
                            delivery_info: data.delivery_info,
                            sessionUser: null,
                            timeDiff: timeDiff || 0
                        });

                    })

                })

            })

        })

    }

    function dataTry(callback) {

        dateToStart.getOption('date', function(err, result) {
            if (err) next(err);
            var params = result && result.params ? result.params : null;
            callback(null, params);
        });

    }

    function dataOrders(date, callback) {
        orders.find({ "userId": req.session.user }, function(err, orders) {
            if (err) next(err);
            callback(null, date, orders);
        }).sort({orderNumber: -1});

    }

    function AuctionTry(date, orders, callback) {

        ordersBucket.find({ userId: req.session.user._id }, function(err, data) {
            var priseSum = 0,
                count = 0;

            for (var i = 0; i < data.length; i++) {
                count += data[i].count;
                priseSum += parseInt(data[i].finalePrice) * data[i].count;
            }

            callback(null, { date: date, orders: orders, priseSum: priseSum, count: count, data: view == 'privat' ? data : null });


        })

    }

    function getRules(data, callback) {
        Rules.find({}, function(err, rules) {
            if (err) next(err);
            callback(null, { data: data, rules: rules[0] || {} });
        })
    }

    function auctionInfo(data, callback) {
        AuctionInfo.find({}, function(err, auctions_info) {
            if (err) next(err);
            callback(null, {
                data: data.data,
                rules: data.rules,
                auctions_info: auctions_info[0] || {}
            });
        })
    }

    function deliveryInfo(data, callback) {
        AuctionDelivery.find({}, function(err, delivery_info) {
            if (err) next(err);
            callback(null, {
                data: data.data,
                rules: data.rules,
                auctions_info: data.auctions_info,
                delivery_info: delivery_info[0] || {}
            });
        })
    }


}
