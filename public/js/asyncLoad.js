import Helper from './helper.js';
import Template from './template.js';
import Bucket from './bucket.js';
import Error from './error.js';

class AsyncLoad extends Helper {
	constructor(el) {
		super();
		if(!el) return;
		this.mainItem = el;
		this.goodsAfter = document.querySelector('.a-else-goods');
		this.init();
	}

	init(){
		$app.socket.getCurrentAuction('getCurrentAuction', this.getCurrentAuction.bind(this));
		$app.socket.getAuctions('getAuctions', this.getAuctions.bind(this));
		$app.socket.auctionFinished('auctionFinished', this.auctionFinished.bind(this));
		$app.socket.actionStarted('actionStarted', this.actionStarted.bind(this));
		$app.socket.auctionUpdated('auctionUpdated', this.auctionUpdated.bind(this));
		$app.socket.pretendentAdded('pretendentAdded', this.pretendentAdded.bind(this));
		$app.socket.AuctionFinishedDataChanged('AuctionFinishedDataChanged', this.AuctionFinishedDataChanged.bind(this));
	}


	getCurrentAuction(response){

		if(!response.data || !response.data.lot){
			$app.chat.clear();
			return;
		} 
		
		this.itemCount = response.data.count;
		this.auctionId = response.data._uid;
		this.currentPrice = response.data.currentPrice;
		this.previousPrice = response.data.price;
		this.countInWarehouseValue = response.data.lot.countInWarehouse;
		this.pretendentsAuction = response.data.pretendents || null,
		this.finishedTime = response.data.finishedTime;

		try{
			clearTimeout(this.globalTimer);
		} catch(e){}
		this.timerStarted();

		if(response.data.status != 'started'){
			$app.chat.clear();
		} else {
			try{
				$app.chat.clearTemplate(this.auctionId, this.countInWarehouseValue);
				$app.chat.add(this.pretendentsAuction, this.previousPrice, this.itemCount);
			} catch(e){
				console.log(e);
			}
			
		}

		let template = Template['getCurrentAuction'](this.auctionId, response.data.lot, this.currentPrice, response.data.timer, this.itemCount, this.butonsDefferent);

		this.mainItem.innerHTML = "";
		this.mainItem.insertAdjacentHTML('beforeend' , template);

		this.buttonToBuy = document.querySelector('.a-general-goods__description_buy');
		this.buttonToBuyUpPrice = document.querySelector('.a-general-goods__description_rates_button');
		this.priceNow = document.querySelector('.a-general-goods__description_price_now_upgraded');
		this.countNow = document.querySelector('.a-type-to-count');
		this.countInWarehouse = document.querySelector('.a-general-goods__description_in-warehouse span');
		this.notification = document.querySelector('.a-add-rate');

		this.flyEvent('add', ['click'], [this.buttonToBuy, this.buttonToBuyUpPrice], [this.baseBuyInitial.bind(this), this.baseBuyInitialToUpPrice.bind(this)]);


	}


	getAuctions(response){

		if(!response.data || Object.keys(response.data).length == 0) return;
	 	
		this.goodsAfter.innerHTML = "";

		let template = '<div class="a-goods__item__reisizers">',
			i = 0,
			classArray = ['__with-triangle-left-medium', '__with-waves-rigth-high __to_left-no-margin', '__without-triangle-left-min'];

		for(let key in response.data){
			template += Template[response.action](response.data[key]._uid, response.data[key].lot, classArray[i++]);
		}

		template += '</div>';
		
		this.goodsAfter.insertAdjacentHTML('beforeend' ,template);

	}

	timerStarted(){
		let timer = document.querySelector('.a-times-frontend');
		let time = Math.round( ( this.finishedTime - ( (new Date()).getTime() + ($app.timeDiff) * 1000 ) ) / 1000)

		this.globalTimer = setTimeout(() => {
			if(timer){
				timer.innerHTML = "00:"+ ((time < 10) ? '0'+time : time);
			}
			
			if(time < 1) {
				this.clearTimerAndRequest(); 
				return;
			}

			this.timerStarted();
		}, 1000)

	}

	AuctionFinishedDataChanged(response){
		if(response && response.data && response.data.nextStartTime){
			$app.synteticTime(response.data.nextStartTime);
			$app.chat.clear();
			location = "/privat";
		}
	}

	clearTimerAndRequest(){
		clearTimeout(this.globalTimer);
	}

	pretendentAdded(response){
		if(response && response.data){
			if(response.data.action == 'setPrice' || response.data.action == 'setCount'){
				$app.chat.add(response.data.pretendents, response.data.price, response.data.count);
			} else {
				$app.chat.addPretendents(response.data.pretendents, response.data.price, response.data.count);
			}
		}		
	}


	auctionFinished(response){
		//this.buyAction = true;
		//this.buttonToBuy.classList.remove('a-inactive');
		Bucket.getBucket();
		$app.chat.addWinner(response.data.winner, response.data.price, response.data.count);
	}

	auctionUpdated(response){

		if(response && response.data){

			this.priceNow.innerHTML = response.data.currentPrice;
			this.countNow.value = response.data.count;
			this.currentPrice = response.data.currentPrice;
			this.countInWarehouse.innerHTML = response.data.lot.countInWarehouse + 'ед.';
			this.pretendentsAuction = response.data.pretendents;
			this.finishedTime = response.data.finishedTime;
			this.notification.innerHTML = "";
			this.auctionEnabled();

			//$app.chat.add(this.pretendentsAuction, response.data.price);

			try{
				clearTimeout(this.globalTimer);
			} catch(e){
				console.log(e);
			}
			this.timerStarted();

		}
		
		
	}

	actionStarted(response){
		this.getCurrentAuction(response);
	}

	baseBuyInitial(event){

		event.stopPropagation();

		let countAttr = document.querySelector('.a-type-to-count').value,
			count = isNaN(parseInt(countAttr)) ? 1 : parseInt(countAttr);

		if(!event || !event.target) return;

		if(count > this.itemCount || count < 1){
			if(count > parseInt(this.countInWarehouseValue) || count < 1){
				this.notification.innerHTML = "На складе всего " + this.countInWarehouseValue + "ед. Вы не можете купить " + count + "ед.";
				return;
			}
			$app.socket.upCount('upCount', {auction_id: this.auctionId, count: count}, this.upCount.bind(this));
		} else {
			$app.socket.baseBuy('baseBuy', {auction_id: this.auctionId}, this.baseBuy.bind(this));
		}

	}

	baseBuyInitialToUpPrice(event){

		event.stopPropagation();

		let target = event && event.target || null;

		let buttonPrice = target.tagName == 'BUTTON' ? target.querySelector('.a-top-number-price').innerHTML : target.innerHTML;

		if(parseInt(buttonPrice) >= 2 && parseInt(buttonPrice) <= 5) {
			$app.socket.upPrice('upPrice', {auction_id: this.auctionId, price: parseInt(buttonPrice)}, this.upPrice.bind(this));
		}

	}

	auctionDisabled(message){

		this.notification.innerHTML = $app.getTime() ? (message || "Ставка сделана! Oжидайте завершения торгов!") : "Аукцион не начался вы не можете делать ставки!";
	}

	auctionEnabled(){
		this.notification.innerHTML = "";
	}


	upPrice(response){
		if(response.error && response.error.errorCode){
			let message = Error.errorCodes(response.error.errorCode);
			if(message) {
				this.auctionDisabled(message)
			}
		}

		if(!this.tryAuthoryze(response)){
			this.auctionEnabled();
		}

		this.auctionDisabled();

	}

	upCount(response){
		if(response.error && response.error.errorCode){
			let message = Error.errorCodes(response.error.errorCode);
			if(message) {
				this.auctionDisabled(message)
			}
		}

		if(!this.tryAuthoryze(response)){
			this.auctionEnabled();
		}

		this.auctionDisabled();
	}


	baseBuy(response){
		if(response.error && response.error.errorCode){
			let message = Error.errorCodes(response.error.errorCode);
			if(message) {
				this.auctionDisabled(message)
			}
		}

		if(!this.tryAuthoryze(response)){
			this.auctionEnabled();
		}

		this.auctionDisabled();
		
	}

	tryAuthoryze(response){
		if(response && response.error && response.error.errorCode == 401){
			$app.modalOpen({target: document.querySelector('.__login_action')});
			return false;
		}
		return true;
	}

	auctionValidate(count){
		if(!isNaN(count.value) && count.value < 0 || count.value > this.itemCount){
			let elToError = document.querySelector('.a-general-goods__time_to_end');
			elToError.innerHTML += '<p>Колличесво на складе '+this.itemCount+'. Вы не можете купить больше!</p>';
			return false;
		}

		return true;

	}


}

export default AsyncLoad;