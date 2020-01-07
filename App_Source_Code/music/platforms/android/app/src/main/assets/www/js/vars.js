var MUSIC_API_URL = "https://67d74svav8.execute-api.us-east-2.amazonaws.com/music-therapy";
var commonElemSelectors = {
	"menuBtn": "#menuBtn span",
	"bottomMenu": "#bottomMenu",
	"genericBtn": ".button"
};
const imagesFolder = "img";
const audioFolder = "audio";
const videoFolder = "video";
const separator = "/";

var bottomMenu = "<div id='bottomMenu'> \
					<table> \
						<tr> \
							<td> \
								<span id='recommendedBtn' data='recommendedPage' class='bottomMenuBtn glyphicon glyphicon-star'></span> \
								<span class='bottomMenuDesc'>Recommended</span> \
							</td> \
							<td> \
								<span id='libraryBtn' data='libraryPage' class='bottomMenuBtn glyphicon glyphicon-music'></span> \
								<span class='bottomMenuDesc'>Library</span> \
							</td> \
							<td> \
								<span id='statsBtn' data='statsPage' class='bottomMenuBtn glyphicon glyphicon-stats'></span> \
								<span class='bottomMenuDesc'>Stats</span> \
							</td> \
							<td> \
								<span id='customisationBtn' data='customisationPage' class='bottomMenuBtn glyphicon glyphicon-edit'></span> \
								<span class='bottomMenuDesc'>Customise</span> \
							</td> \
						</tr> \
					</table> \
				</div>";