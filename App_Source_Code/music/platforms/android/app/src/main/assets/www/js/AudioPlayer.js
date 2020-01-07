var AudioPlayer = {
	
	player: null,
	playBtn: null,
	prevBtn: null,
	nextBtn: null,
	repeatBtn: null,
	songTitleText: null,
	loadedBar: null,
	preloadedBar: null,
	curTime: null,
	durTime: null,
	audio: null,
	index: 0,
	playlist: null,
	slider: null,
	playerBarWrapper: null,
	status: null,
	elemSelectors: null,
	currentSongIndex: 0,
	settings: {
		volume: 1,
		autoPlay: true,
		muted: false,
		buffered: true
	},
	curVolume: 1,
	audioStarted: false,
	init: function(options) {
		
		// initialise player HTML 
		this.elemSelectors = options.elemSelectors;
		this.playlist = options.playlist;
		this.player = $(this.elemSelectors.player);
		this.playBtn = $(this.elemSelectors.playBtn);
		this.prevBtn = $(this.elemSelectors.prevBtn);
		this.nextBtn = $(this.elemSelectors.playBtn);
		this.songTitleText = $(this.elemSelectors.songTitleText);
		this.loadedBar = $(this.elemSelectors.loadedBar);
		this.preloadedBar = $(this.elemSelectors.preloadedBar);
		this.progressBar = $(this.elemSelectors.progressBar);
		this.playerBarWrapper = $(this.elemSelectors.playerBarWrapper);
		this.slider = $(this.elemSelectors.slider);
		this.curTime = $(this.elemSelectors.curTime);
		this.duration = $(this.elemSelectors.duration);
		
		this.progressBar.bind('click', moveBar);
		this.progressBar.bind("touchstart", touchBar);
		
		// initialise audio object
		this.audio = new Audio();
		this.audio.volume = this.settings.volume;
		this.audio.preload = 'auto';
		this.audio.autoPlay = this.settings.autoPlay;
		this.audio.muted = this.settings.muted;
		this.audio.addEventListener('error', audioErrorHandler, false);
        this.audio.addEventListener('timeupdate', audioTimeUpdateHandler, false);
        this.audio.addEventListener('ended', audioEndHandler, false);
		
		// audio player options
		this.goal = options.goal;
		//this.mySound._sound.playbackRate.value = 1.2;
	},
	renderSongInfo: function() {
		this.songTitleText.innerHTML = this.getSong(this.currentSongIndex).name;
	},
	getSong: function(index) {
		return this.playlist[index];
	},
	play: function(index) {
		if(index >= this.playlist.length) {
			if(this.status != 'STOPPED') {
				console.log('playlist overflow');
				this.stop();
			}
			return;
		} 
		if(index < 0) {
			index = this.playlist.length - 1;
		}
		
		if(!this.progressBar.is(":visible")) this.playerBarWrapper.show();
		this.status = 'PLAYING';
		this.updatePlayBtn('PAUSE');
		if(!this.audioStarted || index != this.currentSongIndex) {
			this.currentSongIndex = index;
			console.log('this is current playlist', this.playlist);
			console.log('current song index is ', this.currentSongIndex);
			var song = this.getSong(this.currentSongIndex);
			this.audio.src = song.url;
			this.songTitleText.html(song.name);
			this.audioStarted = true;
		}
		this.audio.play();	
		console.log("Audio started playing");
	},
	pause: function() {
		this.audio.pause();
		this.status = 'PAUSED';
		this.updatePlayBtn('PLAY');
	},
	stop: function() {
		this.setNewTime(this.audio.duration);
		this.updateLoadedBar(this.audio.duration);
		this.status = 'STOPPED';
		this.updatePlayBtn('REPEAT');
		this.playerBarWrapper.hide();
	},
	updatePlayBtn: function(action) {
		/*if(action == 'PAUSE') {
			$('#' + this.elemSelectors.playBtn + ' span').removeClass('glyphicon-play').addClass('glyphicon-pause');
		} else if(action == 'PLAY') {
			$('#' + this.elemSelectors.playBtn + ' span').removeClass('glyphicon-pause').addClass('glyphicon-play');
		} else if(action == 'REPEAT') {
			$('#' + this.elemSelectors.playBtn + ' span').removeClass('glyphicon-pause').removeClass('glyphicon-play').addClass('glyphicon-repeat');
		}*/
		if(action == 'PAUSE') {
			this.playBtn.attr('src', 'img/pause.png');
		} else if(action == 'PLAY') {
			this.playBtn.attr('src', ThemeHandler.getCurrentTheme().playBtnSrc);
		} else if(action == 'REPEAT') {
			this.playBtn.attr('src', 'img/replay.png');
		}
	},
	setNewTime: function(newTime) {
		console.log("New time has been set: ", newTime);
		// update HTML		
		this.updateTimeHTML(newTime);
		
		// update audio
		this.audio.currentTime = newTime;
	},
	updateTimeHTML: function(newTime) {
		var time = this.timeToString(newTime);

		this.curTime.html(time.curMins + ':' + time.curSecs);
		this.duration.html(time.totalMins + ':' + time.totalSecs);
	},
	updateLoadedBar: function(newTime) {
		this.loadedBar.css({'width': newTime * 100 / this.audio.duration + '%'});
		this.slider.css({'left': (this.loadedBar.width() - this.slider.width() / 2) + 'px'})
	},
	timeToString: function(curTime) {
		var curMins = Math.floor(curTime / 60),
		curSecs = Math.floor(curTime - curMins * 60),
		totalMins = Math.floor(this.audio.duration / 60),
		totalSecs = Math.floor(this.audio.duration - totalMins * 60);
	
		// prepend 0 to digits 
		if(curSecs < 10) (curSecs = '0' + curSecs);
		if(totalSecs < 10) (totalSecs = '0' + totalSecs);
		
		return {
			curSecs: curSecs,
			curMins: curMins,
			totalSecs: totalSecs,
			totalMins: totalMins
		};
	},
	reset: function() {
		this.playBtn.unbind('click');
		this.progressBar.unbind('click');
		this.progressBar.unbind('touchstart');
		this.playBtn.unbind('click');
        this.playBtn.unbind('click');		

        this.audio.removeEventListener('error', audioErrorHandler, false);
        this.audio.removeEventListener('timeupdate', audioTimeUpdateHandler, false);
        this.audio.removeEventListener('ended', audioEndHandler, false);
		this.audio.pause();
		
		this.currentSongIndex = 0;
	}
};

function audioTimeUpdateHandler() {
	if(AudioPlayer.audio == null) {
		console.log('No audio initialised');
		return;
	}
	if (AudioPlayer.audio.readyState === 0) return;
	
	AudioPlayer.updateLoadedBar(AudioPlayer.audio.currentTime);
	AudioPlayer.updateTimeHTML(AudioPlayer.audio.currentTime);
	
	var buffered = AudioPlayer.audio.buffered;
	if (buffered.length) {
		var loaded = Math.round(100 * buffered.end(0) / AudioPlayer.audio.duration);
		AudioPlayer.preloadedBar.css({'width': loaded + '%'});
	}
}

function audioErrorHandler() {
	var mediaError = {
		'1': 'MEDIA_ERR_ABORTED',
		'2': 'MEDIA_ERR_NETWORK',
		'3': 'MEDIA_ERR_DECODE',
		'4': 'MEDIA_ERR_SRC_NOT_SUPPORTED'
	};
	if(AudioPlayer.audio != null) AudioPlayer.audio.pause();
	AudioPlayer.curTime.html("--");
	AudioPlayer.duration.html("--");
	AudioPlayer.loadedBar.css({'width': 0});
	AudioPlayer.preloadedBar.css({'width': 0});

	AudioPlayer.updatePlayBtn('PLAY');
	throw new Error('Error playing audio: ' + mediaError[evt.target.error.code]);
}

function audioEndHandler() {
	AudioPlayer.audioStarted = false;
	if(AudioPlayer.currentSongIndex >= AudioPlayer.playlist.length - 1) {
		AudioPlayer.updatePlayBtn('REPEAT');
		closePlayer();
		openPostSession();
		AudioPlayer.audio.pause();
	} else {
		AudioPlayer.play(AudioPlayer.currentSongIndex + 1);
		AudioPlayer.currentSongIndex++;
	}
}

function moveBar(evt) {
	var newTimePoint = Math.round(((evt.clientX - AudioPlayer.progressBar.offset().left) + window.pageXOffset) * 100 / AudioPlayer.progressBar.parent().width());
	console.log({'value': newTimePoint, 'evt.clientX': evt.clientX, 'progressBar leftOffset': AudioPlayer.progressBar.offset().left, 'parent node\'s offset width': AudioPlayer.progressBar.parent().width()});
	AudioPlayer.setNewTime(AudioPlayer.audio.duration * (newTimePoint / 100));
	AudioPlayer.updateLoadedBar(newTimePoint);
	//AudioPlayer.audio.currentTime = AudioPlayer.audio.duration * (value / 100);
	//AudioPlayer.loadedBar.css({'width': value + '%'});
}

function touchBar(evt) {
	var touch = evt.touches[0];
	var newTimePoint = Math.round(((touch.clientX - AudioPlayer.progressBar.offset().left) + window.pageXOffset) * 100 / AudioPlayer.progressBar.parent().width());
	console.log({'value': newTimePoint, 'evt.clientX': evt.clientX, 'progressBar leftOffset': AudioPlayer.progressBar.offset().left, 'parent node\'s offset width': AudioPlayer.progressBar.parent().width()});
	AudioPlayer.setNewTime(AudioPlayer.audio.duration * (newTimePoint / 100));
	AudioPlayer.updateLoadedBar(newTimePoint);
}