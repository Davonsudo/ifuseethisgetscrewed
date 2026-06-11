/**
 * @date 	April 2013
 * @author	Marc Lester <marc.w.lester@gmail.com>
 * @licence	This work is licensed under the Creative Commons Attribution-ShareAlike 3.0 Unported License. 
 *			To view a copy of this license, visit http://creativecommons.org/licenses/by-sa/3.0/.
 */

var Screen = Class.extend({
	elementId: null,
	element: null,
	app: null,
	keyBindings: {},

	init: function(id) {
		//console.log(id);
		this.elementId = id;
		this.element = document.getElementById(id);
		this.element.style.display = 'none';
	},

	render: function(dt) {},

	resize: function() {},

	show: function() {
		this.element.style.display = 'block';
		this.element.focus();
		gInputEngine.attach(this);
		this.resize();
		//gInputEngine.applyBindMap(this.keyBindings);
	},
	hide: function() {
		this.element.style.display = 'none';
		this.element.blur();
		gInputEngine.detach(this);
	},

	setApp: function(app) {
		this.app = app;
	}
});