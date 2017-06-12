var Order = require('../../models/order_save'),
	request = require('request'),
	async = require("async"),
	Currency = require('../../models/currency');

module.exports.get = function(req, res, next) {


	var countryList = {
		'1': 'Украина',
		'2': 'Россия'
	};


	 async.parallel({
            orders: function(callback) {
                Order.findOne({_id: req.params.id}, function(err, order){
                	callback(err, order);
				}) 
            },
            currency: function(callback) {
                currency(callback);
            }
        }, function(err, result) {

        	if(err) next(err);
			res.render('print_order', {
				title: 'Print goods',
				data: result.orders,
				currency: getCurrencyUser(decodeURIComponent(result.orders.country), result.currency, countryList)
			});


        }) 


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

        console.log(result);

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

    function getCurrencyUser(cn, cur, countryList){

    	var detectedCountry = 2;

        for(var k in countryList){
            if(countryList[k] == cn) {
                detectedCountry = k;
            }
       	}

       	var value = detectedCountry == 1 ? "грн." : "руб.";

       	for(var c in cur.currency) {

       		if(cur.currency[c].country == detectedCountry) {
                return {currencyRate: cur.currency[c].rate, value: value};
            }
       	}

    }


}