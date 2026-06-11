/**
 * @date 	April 2013
 * @author	Marc Lester <marc.w.lester@gmail.com>
 * @licence	This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License. 
 *			To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/.
 */

var RenderEngine = Class.extend({
	scale: 20,

	images: {},

	drawGateUp: true,

	playerColors: {
		1: 'red',
		2: 'green',
		3: 'blue',
		4: 'yellow'
	},

	init: function() {
	},

	resetRenderer: function() {
		this.drawGateUp = true;
	},

	loadContent: function() {
		
		var background = gAssetLoader.assets['background'];
		this.images['background'] = {
			img: background,
			width: background.width,
			height: background.height,
			half_width: background.width / 2,
			half_height: background.height / 2,
			x_offset: 0,
			y_offset: 0
		};
		this.images['bikes'] = {};

		var redbike = gAssetLoader.assets['bike-body-red'];
		this.images['bikes']['red'] = {
			img: redbike,
			width: redbike.width,
			height: redbike.height,
			half_width: redbike.width / 2,
			half_height: redbike.height / 2,
			x_offset: 0,
			y_offset: -10
		};
		var greenbike = gAssetLoader.assets['bike-body-green'];
		this.images['bikes']['green'] = {
			img: greenbike,
			width: greenbike.width,
			height: greenbike.height,
			half_width: greenbike.width / 2,
			half_height: greenbike.height / 2,
			x_offset: 0,
			y_offset: -10
		};
		var bluebike = gAssetLoader.assets['bike-body-blue'];
		this.images['bikes']['blue'] = {
			img: bluebike,
			width: bluebike.width,
			height: bluebike.height,
			half_width: bluebike.width / 2,
			half_height: bluebike.height / 2,
			x_offset: 0,
			y_offset: -10
		};
		var yellowbike = gAssetLoader.assets['bike-body-yellow'];
		this.images['bikes']['yellow'] = {
			img: yellowbike,
			width: yellowbike.width,
			height: yellowbike.height,
			half_width: yellowbike.width / 2,
			half_height: yellowbike.height / 2,
			x_offset: 0,
			y_offset: -10
		};

		
		this.images['helmets'] = {};
		var redhelmet = gAssetLoader.assets['helmet-red'];
		this.images['helmets']['red'] = {
			img: redhelmet,
			width: redhelmet.width,
			height: redhelmet.height,
			half_width: redhelmet.width / 2,
			half_height: redhelmet.height / 2,
			x_offset: 10,
			y_offset: -60,
		};
		var greenhelmet = gAssetLoader.assets['helmet-green'];
		this.images['helmets']['green'] = {
			img: greenhelmet,
			width: greenhelmet.width,
			height: greenhelmet.height,
			half_width: greenhelmet.width / 2,
			half_height: greenhelmet.height / 2,
			x_offset: 10,
			y_offset: -60,
		};
		var bluehelmet = gAssetLoader.assets['helmet-blue'];
		this.images['helmets']['blue'] = {
			img: bluehelmet,
			width: bluehelmet.width,
			height: bluehelmet.height,
			half_width: bluehelmet.width / 2,
			half_height: bluehelmet.height / 2,
			x_offset: 10,
			y_offset: -60,
		};
		var yellowhelmet = gAssetLoader.assets['helmet-yellow'];
		this.images['helmets']['yellow'] = {
			img: yellowhelmet,
			width: yellowhelmet.width,
			height: yellowhelmet.height,
			half_width: yellowhelmet.width / 2,
			half_height: yellowhelmet.height / 2,
			x_offset: 10,
			y_offset: -60,
		};

		var wheel = gAssetLoader.assets['wheel'];
		this.images['wheel'] = {
			img: wheel,
			width: wheel.width,
			height: wheel.height,
			half_width: wheel.width / 2,
			half_height: wheel.height / 2
		};

		var ramp1 = gAssetLoader.assets['ramp1'];
		this.images['ramp1'] = {
			img: ramp1,
			width: ramp1.width,
			height: ramp1.height,
			half_width: ramp1.width / 2,
			half_height: ramp1.height / 2,
			x_offset: 0,
			y_offset: -9
		};

		var ramp2 = gAssetLoader.assets['ramp2'];
		this.images['ramp2'] = {
			img: ramp2,
			width: ramp2.width,
			height: ramp2.height,
			half_width: ramp2.width / 2,
			half_height: ramp2.height / 2,
			x_offset: -18,
			y_offset: -20
		};
		var ramp3 = gAssetLoader.assets['ramp3'];
		this.images['ramp3'] = {
			img: ramp3,
			width: ramp3.width,
			height: ramp3.height,
			half_width: ramp3.width / 2,
			half_height: ramp3.height / 2,
			x_offset: 280,
			y_offset: -80
		};
		var ramp4 = gAssetLoader.assets['ramp4'];
		this.images['ramp4'] = {
			img: ramp4,
			width: ramp4.width,
			height: ramp4.height,
			half_width: ramp4.width / 2,
			half_height: ramp4.height / 2,
			x_offset: 0,
			y_offset: -25
		};
		var ramp5 = gAssetLoader.assets['ramp5'];
		this.images['ramp5'] = {
			img: ramp5,
			width: ramp5.width,
			height: ramp5.height,
			half_width: ramp5.width / 2,
			half_height: ramp5.height / 2,
			x_offset: 30,
			y_offset: -25
		};
		var ramp6 = gAssetLoader.assets['ramp6'];
		this.images['ramp6'] = {
			img: ramp6,
			width: ramp6.width,
			height: ramp6.height,
			half_width: ramp6.width / 2,
			half_height: ramp6.height / 2,
			x_offset: 35,
			y_offset: -25
		};

		var gateup = gAssetLoader.assets['gate-up'];
		this.images['gateup'] = {
			img: gateup,
			width: gateup.width,
			height: gateup.height,
			half_width: gateup.width / 2,
			half_height: gateup.height / 2,
			x_offset: -5,
			y_offset: 388
		};
		var gatedown = gAssetLoader.assets['gate-down'];
		this.images['gatedown'] = {
			img: gatedown,
			width: gatedown.width,
			height: gatedown.height,
			half_width: gatedown.width / 2,
			half_height: gatedown.height / 2,
			x_offset: 3,
			y_offset: 395
		};
		var finish = gAssetLoader.assets['finish'];
		this.images['finish'] = {
			img: finish,
			width: finish.width,
			height: finish.height,
			half_width: finish.width / 2,
			half_height: finish.height / 2,
			x_offset: 0,
			y_offset: 441
		};
		jQuery('#rpm-gauge').gauge({
			min: 0,
			max: 10000,
			label: 'RPM',
			bands: [
				{color: "#ffff00", from: 6000, to: 8000},
				{color: "#ff0000", from: 8000, to: 10000}
			]
		}).gauge('setValue', 0);
		jQuery('#speed-gauge').gauge({
			min: 0,
			max: 100,
			label: 'KM/H'
		}).gauge('setValue', 0);
		jQuery('#boost-gauge').gauge({
			min: 0,
			max: 100,
			label: 'NOS'
		}).gauge('setValue', 0);
	},

	render: function(ctx, x, y) {
		var oy = y;
		this.renderBg(ctx, x, y);
		this.renderFinish(ctx, x, y, gBikeGame.screens['race'].endPos);
		for (var p = 1; p <= 4; p++) {
			y = (30 * (p-1)) + oy;
			
			if (this.drawGateUp) {
				this.renderGateUp(ctx, x, y);
			} else {
				this.renderGateDown(ctx, x, y);
			}
			
			var ramps = gPhysicsEngine.bodies[p].ramps;
			for (var i = 0; i < ramps.length; i++) {
				var name = ramps[i].GetUserData().name;
				switch (name) {
					case "ramp1":
					this.renderRamp1(ctx, x, y, ramps[i]);
					break;
					case "ramp2":
					this.renderRamp2(ctx, x, y, ramps[i]);
					break;
					case "ramp3":
					this.renderRamp3(ctx, x, y, ramps[i]);
					break
					case "ramp4":
					this.renderRamp4(ctx, x, y, ramps[i]);
					break;
					case "ramp5":
					this.renderRamp5(ctx, x, y, ramps[i]);
					break;
					case "ramp6":
					this.renderRamp6(ctx, x, y, ramps[i]);
					break;
				}
			}
			//var b = this.blur(ctx, 0, 0, ctx.width, ctx.height, 5, 0, 10);
			//if (!b) console.log('no blur');
			this.renderFrontWheel(ctx, x, y, p);
			this.renderRearWheel(ctx, x, y, p);
			this.renderBike(ctx, x, y, p);
			//this.renderHelmet(ctx, x, y);
		}

		jQuery('#rpm-gauge').gauge('setValue', gBikeGame.screens['race'].torqueValue * 10);
		jQuery('#speed-gauge').gauge('setValue', Math.max(gPhysicsEngine.bodies[1].bike.base.GetLinearVelocity().x * 2, 0));
		jQuery('#boost-gauge').gauge('setValue', (gBikeGame.screens['race'].boostCount / gBikeGame.screens['race'].maxBoostCount) * 100);
	},

	renderBg: function(ctx, x, y) {
		var bg = this.images['background'];
		var bikex = gPhysicsEngine.bodies[1].bike.base.GetPosition().x;
		var bg_offset = (bikex * this.scale + x) % bg.width;
		ctx.drawImage(bg.img, 0 - bg_offset, 0 + y);
		ctx.drawImage(bg.img, bg.width - bg_offset, 0 + y);
		ctx.drawImage(bg.img, (bg.width * 2) - bg_offset, 0 + y);
		ctx.drawImage(bg.img, (bg.width * 3) - bg_offset, 0 + y);
	},

	renderBike: function(ctx, x, y, p) {
		var track = gPhysicsEngine.bodies[p].track.GetPosition();
		var bodyPos = gPhysicsEngine.bodies[p].bike.base.GetPosition();
		var bodyAngle = gPhysicsEngine.bodies[p].bike.base.GetAngle();
		var baseOffset = gPhysicsEngine.bodies[1].bike.base.GetPosition().x;
		var color = this.playerColors[p];
		var base = this.images.bikes[color];
		var helmet = this.images.helmets[color];
		var body_cx = (bodyPos.x - baseOffset) * this.scale + x;
		var body_cy = ((bodyPos.y - track.y + 20) * this.scale) + y;

		ctx.save();
		ctx.translate(body_cx, body_cy);
		ctx.rotate(bodyAngle);
		ctx.drawImage(base.img, -base.half_width + base.x_offset, -base.half_height + base.y_offset);
		ctx.drawImage(helmet.img, -helmet.half_width + helmet.x_offset, -helmet.half_height + helmet.y_offset);
		ctx.restore();
	},

	renderHelmet: function(ctx, x, y) {

	},

	renderFrontWheel: function(ctx, x, y, p) {
		var track = gPhysicsEngine.bodies[p].track.GetPosition();
		var pos = gPhysicsEngine.bodies[p].bike.fwheel.GetPosition();
		var angle = gPhysicsEngine.bodies[p].bike.fwheel.GetAngle();
		var offset = gPhysicsEngine.bodies[1].bike.base.GetPosition().x;
		var image = this.images.wheel;
		var wheel_cx = ((pos.x - offset) * this.scale) + x;
		var wheel_cy = ((pos.y - track.y + 20) * this.scale) + y;
		//console.log(wheel_cy);
		
		ctx.save();
		ctx.translate(wheel_cx, wheel_cy);
		ctx.rotate(angle);
		ctx.drawImage(image.img, -image.half_width, -image.half_height);
		ctx.restore();
	},

	renderRearWheel: function(ctx, x, y, p) {
		var track = gPhysicsEngine.bodies[p].track.GetPosition();
		var pos = gPhysicsEngine.bodies[p].bike.rwheel.GetPosition();
		var angle = gPhysicsEngine.bodies[p].bike.rwheel.GetAngle();
		var offset = gPhysicsEngine.bodies[1].bike.base.GetPosition().x;
		var image = this.images.wheel;
		var wheel_cx = ((pos.x - offset) * this.scale) + x;
		var wheel_cy = ((pos.y - track.y + 20) * this.scale) + y;

		ctx.save();
		ctx.translate(wheel_cx, wheel_cy);
		ctx.rotate(angle);
		ctx.drawImage(image.img, -image.half_width, -image.half_height);
		ctx.restore();
	},

	renderRamp1: function(ctx, x, y, ramp) {
		var pos = ramp.GetPosition();
		var offset = gPhysicsEngine.bodies[1].bike.base.GetPosition().x;
		var image = this.images.ramp1;
		var ramp1_cx = (pos.x - offset) * this.scale + x;
		var ramp1_cy = 20 * this.scale + y;
		ctx.save();
		ctx.translate(ramp1_cx, ramp1_cy);
		ctx.drawImage(image.img, -image.half_width + image.x_offset, -image.half_height + image.y_offset);
		ctx.restore();
	},

	renderRamp2: function(ctx, x, y, ramp) {
		var pos = ramp.GetPosition();
		var offset = gPhysicsEngine.bodies[1].bike.base.GetPosition().x;
		var image = this.images.ramp2;
		var ramp1_cx = (pos.x - offset) * this.scale + x;
		var ramp1_cy = 20 * this.scale + y;
		ctx.save();
		ctx.translate(ramp1_cx, ramp1_cy);
		ctx.drawImage(image.img, -image.half_width + image.x_offset, -image.half_height + image.y_offset);
		ctx.restore();
	},

	renderRamp3: function(ctx, x, y, ramp) {
		var pos = ramp.GetPosition();
		var offset = gPhysicsEngine.bodies[1].bike.base.GetPosition().x;
		var image = this.images.ramp3;
		var ramp1_cx = (pos.x - offset) * this.scale + x;
		var ramp1_cy = 20 * this.scale + y;
		ctx.save();
		ctx.translate(ramp1_cx, ramp1_cy);
		ctx.drawImage(image.img, -image.half_width + image.x_offset, -image.half_height + image.y_offset);
		ctx.restore();
	},
	renderRamp4: function(ctx, x, y, ramp) {
		var pos = ramp.GetPosition();
		var offset = gPhysicsEngine.bodies[1].bike.base.GetPosition().x;
		var image = this.images.ramp4;
		var ramp1_cx = (pos.x - offset) * this.scale + x;
		var ramp1_cy = 20 * this.scale + y;
		ctx.save();
		ctx.translate(ramp1_cx, ramp1_cy);
		ctx.drawImage(image.img, -image.half_width + image.x_offset, -image.half_height + image.y_offset);
		ctx.restore();
	},
	renderRamp5: function(ctx, x, y, ramp) {
		var pos = ramp.GetPosition();
		var offset = gPhysicsEngine.bodies[1].bike.base.GetPosition().x;
		var image = this.images.ramp5;
		var ramp1_cx = (pos.x - offset) * this.scale + x;
		var ramp1_cy = 20 *  this.scale + y;
		ctx.save();
		ctx.translate(ramp1_cx, ramp1_cy);
		ctx.drawImage(image.img, -image.half_width + image.x_offset, -image.half_height + image.y_offset);
		ctx.restore();
	},
	renderRamp6: function(ctx, x, y, ramp) {
		var pos = ramp.GetPosition();
		var offset = gPhysicsEngine.bodies[1].bike.base.GetPosition().x;
		var image = this.images.ramp6;
		var ramp1_cx = (pos.x - offset) * this.scale + x;
		var ramp1_cy = 20 * this.scale + y;
		ctx.save();
		ctx.translate(ramp1_cx, ramp1_cy);
		ctx.drawImage(image.img, -image.half_width + image.x_offset, -image.half_height + image.y_offset);
		ctx.restore();
	},
	renderGateUp: function(ctx, x, y) {
		var pos = { x: 8, y: 0};
		var offset = gPhysicsEngine.bodies[1].bike.base.GetPosition().x;
		var image = this.images.gateup;
		var cx = (pos.x - offset) * this.scale + x;
		var cy = pos.y * this.scale + y;
		ctx.save();
		ctx.translate(cx, cy);
		ctx.drawImage(image.img, -image.half_width + image.x_offset, -image.half_height + image.y_offset);
		ctx.restore();
	},
	renderGateDown: function(ctx, x, y) {
		var pos = { x: 8, y: 0};
		var offset = gPhysicsEngine.bodies[1].bike.base.GetPosition().x;
		var image = this.images.gatedown;
		var cx = (pos.x - offset) * this.scale + x;
		var cy = pos.y * this.scale + y;
		ctx.save();
		ctx.translate(cx, cy);
		ctx.drawImage(image.img, -image.half_width + image.x_offset, -image.half_height + image.y_offset);
		ctx.restore();
	},
	renderFinish: function(ctx, x, y, endPos) {
		var pos = { x: endPos, y: 0};
		var offset = gPhysicsEngine.bodies[1].bike.base.GetPosition().x;
		var image = this.images.finish;
		var cx = (pos.x - offset) * this.scale + x;
		var cy = pos.y * this.scale + y;
		ctx.save();
		ctx.translate(cx, cy);
		ctx.drawImage(image.img, -image.half_width + image.x_offset, -image.half_height + image.y_offset);
		ctx.restore();
	}
});

var gRenderEngine = new RenderEngine();