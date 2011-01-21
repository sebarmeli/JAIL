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
* - effect : effect that makes the images display (Eg "fadein") - Default: "show"
* - speed : in case of fading in an image, you can set the speed - Default: 400
* - selector : selector that you need to bind the trigger event - Default: ""
* - event : event that triggers the image to load - Default: "load". You can choose "click", "mouseover", "scroll"
* - callback : function that will be called after the images are loaded	- Default: ""
* - placeholder: location of an image (such a loader) you want to display while waiting for the images to be loaded - Default: ""
*
*
* Tested with jQuery 1.3.2+ on FF 2/3, Opera 10+, Safari 4+, Chrome on Mac and IE 6/7/8 on Win.
*
* @link http://github.com/sebarmeli/JAIL
* @author Sebastiano Armeli-Battana
* @date 24/12/2010
* @version 0.3 
*
*/

/*globals window,jQuery,setTimeout */
(function($){
	
    $.fn.asynchImageLoader = function(options) {
        
        // Configuration
        options = $.extend({
                timeout : 10,
                effect : 'fadein',
                speed : 400,
                selector: "",
                event : 'load',
                callback : false ,
                placeholder : false
        }, options);
        
        var images = this;
        
        if (options.placeholder !== false) {
	    images.each(function(){
	        $(this).attr("src", options.placeholder);
	    });
        }

	// Event spupported at the moment are : click, mouseover, scroll.
	// When the event is not specified the images will be loaded with a delay
        switch (options.event) {
	    case 'click' :
		$.asynchImageLoader.onEvent.apply(this, Array.prototype.slice.call(arguments));
                break;
	    case 'mouseover' : 
		$.asynchImageLoader.onEvent.apply(this, Array.prototype.slice.call(arguments));
	        break;
	    case 'scroll' :
	        $.asynchImageLoader.onScroll.apply(this, Array.prototype.slice.call(arguments));
		break;
	    default:
		$.asynchImageLoader.later.apply(this, [options]);
	    }

        return images.each(function () {
            return this;
        });
    };
 
    // Methods cointaing the logic
    $.asynchImageLoader = {
			
	// Images loaded triggered by en event
	onEvent : function(options) {
	    var images = $(this);
							
	    // Check that "selector" parameter has passed
	    if ($(options.selector).length === 0) {
					
		// Bind the event to the images
		$(images).bind(options.event, function(e){
						
		    // Load images
		    if ($.data(this, "loaded") !== "true") {
			$.asynchImageLoader._loadImage(options, this);
		    }
						
		    if (!options.callback) {
			return false;
		    }
						
		    // Callback called in case it's been specified
		    return options.callback.call(this, options);
		});
					
	    } else {
				    
		// Bind the event to the selector specified in the config obj
		$(options.selector).bind(options.event, function(e){
						
		    // Each image is loaded when the event is triggered
		    $(images).each(function(){
								
			// Check that the image hasn't been loaded before
			if ($.data(this, "loaded") !== "true") {
			    $.asynchImageLoader._loadImage(options, this);
							}
		        });
		
		        if (!options.callback) {
			    return false;
			}
						
			// Callback called in case it's been specified
		        return options.callback.call(this, options, images);
		    });
		}
	    },
	        
	    // Images loaded triggered with some delay
	    later : function(options) {
			var images = $(this);
					
	        setTimeout(function() {
					
		    // Images visible loaded onload
		    images.each(function(){
			$.asynchImageLoader._checkTheImageInTheScreen(options, this);
		    });
		
			didScroll = false;

			$(window).scroll(function() {
    			didScroll = true;
			});

			setInterval(function() {
    			    if ( didScroll ) {
        			didScroll = false;
        		        images.each(function(){
		            	     if ($.data(this, "loaded") !== "true") {
					$.asynchImageLoader._checkTheImageInTheScreen(options, this);
                    	             }
			        });
    			    }
			}, 250);
		}, options.timeout);
	    },
	        
	    // Images loaded after the user scolls up/down
	    onScroll : function(options) {
			
			var images = $(this)
			didScroll = false;

			$(window).scroll(function() {
    			    didScroll = true;
			});

			setInterval(function() {
    			    if ( didScroll ) {
        			didScroll = false;
        		        images.each(function(){
					$.asynchImageLoader._checkTheImageInTheScreen(options, this);
		    		});
    		            }
			}, 250);
		},
	
	    // Function that checks if the images have been loaded
	    _checkTheImageInTheScreen : function(options, image){	
				
		if ($.data(image, "loaded") === "true") {
		    return;
		}
					
		if ($.asynchImageLoader._isInTheScreen(window, image)) {
		    $.asynchImageLoader._loadImage(options, image);
		}
	    },
	        
	    // Function that returns true if the image is visible inside the "window"
	    _isInTheScreen : function(windowEl, image) {
		return ($(windowEl).scrollTop() <= $(image).offset().top) &&
		    (($(windowEl).scrollTop() + $(windowEl).height()) >= ($(image).offset().top) &&
			($(windowEl).scrollLeft() <= $(image).offset().left) &&
			    (($(windowEl).scrollLeft() + $(windowEl).width()) >= $(image).offset().left));
		},
	        
	    // Main function --> Load the images copying the "data-href" attribute into the "src" attribute
	    _loadImage : function(options, image) {
				
                if (options.effect.match('/fadein/ig')) {
		    $(image).attr("src", $(image).attr("data-href")).fadeIn(options.speed);
		    $.data(image, "loaded","true");
		} else {
		    $(image).attr("src", $(image).attr("data-href")).show();
		$.data(image, "loaded","true");
                }
	    }
    };
}(jQuery));
