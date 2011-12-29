/*
*  JAIL: jQuery Asynchronous Image Loader
*
* Copyright (c) 2011 Sebastiano Armeli-Battana (http://www.sebastianoarmelibattana.com)
*
* By Sebastiano Armeli-Battana (@sebarmeli) - http://www.sebastianoarmelibattana.com
* Licensed under the MIT license.
* https://github.com/sebarmeli/JAIL/blob/master/MIT-LICENSE.txt
*
* Tested with jQuery 1.3.2+ on FF 2+, Opera 10+, Safari 4+, Chrome 8+ on Win/Mac/Linux and IE 6/7/8 on Win.
*
* Contributor : Derek Lindahl - dlindahl
*
* @link http://github.com/sebarmeli/JAIL
* @author Sebastiano Armeli-Battana
* @date 30/12/2011
* @version 0.9.8
*
*/
(function ( name, definition ){
	// jquery plugin pattern - AMD + CommonJS - by Addy Osmani (https://github.com/addyosmani/jquery-plugin-patterns/blob/master/amd+commonjs/pluginCore.js)
	var theModule = definition(),
		hasDefine = typeof define === 'function' && define.amd;

	if ( hasDefine ){  
		// AMD module
		define( 'jail', ['jquery'], theModule );
		
	}  else { 
		( this.jQuery || this.$ || this )[name] = theModule;
	}
}( 'jail', function ($) {
	var $ = window.jQuery,
	
		$window = $( window ),
		
		// Defaults parameters
		defaults = {
			timeout : 1,
			effect : false,
			speed : 400,
			triggerElement: null,
			offset : 0,
			event : 'load',
			callback : null,
			callbackAfterEachImage : null,
			placeholder : false,
			loadHiddenImages : false
		},
		
		// current stack of images	
		currentStack = {},
		
		// true if 'callback' fn is called
		isCallbackDone = false;
		
	/* 
	* Public function defining 'jail'
	*
	* @param elements : images to load
	* @param options : configurations object
	*/
	$.jail = function( elements, options) {

		var elements = elements || {},
			options = $.extend( {}, defaults, options );
		
		// Initialize plugin
		$.jail.prototype.init(elements, options);
		
		// When the event is not specified the images will be loaded with a delay
		if(/^load/.test( options.event )) {
			// 'load' event
			$.jail.prototype.later.call( elements, options );
		} else {
			$.jail.prototype.onEvent.call( elements, options );
		}
	};
	
	/* 
	* Method in charge of initializing the plugin
	*
	* @param options : configurations object
	*/
	$.jail.prototype.init = function( elements, options ) {
		
		// Store the current images into the currentStack object
		currentStack = $.extend( {},elements );
		
		// Store the selector triggering jail into 'triggerEl' data for the images selected 
		elements.data("triggerEl", ( options.triggerElement ) ? $( options.triggerElement ) : $window );
		
		// Use a placeholder in case it is specified
		if ( !!options.placeholder ) {
			elements.each(function(){
				$(this).attr( "src", options.placeholder );
			});
		}
	};
	
		
	/* 
	* Function called when 'event' is different from "load"
	*
	* @param options : configurations object
	*/
	$.jail.prototype.onEvent = function( options ) {
		
		if (!!options.triggerElement) {
			_bindEvent( options, this );
		} else {
			// Bind the event to the images
			this.bind( options.event, {options:options}, _loadOnEvent );
		}
	};
	
	/* 
	* Method called when "event" is equals to "load" (default). The visible image will be loaded
	* after a specified timeout (or after 1 ms). The scroll method will be bound to the window to load 
	* the images not visible onload.
	*
	* @param options : configurations object
	*/
	$.jail.prototype.later = function( options ) {
		var images = this;

		// After [timeout] has elapsed, load the visible images
		setTimeout(function() {
			images.each(function(){
				_loadImageIfVisible( options, this, images.data("triggerEl") );
			});
			
			options.event = "scroll"
			_bindEvent( options, currentStack );
		}, options.timeout);
	};
		
	/* 
	* Bind event to the element stored in the "triggerEl" data: the window object or the element 
	* defined in the "triggerElement" parameter
	*
	* @param eventType : event name
	* @param options : configurations object
	* @param images : images in the current stack
	*/
	function _bindEvent ( options, images ) {
		if (!!images) {
			var triggerEl = $(images).data("triggerEl");
		}
		
		// Check if there are images to load
		if (!!triggerEl) {
			triggerEl.bind( options.event, {options:options, images : currentStack}, _bufferedEventListener );
			$window.resize( {options:options}, _bufferedEventListener );
		}
	}
		
	/* 
	* Remove any elements that have been loaded from the jQuery stack.
	* This should speed up subsequent calls by not having to iterate over the loaded elements.
	*
	* @param stack : current images stack
	*/
	function _purgeStack ( stack ) {
		// number of images not loaded
		var i = 0;

		while(true) {
			if(i === stack.length) {
				break;
			} else {
				if(stack[i].getAttribute('data-src')) {
					i++;
				} else {
					stack.splice( i, 1 );
				}
			}
		}
	}

	/* 
	* Load the image - after the event is triggered on the image itself 
	*
	* @param e : event
	*/
	function _loadOnEvent (e) {
		var $img = $(this),
			options = e.data.options;

		// Load the image
		_loadImageIfVisible( options, $img );
		
		// Image has been loaded so there is no need to listen anymore
		$img.unbind( e.type );
	}

	/* 
	* Event handler for remaining images - load visible images
	*
	* @param e : event
	*/
	function _bufferedEventListener (e) {
		var images = e.data.images,
			options = e.data.options;
		
		if (currentStack.length === 0) {
			$(this).unbind( e.type );
			return;
		}
		
		$(images).each( function(){
			// Fix to block window inside this loop
			if ( this === window ) {
				return;
			}
			_loadImageIfVisible( options, this, $(this).data("triggerEl") );
		});
	}

	/* 
	* Load the image if visible in the viewport
	*
	* @param options : configurations object
	* @param image : image under analysis
	* @param triggerEl : element triggering jail or '$window'
	*/
	function _loadImageIfVisible ( options, image, triggerEl ) {
		var $img = $(image),
			container = (/scroll/i.test(options.event)) ? triggerEl : $window,
			isVisible = true;
		
		// If the hidden images are not loaded ...
		if ( !options.loadHiddenImages ) {
			isVisible = _isVisibleInContainer($img, container, options) && $img.is(":visible");
		}
		
		// Load the image if it's visible	
		if(isVisible && _isInTheScreen ( container, $img, options.offset )) {
			_loadImage( options, $img );
		}
	}

	/* 
	* Function that returns true if the image is visible inside the "window" (or specified container element)
	*
	* @param $ct : container - jQuery obj
	* @param $img : image selected - jQuery obj
	* @param optionOffset : offset
	*/
	function _isInTheScreen ( $ct, $img, optionOffset ) {
		var is_ct_window  = $ct[0] === window,
			ct_offset  = (is_ct_window ? { top:0, left:0 } : $ct.offset()),
			ct_top     = ct_offset.top + ( is_ct_window ? $ct.scrollTop() : 0),
			ct_left    = ct_offset.left + ( is_ct_window ? $ct.scrollLeft() : 0),
			ct_right   = ct_left + $ct.width(),
			ct_bottom  = ct_top + $ct.height(),
			img_offset = $img.offset(),
			img_width = $img.width(),
			img_height = $img.height();
		
		return (ct_top - optionOffset) <= (img_offset.top + img_height) &&
			(ct_bottom + optionOffset) >= img_offset.top &&
				(ct_left - optionOffset)<= (img_offset.left + img_width) &&
					(ct_right + optionOffset) >= img_offset.left;
	}

	/* 
	* Main function --> Load the images copying the "data-href" attribute into the "src" attribute
	*
	* @param options : configurations object
	* @param $img : image selected - jQuery obj
	*/
	function _loadImage ( options, $img ) {

		$img.hide();
		$img.attr("src", $img.attr("data-src"));
		$img.removeAttr('data-src');

		// Images loaded with some effect if existing
		if(options.effect) {
			if (options.speed) {
				$img[options.effect](options.speed);
			} else {
				$img[options.effect]();
			}
		} else {
			$img.show();
		}
		
		// Remove an image from the currentStack
		_purgeStack( currentStack );
		
		// Callback after each image is loaded
		if ( !!options.callbackAfterEachImage ) {
			options.callbackAfterEachImage.call( this, $img, options );
		}
		
		// Callback after all images are loaded
		if ( currentStack.length === 0 && !!options.callback && !isCallbackDone ) {
			options.callback.call( $.fn.jail, options );
			isCallbackDone = true;
		}
	}
		
	/* 
	* Return if the image is visible inside a "container" / window. There are checks around
	* "visibility" CSS property and around "overflow" property of the "container"
	*
	* @param $img : image selected - jQuery obj
	* @param container : container object
	* @param options : configurations object
	*/
	function _isVisibleInContainer ( $img, container, options ){

		var parent = $img.parent(),
			isVisible = true;
		
		while ( parent.get(0).nodeName.toUpperCase() !== "BODY" ) {
			// Consider the 'overflow' property
			if ( parent.css("overflow") === "hidden" ) {
				if (!_isInTheScreen(parent, $img, options.offset)) {
					isVisible = false;
					break;
				}
			} else if ( parent.css("overflow") === "scroll" ) {
				if (!_isInTheScreen(parent, $img, options.offset)) {
					isVisible = false;
					currentStack.data("triggerEl", parent);
					
					options.event = "scroll";
					_bindEvent(options, currentStack);
					break;
				}
			}
			
			if ( parent.css("visibility") === "hidden" || $img.css("visibility") === "hidden" ) {
				isVisible = false;
				break;
			}
			
			// If container is not the window, and the parent is the container, exit from the loop
			if ( container !== $window && parent === container ) {
				break;
			}
			
			parent = parent.parent();
		}
		
		return isVisible;
	}

	// Small wrapper
	$.fn.jail = function( options ) {

		new $.jail( this, options );
		
		return this;
	};
	
	return $.jail;
}));