import Helper from '../helper.js';
import ErrorCode from '../error.js';

class Rules extends Helper {
	constructor(elem){
		super();
		if(!elem) return;

		this.form = elem.querySelector('.a-forms-rules-update');
		this.action = this.form.getAttribute('data-action');

		this.flyEvent('add', ['submit'], [this.form], [this.sendFormRules.bind(this)]);

	}

	sendFormRules(event){
		event.preventDefault();
		let form = event && event.target || null;
		if(!form) return;

		let id = form.text.getAttribute('data-id'),
			content = tinymce.activeEditor.getContent();

		this.xhrRequest('POST', this.action, 'application/json', JSON.stringify({fieldId: id || 0, text: content}), this.responseFromServer.bind(this, form));

	}

	responseFromServer(form, obj){

		try{
			var json = JSON.parse(obj);

			if(json.status == 200){
				form.insertAdjacentHTML('beforeend', '<p class="a-notify">Изменения сохранены</p>')
			}

		}catch(e){

		}

	}
}

export default Rules; 
