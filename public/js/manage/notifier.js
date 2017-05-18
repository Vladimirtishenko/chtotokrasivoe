class Notifier {
	
	constructor(){
		this.notifyWrapper = document.querySelector('.a-notifier');
		this.closeNotify = document.querySelector('.a-close-notifier');
		this.contentNotify = document.querySelector('.a-texts-err-to-notify');
		this.closeNotify.addEventListener('click', this.notifyClose.bind(this));
	} 

	errCode(string){
		this.contentNotify.innerHTML = string;
		this.notifyShow();
	}

	notifyShow(){
		this.notifyWrapper.classList.remove('a-hide-notify')
	}

	notifyClose(event){

		this.contentNotify.innerHTML = ""
		this.notifyWrapper.classList.add('a-hide-notify')

	}

}

export default Notifier;