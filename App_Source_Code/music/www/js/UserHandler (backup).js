var UserHandler = {
	addUserInfo: function(info, success, error) {
		$.ajax({
			url: MUSIC_API_URL,
			type: "POST",
			data: info,
			success: success,
			error: error
		});
	},
	generateID: function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
};