/**
 * @date 	April 2013
 * @author	Marc Lester <marc.w.lester@gmail.com>
 * @licence	This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License. 
 *			To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/.
 */

var manifest = [
{ type: 'img', src: 'assets/img/title.png', name: 'title'},
{ type: 'img', src: 'assets/img/background2.png', name: 'background'},
{ type: 'img', src: 'assets/img/bike-body-red.png', name: 'bike-body-red'},
{ type: 'img', src: 'assets/img/helmet-red.png', name: 'helmet-red'},
{ type: 'img', src: 'assets/img/bike-body-green.png', name: 'bike-body-green'},
{ type: 'img', src: 'assets/img/helmet-green.png', name: 'helmet-green'},
{ type: 'img', src: 'assets/img/bike-body-blue.png', name: 'bike-body-blue'},
{ type: 'img', src: 'assets/img/helmet-blue.png', name: 'helmet-blue'},
{ type: 'img', src: 'assets/img/bike-body-yellow.png', name: 'bike-body-yellow'},
{ type: 'img', src: 'assets/img/helmet-yellow.png', name: 'helmet-yellow'},
{ type: 'img', src: 'assets/img/ramp1.png', name: 'ramp1'},
{ type: 'img', src: 'assets/img/ramp2.png', name: 'ramp2'},
{ type: 'img', src: 'assets/img/ramp3.png', name: 'ramp3'},
{ type: 'img', src: 'assets/img/ramp4.png', name: 'ramp4'},
{ type: 'img', src: 'assets/img/ramp5.png', name: 'ramp5'},
{ type: 'img', src: 'assets/img/ramp6.png', name: 'ramp6'},
{ type: 'img', src: 'assets/img/wheel.png', name: 'wheel'},

{ type: 'img', src: 'assets/img/finish.png', name: 'finish'},
{ type: 'img', src: 'assets/img/gate-up.png', name: 'gate-up'},
{ type: 'img', src: 'assets/img/gate-down.png', name: 'gate-down'},
{ type: 'json', src: 'assets/records/track1-record1.json', name: 't1r1'},
{ type: 'json', src: 'assets/records/track1-record2.json', name: 't1r2'},
// { type: 'audio', src: 'assets/audio/intro.mp3', name: 'intro-music'},
// { type: 'audio', src: 'assets/audio/track.mp3', name: 'track-music'},
// { type: 'audio', src: 'assets/audio/motor2.wav', name: 'drive'},
// { type: 'audio', src: 'assets/audio/motor3.wav', name: 'overdrive'}
];

jQuery(document).ready(function() {
	jQuery('#screen-load').show();
	jQuery('#assets-loaded').html("0");
	jQuery('#assets-total').html(manifest.length);
	//gSM.create();
	gAssetLoader.loadManifest(manifest, function() { 
		jQuery('#screen-load').hide();
		gBikeGame.run();
	}, function() {
		jQuery('#assets-loaded').html(gAssetLoader.loadedAssets);
		jQuery('#asset-bar').css('width', ((gAssetLoader.loadedAssets / manifest.length) * 100) + "%")
	});
	//gBikeGame.run();
});