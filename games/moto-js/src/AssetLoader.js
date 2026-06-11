/**
 * @date 	April 2013
 * @author	Marc Lester <marc.w.lester@gmail.com>
 * @licence	This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License. 
 *			To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/.
 */

var AssetLoader = Class.extend({
	assets: {},
	manifest: [],
	numAssets: 0,
	loadedAssets: 0,

	onComplete: null,
	onAssetLoaded: null,

	loadManifest: function(manifest, onComplete, onAssetLoaded) {
		this.manifest = manifest;
		this.numAssets = manifest.length;
		this.loadedAssets = 0;
		this.onComplete = onComplete;
		this.onAssetLoaded = onAssetLoaded;

		for (var i = 0; i < this.numAssets; i++) {
			var name = manifest[i].name;
			var src = manifest[i].src;
			var type = manifest[i].type;

			if (type == 'img') {
				this.assets[name] = new Image();
				this.assets[name].onload = gAssetLoader.imageOnload;
				this.assets[name].src = src;
			}

			if (type == 'audio') {
				//gSM.loadAsync(src, gAssetLoader.audioOnload);
			}

			if (type == 'json') {
				var request = new XMLHttpRequest();
				request.open('GET', src, true);
				request.onload = function() {
					var j = JSON.parse(this.response);
					var n = 't' + j.track + 'r' + j.name;
					gAssetLoader.assets[n] = j;
					gAssetLoader.jsonOnload();
				};
				request.send();

				// xhrGet(src, function() {
				// 	var data = this.response;
				// 	var tdata = JSON.parse(data);
				// 	gAssetLoader.assets[name] = tdata;
				// 	gAssetLoader.jsonOnload();
				// });
			}
		}
	},

	imageOnload: function() {
		gAssetLoader.loadedAssets += 1;
		gAssetLoader.onAssetLoaded();

		if (gAssetLoader.loadedAssets == gAssetLoader.numAssets) {
			gAssetLoader.onComplete();
		}
	},

	audioOnload: function(s) {
		gAssetLoader.loadedAssets += 1;
		gAssetLoader.onAssetLoaded();

		if (gAssetLoader.loadedAssets == gAssetLoader.numAssets) {
			gAssetLoader.onComplete();
		}
	},

	jsonOnload: function() {
		gAssetLoader.loadedAssets += 1;
		gAssetLoader.onAssetLoaded();

		if (gAssetLoader.loadedAssets == gAssetLoader.numAssets) {
			gAssetLoader.onComplete();
		}
	}
});

var gAssetLoader = new AssetLoader();