import Helper from './helper.js';

class Chat extends Helper {
	constructor(el) {
		super();
		if(!el) return;
		this.el = el;
		this.beforeEl = document.querySelector('.a-chat-container__item');
		this.button = document.querySelector('.a-chat-container__button');
		this.flyEvent('add', ['click'], [this.button], this.chatHandler.bind(this));
		this.arrayPosition = ['-684px 0', '-631px 0'];


		$app.chat = {
			add: this.addChat.bind(this),
			addPretendents: this.addPretendents.bind(this),
			addWinner: this.addWinner.bind(this),
			clearTemplate: this.clearTemplate.bind(this),
			clear: this.clearChat.bind(this)
		}

	}

	chatHandler(){
		this.el.classList.toggle('-animate-chat');
		this.button.style.cssText = "background-position: "+ this.arrayPosition[0];
		this.arrayPosition.reverse();
	}

	addChat(pretendents, price, count){

		if(!pretendents || Object.keys(pretendents).length == 0) return;

		this.beforeEl.insertAdjacentHTML('afterbegin', this.chatTemplate(pretendents, price, count));

	}

	addPretendents(pretendents, price, count){
		if(!pretendents || Object.keys(pretendents).length == 0) return;

		this.beforeEl.insertAdjacentHTML('afterbegin', this.chatTemplatePretendents(pretendents, price, count));
	}


	addWinner(winner, price, count){

		this.beforeEl.insertAdjacentHTML('afterbegin', this.chatTemplateWinner(winner, price, count));

	}


	clearChat(){
		let template =  '<div class="a-block-with-proposal">' + 
						    '<p class="a-block-with-proposal__buy_now">Аукционы пока не начались! </p>' + 
						'</div>';

		this.beforeEl.innerHTML = template;

	}

	clearTemplate(id, count){

		let template = '<div class="a-block-with-proposal">' + 
						    '<p class="a-block-with-proposal__buy_now">Торги по лоту <span>№'+id+'</span> '+count+' ед.</p>' + 
						'</div>';

		this.beforeEl.insertAdjacentHTML('afterbegin', template);
	}

	chatTemplateWinner(pretendents, price, count){

		let win = pretendents && Object.keys(pretendents).length || 0;

		let template = '<div class="a-block-with-proposal">' + 
						    '<p class="a-block-with-proposal__buy_now">Купили <span>'+count+' ед.</span> по <span> '+price+' руб/ед.</span></p>' + 
						   ' <p class="a-block-with-proposal__user">'+
						   		((win == 0) ? "Нет победителей" : this.chatTemplateUsers(pretendents)) +
						   '</p>' + 
						'</div>';

		return template;
	}

	chatTemplate(pretendents, price, count){

		if(!pretendents) return;

		let win = Object.keys(pretendents).length;

		let template = '<div class="a-block-with-proposal">' + 
						    '<p class="a-block-with-proposal__buy_now">Сделана ставка <span>'+count+'ед.</span> по<span> '+price+' руб/ед.</span></p>' + 
						   ' <p class="a-block-with-proposal__user">'+
						   		((win == 0) ? "Нет победителей" : (win < 10) ? this.chatTemplateUsers(pretendents) : 'Количество желающих: '+ win) +
						   '</p>' + 
						'</div>';

		return template;
	}

	chatTemplatePretendents(pretendents, price, count){
		if(!pretendents) return;

		let win = Object.keys(pretendents).length;

		let template = '<div class="a-block-with-proposal">' + 
						    '<p class="a-block-with-proposal__buy_now">Готовы купить <span>'+count+' ед.</span> по<span> '+price+' руб/ед</span></p>' + 
						   ' <p class="a-block-with-proposal__user">' +
						   		"Участвуют: <br />" +
						   '</p>' + 
						   '<p class="a-block-with-proposal__user">' +
						   		this.chatTemplateUsers(pretendents) +
						   '</p>' +
						'</div>';

		return template;
	}


	chatTemplateUsers(pretendents){

		let template = ''

		if(Object.keys(pretendents).length > 10){
			template = Object.keys(pretendents).length + 'чел.'
		} else {
			for(var user in pretendents){

				if(!pretendents[user].email && typeof pretendents[user] == 'object'){
					for(var ins in pretendents[user]){
						template += '<i>'+(pretendents[user][ins].login || pretendents[user][ins].email.split('@')[0])+' (г.'+ (pretendents[user][ins].city || "Белгород") +')</i>';
					}
				} else {
					template += '<i>'+(pretendents[user].login || pretendents[user].email.split('@')[0])+' (г.'+ (pretendents[user].city || "Белгород") +')</i>';
				}

				
			}
		}

		return template;
	}
}

export default Chat;