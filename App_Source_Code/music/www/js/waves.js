function createWaves(num, divID) {
	var ocean = document.getElementById(divID),
	 waveWidth = 10,
	 waveCount = Math.floor(ocean.offsetWidth/waveWidth),
	 docFrag = document.createDocumentFragment();
	console.log(ocean.offsetWidth, waveCount);
	for(var i = 0; i < waveCount; i++){
		var wave = document.createElement("div");
		wave.className += " wave" + num;
		docFrag.appendChild(wave);
		wave.style.left = i * waveWidth + "px";
		wave.style.webkitAnimationDelay = (i/100) + "s";

		var wave_middle = document.createElement("div");
		wave_middle.className += " wave_middle" + num;
		docFrag.appendChild(wave_middle);
		wave_middle.style.left = i * waveWidth + "px";
		wave_middle.style.webkitAnimationDelay = (i/91) + "s";

		var wave_bottom = document.createElement("div");
		wave_bottom.className += " wave_bottom" + num;
		docFrag.appendChild(wave_bottom);
		wave_bottom.style.left = i * waveWidth + "px";
		wave_bottom.style.webkitAnimationDelay = (i/97) + "s";

		var wave_light = document.createElement("div");
		wave_light.className += " wave_light" + num;
		docFrag.appendChild(wave_light);
		wave_light.style.left = i * waveWidth + "px";
		wave_light.style.webkitAnimationDelay = 0 + "s";
	}
	ocean.appendChild(docFrag);
}