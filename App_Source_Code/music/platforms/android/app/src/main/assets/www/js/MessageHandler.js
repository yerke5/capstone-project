var MessageHandler = {
	showError: function(message) {
		alert(message);
	},
	showSuccess: function(message) {
		alert(message);
	},
	askUserID: function(formSubmitHandler) {
		usernameForm = "<div class='row' id='usernameForm'>" + 
							"<div class='col-xs-10 col-xs-offset-1'>" + 
								"<h1 style='margin-top:40%'>Please provide your username</h1>" +
								"<p>First, please think of a username. You don\'t have to enter your name. This way the app will remember your music preferences.</p>" + 
								"<input " +  
									"placeholder='Please enter a username' " + 
									"type='text' " +
									"id='usernameInput' " + 
									"style='width:100%;padding:15px;border:0.5px solid #ccc;border-radius:5px'" + 
								"/>" +
								"<button id='usernameFormSubmit' class='button' style='margin-top:5%'>Next</button>" + 
							"</div>" + 
						"</div>";
		$(document.body).append($(usernameForm));
		$('#usernameFormSubmit').click(formSubmitHandler);
	}
}