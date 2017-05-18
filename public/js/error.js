class ErrorCode {

	constructor(){
		window.addEventListener('click', function(){
			let errorPlaceholders = document.querySelectorAll('.a-notify');

			for (var i = 0; i < errorPlaceholders.length; i++) {
				errorPlaceholders[i].parentNode.removeChild(errorPlaceholders[i]);
			}
		})
	}

	errorCodes(code){
		let codesState = {
			11000: 'Такой пользователь уже есть в системе',
			401: 'Не правильно введен логин или пароль',
			304: 'Вы уже делали ставку!',
			400: 'Ошибка! Цена либо колличество не верное, либо аукцион уже завершен',
			405: 'Не возможно сделать ставку, скорее всего кто-то раньше вас её повысил.',
			404: 'Аукциона не существует',
			500: 'Простите у нас неполадки с сервером, попробуйте позже!'
		}

		return codesState[code];
	}	

}

export default new ErrorCode