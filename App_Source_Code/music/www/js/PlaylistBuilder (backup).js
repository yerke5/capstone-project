var ap = null;

var PlaylistBuilder = {
	playlist: null,
	drawPlaylist: function(divID, callback) {
		if(this.playlist == null) {
			console.log("playlist not defined");
			return;
		}
		
		for(var i = 0; i < this.playlist.length; i++) {
			var song = this.playlist[i];
			$('#' + divID).append(this.prepareSongDiv(song));
		}
		
		if(callback != null) callback();
		
		//ThemeHandler.setThemeHTML();
	},
	prepareSongDiv: function(song) {
		html = 
		"<div class='song-wrapper'>" + 
			"<table class='song-info'>" + 
				"<tr>" +
					"<td rowspan=3 class='play-btn-td'>" + 
						"<div class='play-btn-wrapper'>" + 
							"<img class='playBtnMinimized' style='width:70px' src='" + ThemeHandler.getCurrentTheme().playBtnSrc + "' onclick='openPreSession(\"" + song.index + "\")' />" + 
						"</div>" + 
					"</td>" + 
					"<td class='label-title' colspan=3>" + 
						"<b>" + song.name + "</b>" + 
					"</td>" + 
					"<td rowspan=2 class='label-duration'>" + song.duration + "</td>" +
				"</tr>" + 
				"<tr>" + 
					"<td colspan=3 class='label-artist'>" + song.artist + "</td>" +
				"</tr>" + 
				"<tr>" + 
					"<td>" + 
						"<div class='tag goal'>" + song.goal + "</div>" + 
					"</td>" + 
					"<td>" + 
						"<div class='tag genre'>" + song.genre + "</div>" + 
					"</td>" + 
					"<td>" + 
						"<div class='tag mood'>" + song.mood + "</div>" + 
					"</td>" + 
				"</tr>" + 
			"</table>" + 
		"</div>";
		return html
	},
	buildPlaylist: function(maxNumSongs, callback) {
		console.log("playlist build started");
		var self = this;
		$.ajax({
			url: MUSIC_API_URL,
			type: "GET",
			dataType: "json",
			success: function(data) {
				// retrieve the first 10 entries
				var numSongs = Math.min(data.count, maxNumSongs);
				var songs = [];
				for(var i = 0; i < numSongs; i++) {
					var song = data.songs[i];
					song['index'] = i;
					song['name'] = song['name'].split(".").slice(0, -1).join(".").replace('-', ' ');
					song['goal'] = 'relax';
					song['genre'] = 'nature';
					song['mood'] = 'relax';
					song['artist'] = 'Unknown';
					song['url'] = song['presigned-url'];
					song['duration'] = '0:00';
					console.log(song);
					songs.push(song);
				}
				
				// store playlist
				window.localStorage.setItem('playlist', songs);
				self.playlist = songs;
				self.drawPlaylist('content', callback);
			}
		});
	}
};

function isFullSessionComplete() {
	var sessionComplete = window.localStorage.getItem('sessionComplete') == 'true';
	var lastSessionDate = window.localStorage.getItem('lastSessionDate');
	console.log("last session date was ", lastSessionDate);
	console.log("session complete is ", sessionComplete);
	console.log("current date is ", getCurrentDate());
	console.log(getCurrentDate(), " and ", lastSessionDate, " are equal: ", getCurrentDate() == lastSessionDate);
	return sessionComplete && (lastSessionDate == getCurrentDate());
}

function isPreSessionComplete() {
	var lastSessionDate = window.localStorage.getItem('lastSessionDate');
	return window.localStorage.getItem('preSessionScore') != null && (lastSessionDate == getCurrentDate());
}

function openPreSession(index) {
	if(isFullSessionComplete()) {
		openPlayer(index);
		$('#reflectionBtn').unbind('click');
		$('#reflectionBtn').css({'color':'#a2a2a2'});
		return;
	}
	
	if(isPreSessionComplete()) {
		openPlayer(index);
		return;
	}
	
	$('#preSessionQuestions').fadeIn(800);
	
	$('#preSessionBtn').click(function() {
		window.localStorage.setItem('preSessionScore', Math.round($('#preSessionWater').height()));
		$('#preSessionQuestions').fadeOut(700);
		openPlayer(index);
	});
}

function getCurrentDate() {
	var lastSessionDate = new Date();
	var dd = String(lastSessionDate.getDate()).padStart(2, '0');
	var mm = String(lastSessionDate.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = lastSessionDate.getFullYear();

	return mm + '/' + dd + '/' + yyyy;
}

function openPostSession() {
	$('#postSessionQuestions').fadeIn(800);
	$('#postSessionBtn').click(function() {
		console.log("postsession button clicked");
		LocalDatabaseHandler.get('userID', function(results){
			var userID = results.rows.item(0).value;
			console.log("userID: ", userID);
			UserHandler.addUserInfo(JSON.stringify({
				"userID": userID,
				"preSessionScore": window.localStorage.getItem('preSessionScore'),
				"postSessionScore": "" + $('#postSessionWater').height()
			}), function() {
				console.log('success');
				window.localStorage.setItem('sessionComplete', true);				
				window.localStorage.setItem('lastSessionDate', getCurrentDate());
				window.location.href = 'sessionComplete.html';
			}, function() {
				MessageHandler.showError("There was an error storing your session scores. Would you please kindly check your Internet connection? Thanks :)");
				$('#postSessionQuestions').show();
			});
		});
	});
}

function closePlayer() {
	ap.reset();
	$('#player-wrapper').fadeOut(1000);
}

function openPlayer(index) {	
	
	$('#player-wrapper').fadeIn(500);
	
	$('#playBtn').click(function(){
		if(ap.status == 'PLAYING') {
			ap.pause();
		} else if(ap.status == 'PAUSED') {
			ap.play(ap.currentSongIndex);
		} else if(ap.status == 'STOPPED') {
			ap.play(0);
		}
	});
	
	$('#prevBtn').click(function(){
		ap.play(ap.currentSongIndex - 1);
	});
	
	$('#nextBtn').click(function(){
		ap.play(ap.currentSongIndex + 1);
		console.log(ap.currentSongIndex + 1); 
	});
	
	$('#closeBtn').click(function(){
		closePlayer();
	});
	
	$('#reflectionBtn').click(function() {
		closePlayer();
		openPostSession();
	});
	
	ap = AudioPlayer;
	
	ap.init({
		"playlist": PlaylistBuilder.playlist,
		"elemSelectors": elemSelectors
	});
	
	console.log('openPlayer(): Playlist: ', ap.playlist);
	
	ap.renderSongInfo();
	ap.play(parseInt(index));
}

function setBtnToCurrent(btnID) {
	$('.currentBottomMenuBtn').removeClass('currentBottomMenuBtn');
	$('#' + btnID).parent().addClass('currentBottomMenuBtn');
}