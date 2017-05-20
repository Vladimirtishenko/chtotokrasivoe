import Helper from './helper.js';

class Bucket extends Helper{
	constructor(){
		super();
	}

	getBucket(){
		let url = '/bucket';
		this.xhrRequest('POST', url, null, null, this.responseBucket.bind(this));
	}

	responseBucket(obj){
		let count = document.querySelector('.a-side-backet__count'),
			price = document.querySelector('.a-side-backet__price');

		try {
			let bucket = JSON.parse(obj);
			count.innerHTML = bucket.bucketCount ? bucket.bucketCount + " шт" : 0 + " шт";
			price.innerHTML = bucket.bucketPrice ? bucket.bucketPrice + " грн" : "Корзина <br /> пуста";
		} catch(e){

		}
	}

}

export default new Bucket