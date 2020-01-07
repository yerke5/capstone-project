var ThemeHandler = {
	themes: {
		"water": {
			"ID": "water",
			"playBtnSrc": imagesFolder + separator + "play-water.svg",
			"primaryColorHex": '#7ecef4',
			"primaryColorRGB": "126, 206, 244",
			"preloadedBarColor": "rgb(126, 206, 244, 0.4)",
			"sliderColor": "#30a7e0",
			"introAudio": audioFolder + separator + "intro-water.m4a",
			"startBtnColor": "#1b4c8a",
			"primaryColorDark": "#000077",
			"secondTagColor": "#ffcccc",
			"thirdTagColor": "#bae628",
			"backgroundVideoSrc": videoFolder + separator + "water.mp4",
			"animation": "Calm Water Waves",
			"recommendedDivImgSrc": imagesFolder + separator + "wave.gif",
			"primaryColorDarker": "#4e84dd",
			"loadingImgSrc": imagesFolder + separator + "loading-water2.gif"
		},
		"air": {
			"ID": "air",
			"playBtnSrc": imagesFolder + separator + "play-air.png",
			"primaryColorHex": '#cedaff',//'#c7cdff',
			"primaryColorDark": "#3709c5",
			"primaryColorRGB": "206, 218, 255",
			"preloadedBarColor": "rgb(206, 218, 255, 0.4)",
			"sliderColor": "#3d4bbf",
			"introAudio": audioFolder + separator + "intro-air.mp3",
			"startBtnColor": "#5744d6",
			"bottomMenuColor": "#3c3f76",
			"secondTagColor": "#daffce",
			"thirdTagColor": "#fff3ce",
			"backgroundVideoSrc": videoFolder + separator + "air.mp4",
			"animation": "Gentle Breeze",
			"recommendedDivImgSrc": imagesFolder + separator + "wind.gif",
			"primaryColorDarker": "#82a0ff",
			"loadingImgSrc": imagesFolder + separator + "loading-air.gif"
		}
	},
	theme: null, // default theme
	getCurrentTheme: function() {
		return this.theme;
	},
	getThemeFromStorage: function(callback) {
		console.log("2. Theme loading from storage started");
		LocalDatabaseHandler.get('currentThemeID', function(results) {
			var len = results.rows.length, i;
			if(len == 0) 
				callback(null);
			else {
				//console.log('results object: ', results.rows);
				callback(results.rows.item(0).value);
			}
		});
	},
	storeThemeInLocalStorage: function(newThemeID, callback) {
		LocalDatabaseHandler.update("currentThemeID", newThemeID, callback);
	},
	setThemeHTML: function(pageName, newThemeID, elemSelectors, callback) {
		console.log("set theme function started");
		var newTheme = this.getThemeById(newThemeID);
		var oldTheme = this.getCurrentTheme();
		console.log("old theme", oldTheme);
		console.log("new theme", newTheme);
		console.log(ThemeHandler.getCurrentTheme().ID);
		
		// common elements
		$(elemSelectors.genericBtn).css({'background-color': newTheme.primaryColorHex});
		$(elemSelectors.bottomMenu).css({"background-color": newTheme.primaryColorHex});
		$(elemSelectors.menuBtn).css({"color": newTheme.primaryColorDark});
		$('h1').css({"color": newTheme.primaryColorDark});
		
		// page-specific elements
		if(pageName == "therapy") {
			console.log("The page is therapy");
			$(elemSelectors.playBtn).attr('src', newTheme.playBtnSrc);
			$(elemSelectors.playBtnMinimized).attr('src', newTheme.playBtnSrc);		
			$(elemSelectors.preloadedBar).css({"background-color": newTheme.preloadedBarColor});
			$(elemSelectors.loadedBar).css({"background-color": newTheme.primaryColorHex});
			//$(elemSelectors.playBtnMinimized).css({"background-color": newTheme.primaryColor});
			$(elemSelectors.slider).css({"background-color": newTheme.sliderColor});
			$(elemSelectors.startBtn).css({"background-color": newTheme.startBtnColor});
			$(elemSelectors.firstTag).css({"background-color": newTheme.primaryColorHex});
			$(elemSelectors.secondTag).css({"background-color": newTheme.secondTagColor});
			$(elemSelectors.thirdTag).css({"background-color": newTheme.thirdTagColor});
			$(elemSelectors.backgroundVideo).attr('src', newTheme.backgroundVideoSrc);
			$(elemSelectors.selectedThemeDiv).css({'border':'5px solid ' + newTheme.primaryColorHex});
			$(elemSelectors.recommendedDiv).css({"background": "url(" + newTheme.recommendedDivImgSrc + ") no-repeat", "background-size": "cover"});
			$(elemSelectors.loadingImg).attr('src', newTheme.loadingImgSrc);
		} else if(pageName == 'index') {
			console.log("The page is index");
			$(elemSelectors.startBtn).css({"background-color": newTheme.startBtnColor});
		} else if(pageName == "intro") {
			console.log("The page is intro");
			$('body').css({'background-image':'linear-gradient(to bottom, rgb(' + newTheme.primaryColorRGB + ', 1), rgb(' + newTheme.primaryColorRGB + ', 0))'});
		} else if(pageName == "sessionComplete") {
			console.log("The page is sessionComplete");
			
		} else {
			console.log("The page is unknown or no special css required");
		}
			
		// finally update the theme object
		this.theme = newTheme;
		
		if(callback != null) callback();
	},
	/*loadTheme: function(pageName, elemSelectors, callback) {
		var self = this;
		this.init(function(themeFromStorage) {
			//var currentTheme = self.getCurrentTheme();
			if(themeFromStorage != self.themes.water.ID)
				self.setTheme(pageName, themeFromStorage, elemSelectors, callback);
		});
	},*/
	getThemeById: function(themeID) {
		return this.themes[themeID];
	},
	updateTheme: function(newThemeID) {
		this.theme = this.getThemeById(newThemeID);
	},
	init: function(pageName, elemSelectors, callback) {
		// figure out which theme to use: the default or the one from memory
		console.log("1. Initialisation started");
		var self = this;
		self.getThemeFromStorage(function(themeFromStorage){
			console.log("3. Theme update started");
			if(themeFromStorage == null) {
				console.log("no theme in storage; setting theme to water: ", self.themes.water);
				//self.theme = self.themes.water;
				self.updateTheme(self.themes.water);
				LocalDatabaseHandler.insert('currentThemeID', self.themes.water.ID, callback);
			} else if(themeFromStorage != self.themes.water.ID) {
				console.log("theme found in storage; setting theme to theme from storage: ", themeFromStorage);
				//self.theme = self.getThemeById(themeFromStorage);
				self.updateTheme(themeFromStorage);
				self.setThemeHTML(pageName, themeFromStorage, elemSelectors, callback);
			} else {
				//self.setThemeHTML(pageName, 'water', elemSelectors, callback)
				self.updateTheme('water');
				if(callback != null) callback(themeFromStorage);
			}
		});
	}
}