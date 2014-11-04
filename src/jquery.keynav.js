/*
 * jQuery Keyboard Navigation Plugin - Current
 *   http://mike-hostetler.com/jquery-keyboard-navigation-plugin
 *
 * To use, download this file to your server, save as keynav.js,
 * and add this HTML into the <head>...</head> of your web page:
 *   <script type="text/javascript" src="jquery.keynav.js"></script>
 *
 * Copyright (c) 2006-2010 Mike Hostetler <http://www.mike-hostetler.com/>
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Modificado por CHaack
 */
$.keynav = new Object();

$.fn.keynav = function(newOptions) {
	var options = {
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
	};
	var tempKeys = jQuery.extend(options.keys, newOptions.keys);
	jQuery.extend(options, newOptions);
	options.keys = tempKeys;

	//Initialization
	$(document).off('keydown').on('keydown',function(e) {
		var key = e.which;
		if(key in $.keynav.keyMapping) {
			var fn = options.keys[$.keynav.keyMapping[key]];
			if(typeof fn === 'function') {
				fn.apply(this, [jQuery($.keynav.getCurrent())]);
			}
		}
	});

	$.keynav.reset();
	var elems = this.each(function() {
		$.keynav.reg(this,options.selectedClass);
	});

	if(elems.filter(options.firstActive).length) 
		$.keynav.setActive(elems.filter(options.firstActive).get(0));

	return elems;
}

$.keynav.reset = function() {
	$.keynav.el = [];
}

$.keynav.reg = function(e,onClass) {
	var kn = $.keynav;
	e.pos = $.keynav.getPos(e);
	e.onClass = onClass;
	kn.el.push(e);
}

$.keynav.setActive = function(e, fromKeyb) {
	if(!jQuery('html,body').is(':animated')) {
		jQuery($.keynav.getCurrent()).trigger('blur');
		for(var i=0;i<$.keynav.el.length;i++) {
			jQuery($.keynav.el[i]).removeClass($.keynav.el[i].onClass);
		}
		var $el = jQuery(e);
		$el.addClass(e.onClass);
		$el.trigger('focus');
		if(fromKeyb) $el.trigger('keynav:focus');
		$.keynav.currentEl = e;

		//Scroll persigue el elemento seleccionado
		if($el.offset().top + $el.height() > $(document).scrollTop() + $(window).height()) {
			$('html, body').animate({
				scrollTop: $(document).scrollTop()+$el.height()
			}, 200);
		} else if($el.offset().top < $(document).scrollTop()) {
			$('html, body').animate({
				scrollTop: $el.offset().top - 10
			}, 200);
		}
	}
}

$.keynav.getCurrent = function () {
	if($.keynav.currentEl)
		return $.keynav.currentEl;
	else 
		return $.keynav.el[0];
}

$.keynav.quad = function(cur,fQuad) {
	var kn = $.keynav;
	var quad = Array();
	for(i=0;i<kn.el.length;i++) {
		var el = kn.el[i];
		if(cur == el) continue;
		if(fQuad((cur.pos.cx - el.pos.cx),(cur.pos.cy - el.pos.cy)))
			quad.push(el);
	}
	return quad;
}

$.keynav.activateClosest = function(cur,quad) {
	var closest;
	var od = 1000000;
	var nd = 0;
	var found = false;
	for(i=0;i<quad.length;i++) {
		var e = quad[i];
		nd = Math.sqrt(Math.pow(cur.pos.cx-e.pos.cx,2)+Math.pow(cur.pos.cy-e.pos.cy,2));
		if(nd < od) {
			closest = e;
			od = nd;
			found = true;
		}
	}
	if(found)
		$.keynav.setActive(closest, true);
}

$.keynav.goLeft = function () {
	var cur = $.keynav.getCurrent();
	var quad = $.keynav.quad(cur,function (dx,dy) { 
		if((dy >= 0) && (Math.abs(dx) - dy) <= 0)
			return true;	
		else
			return false;
	});
	$.keynav.activateClosest(cur,quad);
}

$.keynav.goRight = function () {
	var cur = $.keynav.getCurrent();
	var quad = $.keynav.quad(cur,function (dx,dy) { 
		if((dy <= 0) && (Math.abs(dx) + dy) <= 0)
			return true;	
		else
			return false;
	});
	$.keynav.activateClosest(cur,quad);
}

$.keynav.goUp = function () {
	var cur = $.keynav.getCurrent();
	var quad = $.keynav.quad(cur,function (dx,dy) { 
		if((dx >= 0) && (Math.abs(dy) - dx) <= 0)
			return true;	
			else
		return false;
	});
	$.keynav.activateClosest(cur,quad);
}

$.keynav.goDown = function () {
	var cur = $.keynav.getCurrent();
	var quad = $.keynav.quad(cur,function (dx,dy) { 
		if((dx <= 0) && (Math.abs(dy) + dx) <= 0)
			return true;	
		else
			return false;
	});
	$.keynav.activateClosest(cur,quad);
}

/**
* This function was taken from Stefan's exellent interface plugin
* http://www.eyecon.ro/interface/
* 
* I included it in this library's namespace because the functions aren't
* quite the same.
*/
$.keynav.getPos = function(e) {
	var intval = function(v) {
		v = parseInt(v);
		return isNaN(v) ? 0 : v;
	};

	var l = 0;
	var t  = 0;
	var w = intval($.css(e,'width'));
	var h = intval($.css(e,'height'));
	while (e.offsetParent){
		l += e.offsetLeft + (e.currentStyle?intval(e.currentStyle.borderLeftWidth):0);
		t += e.offsetTop  + (e.currentStyle?intval(e.currentStyle.borderTopWidth):0);
		e = e.offsetParent;
	}
	l += e.offsetLeft + (e.currentStyle?intval(e.currentStyle.borderLeftWidth):0);
	t += e.offsetTop  + (e.currentStyle?intval(e.currentStyle.borderTopWidth):0);
	var cx = Math.round(t+(h/2));
	var cy = Math.round(l+(w/2));
	return {x:l, y:t, w:w, h:h, cx:cx, cy:cy};
};


$.keynav.keyMapping = {
	0: '?',
	8: 'backspace',
	9: 'tab',
	13: 'enter',
	16: 'shift',
	17: 'ctrl',
	18: 'alt',
	19: 'pause_break',
	20: 'caps_lock',
	27: 'escape',
	33: 'page_up',
	34: 'page_down',
	35: 'end',
	36: 'home',
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down',
	45: 'insert',
	46: 'delete',
	48: '0',
	49: '1',
	50: '2',
	51: '3',
	52: '4',
	53: '5',
	54: '6',
	55: '7',
	56: '8',
	57: '9',
	65: 'a',
	66: 'b',
	67: 'c',
	68: 'd',
	69: 'e',
	70: 'f',
	71: 'g',
	72: 'h',
	73: 'i',
	74: 'j',
	75: 'k',
	76: 'l',
	77: 'm',
	78: 'n',
	79: 'o',
	80: 'p',
	81: 'q',
	82: 'r',
	83: 's',
	84: 't',
	85: 'u',
	86: 'v',
	87: 'w',
	88: 'x',
	89: 'y',
	90: 'z',
	91: 'left_window_key',
	92: 'right_window_key',
	93: 'select_key',
	96: 'numpad_0',
	97: 'numpad_1',
	98: 'numpad_2',
	99: 'numpad_3',
	100: 'numpad 4',
	101: 'numpad_5',
	102: 'numpad_6',
	103: 'numpad_7',
	104: 'numpad_8',
	105: 'numpad_9',
	106: 'multiply',
	107: 'add',
	109: 'subtract',
	110: 'decimal point',
	111: 'divide',
	112: 'f1',
	113: 'f2',
	114: 'f3',
	115: 'f4',
	116: 'f5',
	117: 'f6',
	118: 'f7',
	119: 'f8',
	120: 'f9',
	121: 'f10',
	122: 'f11',
	123: 'f12',
	144: 'num_lock',
	145: 'scroll_lock',
	186: ';',
	187: '=',
	188: ',',
	189: 'dash',
	190: '.',
	191: '/',
	192: 'grave_accent',
	219: 'open_bracket',
	220: '\\',
	221: 'close_braket',
	222: 'single_quote'
};