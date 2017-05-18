module.exports = function(body){

	var obj = {
		send_page: "<style>p{font-family:arial; font-weight: 400; color: #464646; font-size: 14px; line-height: 18px;}</style>" +
					"<table style='width: 400px; border:1px solid #e3e3e3; padding: 20px'>"+
						"<tr>"+
							"<td style='text-align: center'>" +
								"<img src='http://chechelyka-auction.com/img/logo.png'>" +
							"</td>" +
						"</tr>"+
						"<tr>"+
							"<td>" +
								"<h2 style='padding: 20px 0; text-align: center; font-family:arial; font-weight: 400; color: #464646; font-size: 16px; letter-spacing: 2px'>Тема: "+body.subject+"</h2>" +
							"</td>" +
						"</tr>"+
						"<tr>"+
							"<td>" +
								body.html_msg + 
							"</td>" +
						"</tr>"+
					"</table>",

		delivery_page:  "<style>p{font-family:arial; font-weight: 400; color: #464646; font-size: 14px; line-height: 18px;}</style>" +
					"<table style='width: 400px; border:1px solid #e3e3e3; padding: 20px'>"+
						"<tr>"+
							"<td style='text-align: center'>" +
								"<img src='http://chechelyka-auction.com/img/logo.png'>" +
							"</td>" +
						"</tr>"+
						"<tr>"+
							"<td>" +
								"<h2 style='padding: 20px 0; text-align: center; font-family:arial; font-weight: 400; color: #464646; font-size: 16px; letter-spacing: 2px'>Тема: Ваш заказ отправлен.</h2>" +
							"</td>" +
						"</tr>"+
						"<tr>"+
							"<td>" +
								"<p>ТТН № "+body.ttn+"</p>" +
								"<p>По номеру заказа: "+body.order+"</p>" +
							"</td>" +
						"</tr>"+
					"</table>"
	}



	return obj[body.id];
}