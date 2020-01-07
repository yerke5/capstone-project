var parts = [
	/*{
		'name': 'Part 1: Setting Up',
		'desc': 'First, please think of a username. You don\'t have to enter your name. This way the app will remember your music preferences.',
		'questions': [
			{
				"question": "Please enter a username",
				"image": "",
				"key": "name",
				"body": "<input placeholder='Please enter a username' type='text' id='name' style='width:100%;padding:15px;border:0.5px solid #ccc;border-radius:5px'/>"
			}
		]
	},*/
	{
		'name': 'Part 1: Measuring Your Anxiety',
		'desc': 'We need to know your level of anxiety to know how to better tailor therapy sessions to You.',
		'questions': [
			{
				"question": "In the last 2 weeks, how often did you feel nervous?",
				"key": "nervousnessLevel",
				"image": "img/anxiety.jpg",
				"image-width": 100
			},
			{
				"question": "In the last 2 weeks, how often did you worry uncontrollably?",
				"key": "worryLevel",
				"image": "img/worry.png",
				"image-width": 50,
				"body": '<div style="margin-top:10%"><span style="width:50%;text-align:left;font-family:Raleway;display:inline-block">Not at all sure</span><span style="width:50%;display:inline-block;text-align:right;font-family:Raleway">Nearly every day</span><br><input id="worryLevel" type="range" class="slider" min=0 max=3 value=0 /></div>',
				
			},
			{
				"question": "In the last 2 weeks, how often did you have trouble relaxing?",
				"key": "relaxingLevel",
				"image": "img/relax.jpg",
				"image-width": 100,
				"body": '<div style="margin-top:10%"><span style="width:50%;text-align:left;font-family:Raleway;display:inline-block">Not at all sure</span><span style="width:50%;display:inline-block;text-align:right;font-family:Raleway">Nearly every day</span><br><input id="relaxingLevel" type="range" class="slider" min=0 max=3 value=0 /></div>',
				
			},
			{
				"question": "In the last 2 weeks, how often did you feel restless?",
				"key": "restlessnessLevel",
				"image": "img/rest.jpg",
				"image-width": 100,
				"body": '<div style="margin-top:10%"><span style="width:50%;text-align:left;font-family:Raleway;display:inline-block">Not at all sure</span><span style="width:50%;display:inline-block;text-align:right;font-family:Raleway">Nearly every day</span><br><input id="restlessnessLevel" type="range" class="slider" min=0 max=3 value=0 /></div>',
				
			},
			{
				"question": "In the last 2 weeks, how often did you become easily annoyed?",
				"key": "irritationLevel",
				"image": "img/irritation.jpg",
				"image-width": 50,
				"body": '<div style="margin-top:10%"><span style="width:50%;text-align:left;font-family:Raleway;display:inline-block">Not at all sure</span><span style="width:50%;display:inline-block;text-align:right;font-family:Raleway">Nearly every day</span><br><input id="irritationLevel" type="range" class="slider" min=0 max=3 value=0 /></div>',
				
			},
			{
				"question": "In the last 2 weeks, how often did you feel as if something bad might happen?",
				"key": "fearLevel",
				"image": "img/fear.jpg",
				"image-width": 100,
				"body": '<div style="margin-top:10%"><span style="width:50%;text-align:left;font-family:Raleway;display:inline-block">Not at all sure</span><span style="width:50%;display:inline-block;text-align:right;font-family:Raleway">Nearly every day</span><br><input id="fearLevel" type="range" class="slider" min=0 max=3 value=0 /></div>',
				
			}
		]
	},
	{
		'name': 'Part 2: Your Colour Preferences',
		'desc': 'We need to know your colour preferences to set up the app design.',
		'questions': [
			{
				"question": "What colour do you associate with anxiety?",
				"key": "anxietyColor",
				"image": ""
			},
			{
				"question": "What colour do you associate with happiness?",
				"key": "happinessColor",
				"image": ""
				
			},
			{
				"question": "What colour looks most calming?",
				"key": "calmnessColor",
				"image": ""
			}
		]
	},
	{
		'name': 'Part 3: Your Music Preferences',
		'desc': 'We need to know your music preferences to better tailor our therapy sessions to You :) Don\'t worry, none of the stuff You share is going to be disclosed to anyone (well, except You, of course ^^)',
		'questions': [
			{
				'question': 'Which instrument do you prefer?',
				'comment': 'You can choose more than one',
				'key': 'instrumentPreference',
				'image': '',
				'body': ''
			},
			{
				'question': 'Which tempo do you prefer?',
				'comment': 'You can choose more than one',
				'key': 'tempoPreference',
				'image': '',
				'body': ''
			},
			{
				'question': 'Which genre do you prefer?',
				'comment': 'You can choose more than one',
				'key': 'genrePreference',
				'image': '',
				'body': ''
			}
		]
	}
]

//console.log('Parts:', parts);

var audioObjects = {
	'instrument': [
		{
			'name': 'flute', 
			'audio': null,
			'status': 'stopped'
		},
		{
			'name': 'piano', 
			'audio': null,
			'status': 'stopped'
		},
		{
			'name': 'guitar', 
			'audio': null,
			'status': 'stopped'
		},
		{
			'name': 'harp', 
			'audio': null,
			'status': 'stopped'
		}, 
		{
			'name': 'saxophone', 
			'audio': null,
			'status': 'stopped'
		},
		{
			'name': 'tuba', 
			'audio': null,
			'status': 'stopped'
		},
	],
	'tempo': [
		{
			'name': 'fast', 
			'audio': null,
			'status': 'stopped'
		},
		{
			'name': 'medium', 
			'audio': null,
			'status': 'stopped'
		},
		{
			'name': 'slow', 
			'audio': null,
			'status': 'stopped'
		}
	],
	'genre': [
		{
			'name': 'classical', 
			'audio': null,
			'status': 'stopped'
		},
		{
			'name': 'hip-hop', 
			'audio': null,
			'status': 'stopped'
		},
		{
			'name': 'pop', 
			'audio': null,
			'status': 'stopped'
		},
		{
			'name': 'rock', 
			'audio': null,
			'status': 'stopped'
		}, 
		{
			'name': 'folk', 
			'audio': null,
			'status': 'stopped'
		},
		{
			'name': 'electronic', 
			'audio': null,
			'status': 'stopped'
		},
		{
			'name': 'jazz', 
			'audio': null,
			'status': 'stopped'
		}
	]
}

var answers = [];

var curPartIndex = 0;
var curQuestionIndex = -1;
var curPlaying = null;
//var curAudioObjectIndex = 0;

function getKeyValue(question) {
	// get key
	var key = question.key;
	
	// get value
	var value = "";
	if(question.key.toLowerCase().indexOf("color") >= 0) {
		value = $('.selected-cell').first().css('background-color');
	} else if(question.key.toLowerCase().indexOf("preference") >= 0) {
		var selectedOptions = $('.selected-cell');
		var values = [];
		for(var i = 0; i < selectedOptions.length; i++) {
			values.push($(selectedOptions[i]).attr('id'));
		}
		value = values.join(",");
	} else {
		value = $('#' + question.key).val();
	}
	return {"key": key, "value": value}
}

// build question bodies
function prepareGadSlider(questionObject) {
	questionObject.body = '<div class="numberInputSlider"> \
		<span>Not at all</span> \
		<span style="text-align:right">Nearly every day</span> \
		<br> \
		<input id="' + questionObject.key + '" type="range" class="slider" min=0 max=3 value=0 /> \
	</div>';
}

function prepareColorTable(questionObject) {
	colors = ['7ecef4', 'FFCCCC', 'bae628', 'ffffff', '000000', 'cccccc', '6b301f', 'e33d77', '95adf5', 'ffbf00'];
	var open = false;
	questionObject.body = '<table class="colorTable" id="' + questionObject.key + '" style="width:100%">';
	for(var j = 0; j < colors.length; j++) {
		if(j % 3 == 0) {
			questionObject.body += '<tr>';
			open = true;
		}
		questionObject.body += '<td class="color-cell-td">' + 
		'<div onclick="$(\'.selected-cell\').first().removeClass(\'selected-cell\');$(this).addClass(' + '\'selected-cell\'' + ')" class="color-cell" style="background-color:#' + colors[j] + '">' + 
		'</div></td>';
		if((j + 1) % 3 == 0) {
			questionObject.body += '</tr>';
			open = false;
		}
	}
	if(open) questionObject.body += '</tr>';
	questionObject.body += '</table>';	
}

function buildAudio(id) {
	for(var i = 0; i < audioObjects[id].length; i++) {
		var temp = new Audio();
		temp.src = audioFolder + separator + audioObjects[id][i].name + '.mp3';
		audioObjects[id][i].audio = temp;		
	}
}

function prepareAudio(questionObject) {
	var open = false;
	questionObject.body += '<table id="' + questionObject.key + '" style="width:100%;border-spacing:5px;border-collapse:separate">';
	//var id = questionObject.key.split('-')[0];
	var id = questionObject.key.replace('Preference', '');
	console.log('Audio Object ID:', id);
	// determine td width
	var tdWidth = 33;
	if(audioObjects[id].length == 2) {
		tdWidth = 50;
	} else if(audioObjects[id].length == 1) {
		tdWidth = 100;
	}
	for(var j = 0; j < audioObjects[id].length; j++) {
		if(j % 3 == 0) {
			questionObject.body += '<tr>';
			open = true;
		}
		//var clickHandler = "play(\"" + id + "\", " + j + ");$(\".selected-cell\").first().removeClass(\"selected-cell\");$(this).addClass(\"selected-cell\");";
		var audioBitClickHandler = "$(this).toggleClass(\"selected-cell\");";
		var audioBitButtonHandler = "play(\"" + id + "\", " + j + ")";
		questionObject.body += '<td style="width:' + tdWidth + '%">' + 
									"<div class='audioBit' id='" + audioObjects[id][j].name + "' onclick='" + audioBitClickHandler + "'>" +  
										"<img src='" + imagesFolder + separator + audioObjects[id][j].name + ".jpg' />" +
										"<div class='main' style='position:absolute;top:0;bottom:0;left:0;right:0'>" + 
											"<div class='wrapper'>" + 
												'<div class="audioBitOverlay" ' + 
													"onclick='" + audioBitButtonHandler + "'>" + 
													"<div class='main'>" + 
														"<div class='wrapper'>" + 
															"<span id='" + audioObjects[id][j].name + "Span' class='glyphicon glyphicon-play'></span>" + 
														"</div>" + 
													"</div>" + 
												"</div>" + 
											"</div>" + 
										"</div>" + 
									"</div>" +
									"<p style='text-align:center;font-size:0.8em'>" + audioObjects[id][j].name.charAt(0).toUpperCase() + audioObjects[id][j].name.slice(1) + "</p>" + 
								"</td>";
		if((j + 1) % 3 == 0) {
			questionObject.body += '</tr>';
			open = false;
		}
	}
	if(open) questionObject.body += '</tr>';
	questionObject.body += '</table>';	
	/*for(var i = 0; i < audioObjects[id].length; i++) {
		html += "<div id='" + audioObjects[id][i].name + "Bit' class='audioBit'>" +
					"<img src='" + imagesFolder + separator + audioObjects[id][i].name + ".jpg' />" +
					"<div class='audioBitOverlay' \
						onclick='play('" + id + "', " + i + ")'> \
						<span id='" + audioObjects[id][i].name + "Span' class='glyphicon glyphicon-play'></span> \
					</div> \
				</div>";
	}
	html += "</div>";*/
	//questionObject.body = html;
}

function play(id, audioIndex) {
	if(audioObjects[id][audioIndex].status == 'stopped' || audioObjects[id][audioIndex].status == 'paused') {
		// pause currently playing audio
		if(curPlaying != null) {
			audioObjects[curPlaying.id][curPlaying.audioIndex].audio.pause();
			$('#' + audioObjects[curPlaying.id][curPlaying.audioIndex].name + 'Span').removeClass('glyphicon-pause').addClass('glyphicon-play');
			audioObjects[curPlaying.id][curPlaying.audioIndex].status = 'paused';
		}
		audioObjects[id][audioIndex].audio.play();
		$('#' + audioObjects[id][audioIndex].name + 'Span').removeClass('glyphicon-play').addClass('glyphicon-pause');
		audioObjects[id][audioIndex].status = 'playing';
		curPlaying = {"id": id, "audioIndex": audioIndex};
	} else if(audioObjects[id][audioIndex].status == 'playing') {
		audioObjects[id][audioIndex].audio.pause();
		$('#' + audioObjects[id][audioIndex].name + 'Span').removeClass('glyphicon-pause').addClass('glyphicon-play');
		audioObjects[id][audioIndex].status = 'paused';
		curPlaying = null;
	}
}

function insertAllDB(answers, callback) {
	console.log("insertAllDB(): Ready to go!");
	for(var i = 0; i < answers.length; i++) {
		(function(index){
			LocalDatabaseHandler.insert(
				answers[index].key, 
				answers[index].value, 
				function() {
					;//console.log("insert(): insertion", index, "complete");
				}, false
			);
		})(i);
	} 
	console.log("addUserInfo(): trying to add user info to aws");
			
	// prepare user info object
	var userInfo = {
		'type': 'questionnaireAnswers'
	};
	for(var i = 0; i < answers.length; i++) {
		if(!answers[i].key.toLowerCase().includes('level'))
			userInfo[answers[i].key] = answers[i].value;
	}
	console.log("USERINFO Object:", userInfo);
	RemoteDatabaseHandler.addUserInfo(
		JSON.stringify(userInfo), 
		callback, 
		function(e) {
			MessageHandler.showError("Error adding user info to AWS " + e.responseText);
		}
	);
}

function calculateAnxietyScore(answers) {
	var score = 0;
	for(var i = 0; i < answers.length; i++) {
		if(answers[i].key.toLowerCase().indexOf("level") >= 0) {
			score += parseInt(answers[i].value);
		}
	}
	return score;
}	

// prepare click handlers
function showPart(curPartIndex) {
	console.log('Current part index:', curPartIndex, '|| Current question index:', curQuestionIndex);
	console.log('Current Part: ', parts[curPartIndex]);
	if(curPartIndex >= parts.length) {
		answers.push({"key": "anxietyScore", "value": calculateAnxietyScore(answers)});
		window.localStorage.setItem("anxietyScore", calculateAnxietyScore(answers));
		insertAllDB(answers, function() {
			window.location.href = 'results.html';
		});
	} else {
		html = '<h1 style="margin-top:20%">' + parts[curPartIndex].name + '</h1>' + '<br>' +
				'<p>' + parts[curPartIndex].desc + '</p>' + '<br>' +
				'<button class="button smaller" id="part' + curPartIndex + '">Start</button>';
		
		$('#question').html(html);
		ThemeHandler.setThemeHTML("questions", ThemeHandler.getCurrentTheme().ID, commonElemSelectors, function(){
			console.log("setThemeHTML(): Part Customisation Complete");
		});
		/*if(curQuestionIndex >= parts[curPartIndex].questions.length) {
			curPartIndex += 1;
			curQuestionIndex = -1;
		} else {
			curQuestionIndex += 1;
		}*/
		curQuestionIndex = 0;
			
		$('#part' + curPartIndex).click(function(){
			showQuestion(curPartIndex, curQuestionIndex);
		});
	}
}

function showQuestion(curPartIndex, curQuestionIndex) {
	console.log('Current part index:', curPartIndex, '|| Current question index:', curQuestionIndex);
	
	if(curQuestionIndex == -1) {
		showPart(curPartIndex);
		return;
	}
	
	questionObject = parts[curPartIndex].questions[curQuestionIndex];
	
	html = "<div id=q" + curQuestionIndex + ">" + 
				"<h1>" + questionObject.question + "</h1>";
	if('comment' in questionObject) {
		html += "<p>" + questionObject.comment + "/p>";
	}
	if(questionObject.image != "") {
		html += "<div style='text-align:center'>" +
					"<img style='width:" + questionObject["image-width"] + "%;margin-top:5%' src='" + questionObject.image + "' />" + 
				"</div>"; 
	}
	html += questionObject.body;
	html += "<button id='next" + curQuestionIndex + "' class='button' style='margin-top:5%'>Next</button>" + 
			"</div>";
	
	$('#question').html(html);	
	ThemeHandler.setThemeHTML("questions", ThemeHandler.getCurrentTheme().ID, commonElemSelectors, function(){
		console.log("setThemeHTML(): question customisation complete");
	});
	
	$('#next' + curQuestionIndex).on('click', function() {
		if(curPlaying != null) {
			audioObjects[curPlaying.id][curPlaying.audioIndex].audio.pause();
		}
		answers.push(getKeyValue(questionObject));
		
		if(curQuestionIndex + 1 >= parts[curPartIndex].questions.length) {
			curPartIndex += 1;
			curQuestionIndex = -1;
		} else {
			curQuestionIndex += 1;
		}	
		
		showQuestion(curPartIndex, curQuestionIndex);
		console.log('Answers:', answers);
	});
}

function getNumQuestions() {
	var numQuestions = 0;
	for(var i = 0; i < parts.length; i++) {
		numQuestions += parts[i].questions.length;
	}
	return numQuestions;
}

// only initialise in questions.html
var path = window.location.pathname;
var page = path.split("/").pop();
if(page == 'questions.html') {
	buildAudio('instrument');
	buildAudio('tempo');
	buildAudio('genre');
	console.log('audioObjects:', audioObjects);

	// populate question bodies			
	for(var i = 0; i < parts.length; i++) {
		for(var j = 0; j < parts[i]['questions'].length; j++) {
			if(parts[i]['questions'][j].key.toLowerCase().includes('color')) 
				prepareColorTable(parts[i]['questions'][j]);
			else if(parts[i]['questions'][j].key.toLowerCase().includes('level')) {
				prepareGadSlider(parts[i]['questions'][j]);
			} else if(parts[i]['questions'][j].key.toLowerCase().includes('preference')) {
				prepareAudio(parts[i]['questions'][j]);
				console.log("Part with prepared audio", parts[i]['questions'][j]);
			}
		}
	}
}