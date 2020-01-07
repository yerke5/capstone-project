var RemoteDatabaseHandler = {
	addUserInfo: function(info, success, error) {
		$.ajax({
			url: MUSIC_API_URL + "/user",
			type: "POST",
			data: info,
			success: success,
			error: error
		});
	},
	getUserInfo: function(userID, success, error) {
		$.ajax({
			url: MUSIC_API_URL + "/user",
			type: "GET",
			data: {userID: userID},
			success: success,
			error: error
		});
	}/*,
	generateID: function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}*/
};