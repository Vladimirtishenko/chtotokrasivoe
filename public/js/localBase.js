import Helper from './helper.js';

class LocalBase extends Helper {
	constructor() {
		super();
		
	}

	sets(field, value){
		console.log(arguments);
		for (var i = 0; i < field.length; i++) {
			localStorage.setItem(field[i], value[i]);
		}
	}

	gets(field){
		return localStorage.getItem(field) || null;
	}

	remove(field){
		for (var i = 0; i < field.length; i++) {
			localStorage.removeItem(field[i]);
		}
	}

	removeAll(){
		localStorage.clear();
	}
	
}

export default LocalBase;