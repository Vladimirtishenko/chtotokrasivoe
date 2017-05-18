import Helper from './helper.js';
import Errors from './error.js';

class Modal extends Helper {
    constructor() {
        super();
        this.parentWraper = document.querySelector('.a-modal');
        this.close = document.querySelectorAll('.a-modal-close');
        const button = document.querySelectorAll('.button-modal');
        const formChange = document.querySelectorAll('.-a-form-change-listener');
        const formAll = document.querySelectorAll('.a-form-submit');
        this.stateValidate = true;
        this.flyEvent('add', ['click'], [button, this.close, formChange], [this.modalHandlerIn.bind(this), this.modalHandlerOut.bind(this), this.changeForm.bind(this)]);
        this.flyEvent('add', ['submit'], [formAll], this.sendForm.bind(this));

       $app.modalOpen = this.modalHandlerIn.bind(this);
        
    }

    modalHandlerIn(event) {

        let attr = event && event.attr ? event.attr : event && event.target ? event.target.getAttribute('data-attr') : null;

        if (!attr) return;

        let container = document.querySelector('.' + attr);
        if(event.winner){
            container.querySelector('.a-winner-block').innerHTML = event.winner;
        }
        this.cssHelper([container], ["display: flex"]);
        this.classChange(['-animate-modal-in'], 'add', [this.parentWraper])


    }

    modalHandlerOut(event) {

        let target = event && event.target || null
         if (!target) return;

        this.animationEvent = this.transitionEnd.bind(this, target);
        this.flyEvent('add',['animationend'], [this.parentWraper], this.animationEvent);
        this.classChange(['-animate-modal-out'], 'add', [this.parentWraper]);

    }

    addStyleOrRemove(el, what){
        el.style.display = what;
    }

    transitionEnd(targets, event) {
        let target = event && event.target;

        this.classChange(['-animate-modal-in', '-animate-modal-out'], 'remove', [target]);

        this.cssHelper([targets.parentNode], ["display: none"]);
        try {
           this.parentWraper.removeEventListener('animationend', this.animationEvent);
        } catch (e) {
            console.log(e);
        }

    }

    changeForm(event) {
        let target = event && event.target || null,
            attr = target.getAttribute('data-attr') || null;
        if(!target || !attr) return;

        this.stateValidate = true;
        
        let forms = this.parentWraper.querySelectorAll('.a-form-modal');

        for(var i = 0; i < forms.length - 1; i++){
            if(forms[i].classList.contains(attr)){
                forms[i].style.display = "flex";
            } else {
                forms[i].style.display = "none";
            }
        }


    }

    sendForm(event){
        event.preventDefault();

         let target = event && event.target || null,
             elems = target.elements || null,
             action = target.getAttribute('data-action'),
             formData = {};

        for(var i = 0; i < elems.length - 1; i++){
            if(elems[i].type == "email" || elems[i].type == "password" || elems[i].type == "text"){
                if(!this.validate(elems[i], target)) return;
                    
                formData[elems[i].name] = elems[i].value;
            }
        }

        if(this.stateValidate){
            try{
                $app.socket.authorize(action, formData, this.afterResponseAuthorize.bind(this, target));
            } catch(e){
                console.log(e);
            }
        }

    }


   afterResponseAuthorize(target, response){


        if(response.error || response.data.errmsg){
            target.reset();
            this.errorValidate(Errors.errorCodes(
                (response.error && response.error.errorCode) || response.data.code
            ), target);
            return;
        }
        location.reload();

   }


    validate(el, form){

        let regExp = {
            email: /^\w+[\w-\.]*\@\w+((-\w+)|(\w*))\.[a-z]{2,5}$/,
            pass: /[a-zA-Z0-9!@#\$%&\^\*\(\)_\+=]/,
            city: /[а-яА-Я]/
        }

        if(!regExp[el.name].test(el.value)){
            this.errorValidate('Проверьте правильность полей!', form);
           
            return false;
        }

        return true;

    }

    errorValidate(text, form){
        form.insertAdjacentHTML('beforeend', '<p class="a-notify">'+text+'</p>');
        return false;
    }


}

export default Modal;
