import Helper from '../helper.js';

import Flatpickr from 'flatpickr';
import RussianFlatpickr from 'flatpickr/src/flatpickr.l10n.ru.js';
import Templates from './templates.js';
import ErrorCode from '../error.js';

class Config extends Helper {
    constructor(el) {
        super();
        if (!el) return;

        this.saveDate = document.querySelector('.a-date-save');
        this.calendarInput = document.querySelector('.a-flatpickr');
        this.datetoView = document.querySelector('.a-startet-date span');
        this.resultHandler = document.querySelector('.a-result');
        this.formUser = document.querySelector('.a-form-to-add-user');
        this.usersTable = document.querySelector('.a-users-table');
        this.templates = Templates['templatesForUsers']();

        this.flyEvent('add', ['click'], [this.saveDate, this.usersTable], [this.handlerToSave.bind(this), this.handlerToRemoveUser.bind(this)]);
        this.flyEvent('add', ['submit'], [this.formUser], this.handlerToAddUser.bind(this));

        this.setInputCalendar();

    }

    handlerToSave() {

        if (!this.calendarInput.value) return;

        let date = new Date();

        if (+new Date(this.calendarInput.value)) {
            date = new Date(this.calendarInput.value);
        } else {
            date = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
        }

        this.datetoView.innerHTML = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());

        this.xhrRequest('POST', '/page_config', 'application/x-www-form-urlencoded', 'date='+(+date), this.responseToSaveDate.bind(this));

    }

    setInputCalendar(obj) {

        Flatpickr.localize(RussianFlatpickr);

        new Flatpickr(this.calendarInput, {
            minDate: new Date(),
            inline: true,
            enableTime: true
        });
    }

    handlerToAddUser(event){
        event.preventDefault();

        let form = event && event.target || null,
            data = '';

        if(!form) return;

        let elems = form.elements;

        for (var i = 0; i < elems.length; i++) {
            if(elems[i].tagName == 'INPUT'){
                data +=  '&' + elems[i].name+'='+elems[i].value;
            }
        }

        this.xhrRequest('PUT', '/users', 'application/x-www-form-urlencoded', data.slice(1), this.responseToSaveUser.bind(this));

    }

    handlerToRemoveUser(event){
        event.preventDefault();

        let removerId = event && event.target && event.target.classList.contains('a-user-remove') ? event.target.getAttribute('data-user') : null,
            allUser = document.querySelectorAll('.a-user-remove');

        if(!removerId || allUser.length == 1) return;

        this.xhrRequest('DELETE', '/users', 'application/x-www-form-urlencoded', 'id='+removerId, this.responseToDeleteUser.bind(this, event.target));

    }

    responseToSaveUser(obj){

        try{
            let object = JSON.parse(obj),
                user = object.user;

            if(user.errmsg){
               this.usersTable.insertAdjacentHTML('afterend', '<p class="a-notify">'+ErrorCode.errorCodes(user.code)+'</p>') 
            }else {
               this.usersTable.insertAdjacentHTML('beforeend', this.templates(user)) 
            }

        } catch(e){}

    }

    responseToDeleteUser(target, obj){

        try{
            let data = JSON.parse(obj);

            if(data.user.n > 0){
                let tr = target.closest('tr');

                tr.parentNode.removeChild(tr);
            }

        } catch(e){}


    }

    responseToSaveDate(obj){

    	try{
    		let data = JSON.parse(obj);

    		if(data.status == 200){
    			this.resultHandler.innerHTML = "Дата успешно установлена!";
    		} else {
    			this.resultHandler.innerHTML = "Дата не установлена ошибка сервера! Попробуйте обновить страницу!";
    		}

    	} catch(e){}

    }

}

export default Config;
