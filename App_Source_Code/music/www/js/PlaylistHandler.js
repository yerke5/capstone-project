var ap = null;
var prevPageID = "";

var PlaylistHandler = {
	curPlaylist: null,
	playlists: {},
	drawWholePlaylist: function(divID, callback) {
		//console.log(this.playlists);
		if(this.playlists['wholePlaylist'] == null) {
			console.log("playlist not defined");
			return;
		}
		
		wholePlaylist = this.playlists.wholePlaylist;
		for(var i = 0; i < wholePlaylist.length; i++) {
			var song = wholePlaylist[i];
			$('#' + divID).append(this.prepareSongDiv(song));
		}
		
		if(callback != null) callback();
	},

	prepareSongDiv: function(song) {
		html = 
		"<div class='song-wrapper'>" + 
			"<table class='song-info'>" + 
				"<tr>" +
					"<td rowspan=3 class='play-btn-td'>" + 
						//"<div class='play-btn-wrapper'>" + 
							/*"<span class='playBtnMinimized glyphicon glyphicon-play' " + 
							"style='width:70px' " + 
							"src='" + ThemeHandler.getCurrentTheme().playBtnSrc + "' " + 
							//"onclick='openPreSession(\"" + song.index + "\")' />" + 
							"onclick='openPlayer(\"" + song.index + "\")' />" + */
						//"</div>" + 
						"<img class='playBtnMinimized' " + 
							"src='" + ThemeHandler.getCurrentTheme().playBtnSrc + "' " +
							"onclick='openWholePlaylist(" + song.index + ")' " + 
						"/>" +
					"</td>" + 
					"<td class='label-title' colspan=3>" + 
						"<b>" + song.name + "</b>" + 
					"</td>" + 
					"<td rowspan=2 class='label-duration'>" + secToMin(song.duration) + "</td>" +
				"</tr>" + 
				"<tr>" + 
					"<td colspan=3 class='label-artist'>" + song.artist + "</td>" +
				"</tr>" + 
				"<tr>" + 
					"<td>" + 
						"<div class='tag goal'>" + song.instrument + "</div>" + 
					"</td>" + 
					"<td>" + 
						"<div class='tag genre'>" + song.genre + "</div>" + 
					"</td>" + 
					"<td>" + 
						"<div class='tag mood'>" + song.tempo + "</div>" + 
					"</td>" + 
				"</tr>" + 
			"</table>" + 
		"</div>";
		return html
	},
	
	buildPlaylist: function(userID, callback) {
		console.log("playlist build started");
		var self = this;
		if(userID == null) data = null;
		else data = {userID: userID};
		$.ajax({
			url: MUSIC_API_URL,
			type: "GET",
			data: data,
			dataType: "json",
			success: function(data) {
				var numSongs = data.count;
				var songs = [];
				for(var i = 0; i < numSongs; i++) {
					var song = data.songs[i];
					//var labels = JSON.parse(song['labels']);
					song['index'] = i;
					song['name'] = song['name'].split(".").slice(0, -1).join(".").split("-").join(" ");
					song['instrument'] = song['labels']['instrument'];
					song['genre'] = song['labels']['genre'];
					song['tempo'] = song['labels']['tempo'];
					song['artist'] = song['artist'].replace("_", " ").replace(";", ", ");
					song['url'] = song['presigned-url'];
					song['duration'] = song['duration'];
					//console.log(song);
					songs.push(song);
				}
				
				// store playlist
				
				// if userID is specified, store as recommended
				if(userID != null) {
					if(!("recommendedPlaylist" in self.playlists)) {
						self.playlists["recommendedPlaylist"] = songs;
					} 
				} else {
					if(!("wholePlaylist" in self.playlists)) {
						self.playlists["wholePlaylist"] = songs;
					} 
				}
				
				self.curPlaylist = songs;
				
				if(callback != null) callback();
			}
		});
	},
	
	getRecommendedPlaylist: function(userID, callback) {
		if("recommendedPlaylist" in this.playlists) {
			if(callback != null) callback();
		} else {
			this.buildPlaylist(userID, callback);
		}
	},
	
	getWholePlaylist: function(callback) {
		if("wholePlaylist" in this.playlists) {
			callback(this.playlists["wholePlaylist"]);
		} else {
			this.buildPlaylist(null, callback);
		}
	}
};

function isFullSessionComplete() {
	var sessionComplete = window.localStorage.getItem('sessionComplete') == 'true';
	var lastSessionDate = window.localStorage.getItem('lastSessionDate');
	/*console.log("last session date was ", lastSessionDate);
	console.log("session complete is ", sessionComplete);
	console.log("current date is ", getCurrentDate());
	console.log(getCurrentDate(), " and ", lastSessionDate, " are equal: ", getCurrentDate() == lastSessionDate);*/
	return sessionComplete && (lastSessionDate == getCurrentDate());
}

function isPreSessionComplete() {
	var lastSessionDate = window.localStorage.getItem('lastSessionDate');
	return window.localStorage.getItem('preSessionScore') != null && (lastSessionDate == getCurrentDate());
}

/*function openPreSession(index) {
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
}*/

function openPreSession(playlist) {
	if(isFullSessionComplete()) {
		openPlayer(playlist, 0);
		//$('#reflectionBtn').unbind('click');
		//$('#reflectionBtn').css({'color':'#a2a2a2'});
		return;
	}
	
	if(isPreSessionComplete()) {
		openPlayer(playlist, 0);
		return;
	}
	
	$('.currentPage').hide();
	$('.currentPage').first().removeClass('currentPage');
	$("#preSessionQuestions").addClass("currentPage");
	
	$('#preSessionQuestions').fadeIn(800);
	
	$('#preSessionBtn').click(function() {
		window.localStorage.setItem('preSessionScore', Math.round($('#preSessionWater').height()));
		$('#preSessionQuestions').fadeOut(700);
		openPlayer(playlist, 0);
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
			var info = {
				"type": "sessionScores",
				"userID": userID,
				"sessionGoal": window.localStorage.getItem('sessionGoal'),
				"preSessionScore": window.localStorage.getItem('preSessionScore'),
				"postSessionScore": "" + $('#postSessionWater').height()
			};
			console.log("Info is", info);
			RemoteDatabaseHandler.addUserInfo(JSON.stringify(info), function() {
				//MessageHandler.showSuccess("Session data submitted");
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
	$('#playerWrapper').fadeOut(1000);
}

function openPlayer(playlist, index) {
	prevPageID = $(".currentBottomMenuBtn").first().find(".bottomMenuBtn").attr("data");
	console.log($(".currentBottomMenuBtn").first().find(".bottomMenuBtn"));
	console.log($(".currentBottomMenuBtn").first());
	console.log(prevPageID);
	open("playerWrapper");
	/*$('#playerWrapper').fadeIn(500);
	$('#playerWrapper').addClass("currentPage");*/
	
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
		open(prevPageID);
	});
	
	/*$('#reflectionBtn').click(function() {
		/*closePlayer();
		openPostSession();
		$("#emotions").slideUp(500);
	});*/
	
	// create a new audio player copy 
	//ap = JSON.parse(JSON.stringify(AudioPlayer));
	//var ap = Object.assign({}, AudioPlayer);
	console.log(ap);
	ap = AudioPlayer;
	
	ap.init({
		"playlist": playlist,
		"elemSelectors": elemSelectors
	});
	
	console.log('openPlayer(): Playlist: ', ap.playlist);
	
	ap.renderSongInfo();
	ap.audioStarted = false;
	ap.play(parseInt(index));
}

function setBtnToCurrent(btnID) {
	$('.currentBottomMenuBtn').removeClass('currentBottomMenuBtn');
	$('#' + btnID).parent().addClass('currentBottomMenuBtn');
}

function secToMin(sec) {
	var min = Math.floor(sec / 60);
	var s = sec - min * 60;
	return min + ":" + s;
}

function openWholePlaylist(index) {
	PlaylistHandler.getWholePlaylist(function(playlist) {
		openPlayer(playlist, index);
	});
}