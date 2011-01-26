/*!
*  JqueryAsynchImageLoader (JAIL) : plugin for jQuery
*
* Developed by
* Sebastiano Armeli-Battana (@sebarmeli) - http://sebarmeli.com | http://blog.sebarmeli.com
*
* Licensed under MIT
*/
/* Copyright (c) 2011 Sebastiano Armeli-Battana (http://sebarmeli.com)

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/* JAIL helps loading images asynchronously and it can be used to make your page load faster.
* Selected images will be downloaded after the document is ready not blocking the page 
* to render other elements. Images can be loaded after an event is triggered (like clicking 
* on a link, mouseovering on some elements, scrolling up/down) or after some delay or simply the 
* visible images will be loaded.
*
* First of all, this plugin requires you to make some HTML changes. 
* E.g. 
*	<img class="lazy" src="/img/blank.gif" data-href="/img/image1.jpg" width="x" height="y"/>
*
* You can define a noscript block in order to respect the principles of progressive
* enhancemnt
* E.g.
*	<noscript>
*		<img class="lazy" src="/img/image1.jpg" width="x" height="y" />
*	</noscript>
*
* You can call the function in this way
* E.g.
*	$(function(){
*		$('img.lazy').asynchImageLoader();
*	});
* 
* You can also have different configurations:
*
* - timeout : number of msec after that the images will be loaded - Default: 10ms
* - effect : any jQuery effect that makes the images display (e.g. "fadeIn"). If you are loading a large number of images, it is best to NOT use this setting. Effect calls are very expensive - Default: NULL
* - speed :  string or number determining how long the animation will run  - Default: 400
* - selector : selector that you need to bind the trigger event - Default: NULL
* - event : event that triggers the image to load. You can choose "load", "load+scroll", "click", "mouseover", or "scroll". Default: "load+scroll"
* - callback : function that will be called after the images are loaded	- Default: ""
* - placeholder: location of an image (such a loader) you want to display while waiting for the images to be loaded - Default: ""
*
*
* Tested with jQuery 1.3.2+ on FF 2/3, Opera 10+, Safari 4+, Chrome on Mac and IE 6/7/8 on Win.
*
*
* @link http://github.com/sebarmeli/JAIL
* @author Sebastiano Armeli-Battana
* @collaborator  Derek Lindahl - dlindahl
* @date 26/1/2011
* @version 0.5 
*
*/

/*globals window,jQuery,setTimeout,clearTimeout */
(function($){
	var $window = $(window);

	$.fn.asynchImageLoader = function(options) {

		// Configuration
		options = $.extend({
			timeout : 10,
			effect : false,
			speed : 400,
			selector: null,
			event : 'load+scroll',
			callback : jQuery.noop,
			placeholder : false
		}, options);

		var images = this;

		// Store the selector into 'triggerEl' data for the images selected
		this.data('triggerEl', (options.selector) ? $(options.selector) : $window);
		
		// Use a placeholder in case it is specified
		if (options.placeholder !== false) {
			images.each(function(){
				$(this).attr("src", options.placeholder);
			});
		}

		// When the event is not specified the images will be loaded with a delay
		if(/^load/.test(options.event)) {
			$.asynchImageLoader.later.call(this, options);
		} else {
			$.asynchImageLoader.onEvent.call(this, options, images);
		}

		return this;
	};

	// Methods cointaing the logic
	$.asynchImageLoader = {
	
		// Remove any elements that have been loaded from the jQuery stack.
		// This should speed up subsequent calls by not having to iterate over the loaded elements.
		_purgeStack : function(stack) {
			var i = 0;

			while(true) {
				if(i === stack.length) {
					break;
				} else {
					if(stack[i].getAttribute('data-href')) {
						i++;
					} else {
						stack.splice(i, 1);
					}
				}
			}
		},

		// Load the image - after the event is triggered on the image itself - no need
		// to check for visibility
		_loadOnEvent : function(e) {
			var $img = $(this),
			options = e.data.options,
			images = e.data.images;

			// Load images
			$.asynchImageLoader._loadImage(options, $img);
			// Image has been loaded so there is no need to listen anymore
			$img.unbind( options.event, $.asynchImageLoader._loadOnEvent );

			options.callback.call(this, options);

			$.asynchImageLoader._purgeStack( images );
		},

		// Load the image - after the event is triggered by a DOM element different
		// from the images (options.selector value) or the event is "scroll" - 
		// visibility of the images is checked
		_bufferedEventListener : function(e) {
			var images = e.data.images,
			options = e.data.options,
			triggerEl = images.data('triggerEl');

			clearTimeout(images.data('poller'));
			images.data('poller', setTimeout(function() {
				images.each(function _imageLoader(){
					$.asynchImageLoader._loadImageIfVisible(options, this, triggerEl);
				});

				$.asynchImageLoader._purgeStack( images );

				options.callback.call(this, options, images);
		  }, options.timeout));
		},

		// Images loaded triggered by en event
		onEvent : function(options, images) {
			images = images || this;

			if (options.event === 'scroll' || options.selector) {
				var triggerEl = images.data('triggerEl');

				if(images.length > 0) {

					// Bind the event to the selector specified in the config obj
					triggerEl.bind( options.event, { images:images, options:options }, $.asynchImageLoader._bufferedEventListener );
				} else {

					// Unbind the event to the selector specified in the config obj since there is nothing left to do
					var initalTriggerEl = (options.selector) ? $(options.selector) : $window;
					initalTriggerEl.unbind( options.event, $.asynchImageLoader._bufferedEventListener );
				}
			} else {
				// Bind the event to the images
				images.bind(options.event, { options:options, images:images }, $.asynchImageLoader._loadOnEvent);
			}
		},

		// Images loaded triggered with some delay
		later : function(options) {
			var images = this;

			// If the 'load' event is specified, immediately load all the visible images and remove them from the stack
			if (options.event === 'load') {
				images.each(function(){
					$.asynchImageLoader._loadImageIfVisible(options, this, images.data('triggerEl'));
				});
			}
			$.asynchImageLoader._purgeStack( images );

			// After [timeout] has elapsed, load the remaining images if they are visible OR (if no event is specified)
			setTimeout(function() {

				if (options.event === 'load') {
					images.each(function(){
						$.asynchImageLoader._loadImage(options, $(this));
					});
				} else {
					images.each(function(){
						$.asynchImageLoader._loadImageIfVisible(options, this, images.data('triggerEl'));
					});
				}

				$.asynchImageLoader._purgeStack( images );

				if (options.event === 'load+scroll') {
					options.event = 'scroll';
					$.asynchImageLoader.onEvent( options, images );
				}
			}, options.timeout);
		},

		// Function that checks if the images have been loaded
		_loadImageIfVisible : function(options, image, triggerEl) {
			var $img = $(image),
			container = (options.event === 'scroll' ? triggerEl : $window);

			if ($.asynchImageLoader._isInTheScreen( container, $img)) {
				$.asynchImageLoader._loadImage(options, $img);
			}
		},

		// Function that returns true if the image is visible inside the "window" (or specified container element)
		_isInTheScreen : function($ct, $img) {
			var	is_ct_window  = $ct[0] === window,
					ct_offset  = $ct.offset() || { top:0, left:0 },
					ct_top     = ct_offset.top + ( is_ct_window ? $ct.scrollTop() : 0),
					ct_left    = ct_offset.left + ( is_ct_window ? $ct.scrollLeft() : 0),
					ct_right   = ct_left + $ct.width(),
					ct_bottom  = ct_top + $ct.height(),
					img_offset = $img.offset();

			return ct_top <= img_offset.top &&
						ct_bottom >= img_offset.top &&
							ct_left <= img_offset.left &&
								ct_right >= img_offset.left;
		},

		// Main function --> Load the images copying the "data-href" attribute into the "src" attribute
		_loadImage : function(options, $img) {

			$img.attr("src", $img.attr("data-href"));
			$img.removeAttr('data-href');

			// Images loaded with some effect if existing
			if(options.effect) {
				$img[options.effect](options.speed);
			}
		}
	};
}(jQuery));
