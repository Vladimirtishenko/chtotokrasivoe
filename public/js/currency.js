import Helper from './helper.js'

class Currency extends Helper {

	constructor(){
		super();
		this.url = 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+%22USDRUB,USDUAH%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

		this.tryLocalStorage();

	}

	tryLocalStorage(){
		let storage = localStorage.getItem('currency'),
			date = new Date(),
			today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf(),
			json;


		if(!storage){
			this.newCurrencyObject = {date: today}
			this.tryRequest();
		} else {
			json = JSON.parse(storage);

			let dateJson = json.date;

			if (dateJson < today) {
			    this.tryRequest();
			} 
		}

	}


	tryRequest(){
		this.xhrRequest('GET', this.url, null, null, this.tryResponse.bind(this));
	}

	tryResponse(obj){

		let json,
			result;

		try{
			json = JSON.parse(obj),
			result = json.query.results.rate;

			console.log(result);

			this.insertCurrency(result);

		} catch(e) {
			console.log(e);
		}

	}

	insertCurrency(){

	}

} 

export default Currency;