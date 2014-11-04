jQuery Keynav
=============

Based on jQuery Keyboard Navigation Plugin

created by Mike Hostetler

http://mike-hostetler.com/jquery-keyboard-navigation-plugin


Usage
-----

	jQuery(selector).keynav({
		selectedClass: 'selected',
		firstActive: '.selected',
		keys: {
			enter: function($el) {
				console.log($el);
			}
		}
	});


Default options
---------------

	{
		selectedClass: 'selected',
		firstActive: ':first',
		keys: {
			up: function() {
				$.keynav.goUp();
			},
			down: function() {
				$.keynav.goDown();
			},
			left: function() {
				$.keynav.goLeft();
			},
			right: function() {
				$.keynav.goRight();
			}
		}
	}