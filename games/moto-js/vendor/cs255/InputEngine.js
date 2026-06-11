InputEngineClass = Class.extend({

	// A dictionary mapping ASCII key codes to string values
	// describing the action we want to take when that key is
	// pressed.
	bindings: {},

	// A dictionary mapping actions that might be taken in our
	// game to a boolean value indicating whether that action
	// is currently being performed.
	actions: {},

	mouse: {
		x: 0,
		y: 0
	},

	//-----------------------------
	setup: function (screen) {
		//console.log(screen.element);
		gInputEngine.applyBindMap(screen.keyBindings);
		screen.element.addEventListener('mousemove', gInputEngine.onMouseMove);
		screen.element.addEventListener('keydown', gInputEngine.onKeyDown);
		screen.element.addEventListener('keyup', gInputEngine.onKeyUp);
		// Example usage of bind, where we're setting up
		// the W, A, S, and D keys in that order.
		//gInputEngine.bind(87, 'move-up');
		//gInputEngine.bind(65, 'move-left');
		//gInputEngine.bind(83, 'move-down');
		//gInputEngine.bind(68, 'move-right');

		// Adding the event listeners for the appropriate DOM events.
		//document.getElementById('my_canvas').addEventListener('mousemove', gInputEngine.onMouseMove);
		//document.getElementById('my_canvas').addEventListener('keydown', gInputEngine.onKeyDown);
		//document.getElementById('my_canvas').addEventListener('keyup', gInputEngine.onKeyUp);
	},

	dispose: function()
	{
		gInputEngine.clearBindings();

	},

	attach: function(screen) {
		gInputEngine.applyBindMap(screen.keyBindings);
		screen.element.addEventListener('mousemove', gInputEngine.onMouseMove);
		screen.element.addEventListener('keydown', gInputEngine.onKeyDown);
		screen.element.addEventListener('keyup', gInputEngine.onKeyUp);
		//jQuery(screen.element).keydown(function(event) { console.log('here'); });
		//jQuery(screen.element).keyup(gInputEngine.onKeyUp);
		
	},
	detach: function(screen) {
		gInputEngine.clearBindings();
		//jQuery(screen.element).keydown(gInputEngine.onKeyDown);
		//jQuery(screen.element).keyup(gInputEngine.onKeyUp);
		screen.element.removeEventListener('mousemove', gInputEngine.onMouseMove);
		screen.element.removeEventListener('keydown', gInputEngine.onKeyDown);
		screen.element.removeEventListener('keyup', gInputEngine.onKeyUp);
	},

	action: function(action) {
		return gInputEngine.actions[action];
	},

	//-----------------------------
	onMouseMove: function (event) {
		gInputEngine.mouse.x = event.clientX;
		gInputEngine.mouse.y = event.clientY;
		//console.log('here2');
	},

	//-----------------------------
	onKeyDown: function (event) {
		// Grab the keyID property of the event object parameter,
		// then set the equivalent element in the 'actions' object
		// to true.
		// 
		// You'll need to use the bindings object you set in 'bind'
		// in order to do this.
		//console.log("here");
		var action = gInputEngine.bindings[event.keyCode];
		if (action) {
			gInputEngine.actions[action] = true;
		}
	},

	//-----------------------------
	onKeyUp: function (event) {
		// Grab the keyID property of the event object parameter,
		// then set the equivalent element in the 'actions' object
		// to false.
		// 
		// You'll need to use the bindings object you set in 'bind'
		// in order to do this.
		var action = gInputEngine.bindings[event.keyCode];

		if (action) {
			gInputEngine.actions[action] = false;
		}
	},

	// The bind function takes an ASCII keycode
	// and a string representing the action to
	// take when that key is pressed.
	// 
	// Fill in the bind function so that it
	// sets the element at the 'key'th value
	// of the 'bindings' object to be the
	// provided 'action'.
	bind: function (key, action) {
		gInputEngine.bindings[key] = action;
	},

	applyBindMap: function(map) {
		//reset bindings.
		gInputEngine.clearBindings();

		for (keyId in map) {
			gInputEngine.bind(keyId, map[keyId]);
		}
	},

	clearBindings: function() {
		gInputEngine.bindings = {};
	}

});

gInputEngine = new InputEngineClass();
