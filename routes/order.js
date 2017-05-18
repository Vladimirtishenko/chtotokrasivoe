var dateToStart = require('../middleware/services/configOptions'),
    ordersBucket = require('../middleware/modules/Orders/models/SchemaModel'),
    orders = require('../models/order_save'),
    mail = require('../middleware/mail_sender.js');
async = require('async');


module.exports.post = function(req, res, next) {

    if (req.session.user) {

        var data = req.body;

        data.userId = req.session.user._id;
        data.email = req.session.user.email;

        async.waterfall([
            function(callback) {
                orders.count({}, function(err, count) {
                    data.orderNumber = ++count;
                    callback(err, data.orderNumber)
                });
            },
            function(number, callback) {
                mail({
                    body: {
                        id: 'send_page',
                        email: data.email,
                        subject: 'Заказ принят!',
                        html_msg: 'Спасибо ваш заказ принят и обрабатывается.'
                    }
                }, function(err, mail) {
                    if(err){
                        callback('Не возможно отправить письмо, почта не действительна!', null)
                    }
                    callback(null, mail)
                });
            }, function(mail, callback) {
                orders.update({ "orderNumber": data.orderNumber }, data, { upsert: true, new: true }, function(err, save) {
                        callback(err, save)
                });

            }, function(order, callback){
                ordersBucket.remove({ userId: { $in: data.userId } }, function(err, response) {
                    callback(err, response);
                });
            }

        ], function(err, result) {
            if(err){
                res.json({ status: 500, msg: err });
            } else {
                res.json({ status: 200});
            }
        });

    } else {
        if (err) {
            res.json({ status: 500 });
        } else {
            res.json({ status: 200 });
        }

    }
}
