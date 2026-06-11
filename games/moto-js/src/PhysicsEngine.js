/**
 * @date 	April 2013
 * @author	Marc Lester <marc.w.lester@gmail.com>
 * @licence	This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License. 
 *			To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/.
 */

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2RevoluteJoint = Box2D.Dynamics.Joints.b2RevoluteJoint;
var b2PrismaticJoint = Box2D.Dynamics.Joints.b2PrismaticJoint;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

var PhysicsEngine = Class.extend({
	world: null,
	scale: 4,
	
	bodies: [],
	bodyCache: [],
	jointCache: [],
	clearBodies: function() {
		if (gPhysicsEngine.bodyCache.length) {
			for (var i = 0; i < gPhysicsEngine.bodyCache.length; i++) {
				gPhysicsEngine.world.DestroyBody(gPhysicsEngine.bodyCache[i]);
			}
		}
		if (gPhysicsEngine.jointCache.length) {
			for (var i = 0; i < gPhysicsEngine.jointCache.length; i++) {
				gPhysicsEngine.world.DestroyJoint(gPhysicsEngine.jointCache[i]);
			}
		}
		gPhysicsEngine.bodyCache = [];
		gPhysicsEngine.jointCache = [];
		for (var i = 1; i <= 4; i++) {
			gPhysicsEngine.bodies[i] = {
				track: null,
				bike: {
					base: null,
					fwheel: null,
					rwheel: null,
					rjoint: null,
					fjoint: null
				},
				ramps: []
			};
		}

	},

	init: function() {
		gravity = 12.7;
		this.world = new b2World(new b2Vec2(0,gravity),true);

		var listener = new Box2D.Dynamics.b2ContactListener;
		listener.BeginContact = function(contact) {
			if (contact.GetFixtureB().GetFilterData().groupIndex == 4) {
				head_injury = true;
				contact.GetFixtureB().GetUserData().headInjury = true;
			}
			
			if (contact.GetFixtureB().GetFilterData().groupIndex == 7) {
				var contactId = contact.GetFixtureA().GetUserData().id;
				if (!contact.GetFixtureB().GetUserData().contacts) contact.GetFixtureB().GetUserData().contacts = [];
				var index = contact.GetFixtureB().GetUserData().contacts.indexOf(contactId);
				if (index == -1) {
					contact.GetFixtureB().GetUserData().contacts.push(contactId);
					contact.GetFixtureB().GetUserData().inAir = false;
				}
			}
		};
		listener.EndContact = function(contact) {
			if (contact.GetFixtureB().GetFilterData().groupIndex == 7) {
				var contactId = contact.GetFixtureA().GetUserData().id;
				if (!contact.GetFixtureB().GetUserData().contacts) contact.GetFixtureB().GetUserData().contacts = [];
				var index = contact.GetFixtureB().GetUserData().contacts.indexOf(contactId);
				if (index >= 0) {
					contact.GetFixtureB().GetUserData().contacts.splice(index, 1);
					if (contact.GetFixtureB().GetUserData().contacts.length == 0) {
						contact.GetFixtureB().GetUserData().inAir = true;
					}
				}
			}
		};
		this.world.SetContactListener(listener);
	},

	makeBody: function(options) {
		options = options || {};
	
		var def = new b2BodyDef();
		def.position = new b2Vec2(options.pos.x, options.pos.y);
		def.type = options.type == 'static' ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
		var body = gPhysicsEngine.world.CreateBody(def);
		body.SetUserData(options.userdata || {});

		options.fixtures = options.fixtures || [];
		for (var i = 0; i < options.fixtures.length; i++) {
			var fOptions = options.fixtures[i];
			var fixture = new b2FixtureDef();
			fixture.density = fOptions.density || 1;
			fixture.friction = fOptions.friction || 1;
			fixture.restitution = fOptions.restitution || 0;
			fixture.filter.categoryBits = fOptions.categoryBits || 0x0001;
			fixture.filter.maskBits = fOptions.maskBits || 0xFFFF;
			fixture.filter.groupIndex = fOptions.groupIndex || 0;

			switch (fOptions.shape) {
				case "circle":
				fOptions.radius = fOptions.radius || 1;
				fixture.shape = new b2CircleShape(fOptions.radius);
				fixture.shape.m_p.Set(fOptions.pos.x, fOptions.pos.y);
				break;
				case "polygon":
				fixture.shape = new b2PolygonShape();
				fixture.shape.SetAsArray(fOptions.points, fOptions.points.length);
				break;
				case "block":
				fOptions.width = fOptions.width || 1;
				fOptions.height = fOptions.height || 1;
				fixture.shape = new b2PolygonShape();
				
				fOptions.rotation = fOptions.rotation || 0;
				fixture.shape.SetAsOrientedBox(fOptions.width / 2, fOptions.height / 2, new b2Vec2(fOptions.pos.x, fOptions.pos.y), fOptions.rotation);			
				break;
			}

			var fxtr = body.CreateFixture(fixture);
			fxtr.SetUserData(fOptions.userdata);
		}
		this.bodyCache.push(body);
		return body;
	},

	makeBike: function(pos, tracknum) {
		gPhysicsEngine.bodies[tracknum].bike.base = gPhysicsEngine.makeBikeBody(pos, tracknum);
		gPhysicsEngine.bodies[tracknum].bike.fwheel = gPhysicsEngine.makeWheel(pos, tracknum, 'front', 0.5, 8, 8, 1.5);
		gPhysicsEngine.bodies[tracknum].bike.rwheel = gPhysicsEngine.makeWheel(pos, tracknum, 'back', 0.5, 7, 7, -1.5);

		var fwheelJointDef = new b2RevoluteJointDef();
		fwheelJointDef.bodyA = gPhysicsEngine.bodies[tracknum].bike.fwheel;
		fwheelJointDef.bodyB = gPhysicsEngine.bodies[tracknum].bike.base;
		fwheelJointDef.collideConnected = false;
		fwheelJointDef.localAnchorA.Set(0,0);
		fwheelJointDef.localAnchorB.Set(1.5,0);
		fwheelJointDef.enableMotor = true;
		gPhysicsEngine.bodies[tracknum].bike.fjoint = gPhysicsEngine.world.CreateJoint(fwheelJointDef);


		var rwheelJointDef = new b2RevoluteJointDef();
		rwheelJointDef.bodyA = gPhysicsEngine.bodies[tracknum].bike.rwheel;
		rwheelJointDef.bodyB = gPhysicsEngine.bodies[tracknum].bike.base;
		rwheelJointDef.collideConnected = false;
		fwheelJointDef.localAnchorA.Set(0,0);
		rwheelJointDef.localAnchorB.Set(-1.5,0);
		rwheelJointDef.enableMotor = true;
		gPhysicsEngine.bodies[tracknum].bike.rjoint = gPhysicsEngine.world.CreateJoint(rwheelJointDef);
	},
	makeWheel: function(pos, tracknum, name, rest, id, index, offsetx) {
		yoffset = gPhysicsEngine.getTrackYOffset(tracknum) - 2;
		var wheel = gPhysicsEngine.makeBody({
			type: 'dynamic',
			pos: {x: pos, y: yoffset},
			fixtures: [{
				shape: 'circle',
				pos: {x: 0, y: 0},
				radius: 1,
				density: 2,
				friction: 30,
				restitution: rest,
				groupIndex: index,
				userdata: {
					name: name + ' wheel',
					id: id,
				}
			}]
		});

		return wheel;
	},
	makeBikeBody: function(pos, tracknum) {
		yoffset = gPhysicsEngine.getTrackYOffset(tracknum) - 2;
		var body = gPhysicsEngine.makeBody({
			type: 'dynamic',
			pos: {x: pos, y: yoffset},
			fixtures: [{
				shape: 'block',
				pos: {x: 0, y: 0},
				width: 3,
				height: 1,
				density: 20,
				groupIndex: 1,
				userdata: {
					name: 'base',
					id: 5,
				}
			},{
				shape: 'circle',
				pos: {x: 0.5, y: -3},
				radius: 0.75,
				density: 5,
				groupIndex: 4,
				userdata: {
					name: 'head',
					id: 6,
				}
			}]
		});
		return body;
	},
	makeStarter: function(pos, tracknum) {
		yoffset = gPhysicsEngine.getTrackYOffset(tracknum);
		var body = gPhysicsEngine.makeBody({
			type: 'static',
			pos: {x: pos, y: yoffset},
			fixtures: [{
				shape: 'block',
				pos: {x: 0, y: 0},
				width: 1,
				height: 5,
				userData: {
					name: 'starter',
					id: 10,
				}
			}]
		});
		gPhysicsEngine.bodies[tracknum].starter = body;
	},
	destroyStarters: function() {
		for (var i = 1; i < gPhysicsEngine.bodies.length; i++) {
			gPhysicsEngine.world.DestroyBody(gPhysicsEngine.bodies[i].starter);	
		}
		
	},
	makeRamp1: function(pos, tracknum) {
		yoffset = gPhysicsEngine.getTrackYOffset(tracknum);
		var ramp1 = gPhysicsEngine.makeBody({
			type: 'static',
			pos: {x: pos, y: yoffset},
			fixtures: [{
				shape: 'block',
				height: 1,
				width: 1,
				groupIndex: 2,
				pos: {x: 0, y: 0},
				rotation: -Math.PI/4,
				friction: 10,
				density: 0,
				userdata: {
					id: 1100
				}
			}],
			userdata: {
				name: 'ramp1'
			}
		});
		gPhysicsEngine.bodies[tracknum].ramps.push(ramp1);
	},
	makeRamp2: function(pos, tracknum) {
		yoffset = gPhysicsEngine.getTrackYOffset(tracknum);
		var ramp2 = gPhysicsEngine.makeBody({
			type: 'static',
			pos: {x: pos, y: yoffset},
			fixtures: [{
				shape: 'block',
				groupIndex: 2,
				friction: 1,
				density: 0,
				pos: {x: 0.2, y: -0.8},
				width: 0.6,
				height: 2,
				userdata: {
					id: 1200
				}
			},{
				shape: 'block',
				groupIndex: 2,
				friction: 1,
				density: 0,
				pos: {x: -1.2, y: -0.7},
				width: 0.7,
				height: 2.9,
				rotation: 1,
				userdata: {
					id: 1201
				}
			}],
			userdata: {
				name: 'ramp2'
			}
		});
		gPhysicsEngine.bodies[tracknum].ramps.push(ramp2);
	},
	makeRamp3: function(pos, tracknum) {
		yoffset = gPhysicsEngine.getTrackYOffset(tracknum);
		var ramp3 = gPhysicsEngine.makeBody({
			type: 'static',
			pos: {x: pos, y: yoffset},
			fixtures: [{
				shape: 'block',
				pos: { x: 0, y: -1 },
				width: 6,
				height: 0.6,
				rotation: -Math.PI / 4,
				userdata: { id: 1300 }
			},{
				shape: 'block',
				pos: {x: 3.4, y: -3.0},
				width: 3,
				height: 0.6,
				userdata: {id: 1301}
			},{
				shape: 'block',
				pos: {x: 6.5, y: -4.9},
				width: 6,
				height: 0.6,
				rotation: -Math.PI / 4,
				userdata: { id: 1302 }
			}, {
				shape: 'block',
				pos: {x: 10.4, y: -6.9},
				width: 4,
				height: 0.6,
				userdata: {id: 1303}
			}, {
				shape: 'block',
				pos: {x: 14.8, y: -5.4},
				width: 6,
				height: 0.6,
				rotation: Math.PI / 6,
				userdata: {id: 1304}
			},{
				shape: 'block',
				pos: {x: 19.5, y: -3.9},
				width: 4,
				height: 0.6,
				userdata: {id: 1305}
			},{
				shape: 'block',
				pos: {x: 25.4, y: -1.6},
				width: 9.2,
				height: 0.6,
				rotation: Math.PI / 6,
				userdata: {id: 1306}
			}
			],
			userdata: {
				name: 'ramp3'
			}
		});
		gPhysicsEngine.bodies[tracknum].ramps.push(ramp3);
	},
	makeRamp4: function(pos, tracknum) {
		yoffset = gPhysicsEngine.getTrackYOffset(tracknum);
		var ramp4 = gPhysicsEngine.makeBody({
			type: 'static',
			pos: {x: pos, y: yoffset},
			fixtures: [{
				shape: 'block',
				pos: { x: 0, y: -0.8 },
				width: 5,
				height: 0.6,
				rotation: -Math.PI / 6,
				groupIndex: 2,
				friction: 1,
				density: 0,
				userdata: {
					id: 1400
				}
			},{
				shape: 'block',
				pos: {x: 2.6, y: -0.8},
				width: 3,
				height: 0.6,
				rotation: Math.PI / 3,
				groupIndex: 2,
				friction: 1,
				density: 0,
				userdata: {
					id: 1401
				}
			}],
			userdata: {
				name: 'ramp4'
			}
		});
		gPhysicsEngine.bodies[tracknum].ramps.push(ramp4);
	},
	makeRamp5: function(pos, tracknum) {
		yoffset = gPhysicsEngine.getTrackYOffset(tracknum);
		var ramp5 = gPhysicsEngine.makeBody({
			type: 'static',
			pos: {x: pos, y: yoffset},
			fixtures: [{
				shape: 'block',
				pos: {x: 2.6, y: -0.8},
				width: 5,
				height: 0.6,
				rotation: Math.PI / 6,
				groupIndex: 2,
				friction: 1,
				density: 0,
				userdata: {
					id: 1400
				}
			},{
				shape: 'block',
				pos: {x: 0, y: -0.8},
				width: 3,
				height: 0.6,
				rotation: -Math.PI / 3,
				groupIndex: 2,
				friction: 1,
				density: 0,
				userdata: {
					id: 1401
				}
			}],
			userdata: {
				name: 'ramp5'
			}
		});
		gPhysicsEngine.bodies[tracknum].ramps.push(ramp5);
	},
	makeRamp6: function(pos, tracknum) {
		yoffset = gPhysicsEngine.getTrackYOffset(tracknum);
		var ramp5 = gPhysicsEngine.makeBody({
			type: 'static',
			pos: {x: pos, y: yoffset},
			fixtures: [{
				shape: 'block',
				pos: {x: 0, y: -0.8},
				width: 5,
				height: 0.6,
				rotation: -Math.PI / 6,
				groupIndex: 2,
				friction: 1,
				density: 0,
				userdata: {
					id: 1500
				}
			},{
				shape: 'block',
				pos: {x: 4, y: -0.8},
				width: 5,
				height: 0.6,
				rotation: Math.PI / 6,
				groupIndex: 2,
				friction: 1,
				density: 0,
				userdata: {
					id: 1501
				}
			}],
			userdata: {
				name: 'ramp6'
			}
		});
		gPhysicsEngine.bodies[tracknum].ramps.push(ramp5);
	},
	makeTrack: function(size, tracknum) {
		yoffset = gPhysicsEngine.getTrackYOffset(tracknum);
		var track = gPhysicsEngine.makeBody({
			type: 'static',
			pos: {x: size / 2, y: yoffset},
			fixtures: [{
				shape: 'block',
				height: 0.5,
				width: size,
				pos: {x: 0, y: 0},
				groupIndex: 2,
				friction: 1,
				density: 0,
				userdata: {
					id: 1000
				}
			}]
		});
		gPhysicsEngine.bodies[tracknum].track = track;
	},
	getTrackYOffset: function(tracknum) {
		return 20 + ((tracknum - 1) * 200);
	}
});

var gPhysicsEngine = new PhysicsEngine();