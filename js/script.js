
    (function($){
    	
    	var methods = {
    		
	    		// Images load triggered by en event
	    		imagesLoadOnEvent : function(options) {
	    			var elements = $(this);
	        		
		        	// Load the images inside the "imgWrapper" node
		            $(options.selector).bind(options.event, function(e){
		            	$(this).parents(options.group).find(elements.selector).each(function(){
		                    if (!($(this).parent().get(0).tagName.match(/noscript/ig))) {
		                    	functions.loadImage (options, this);
		                    }
		                });
		                e.preventDefault();
		            });	
		        },
		        
		        // Images load triggered by en event
		        imagesLoadLater : function(options) {
	        		
		        	var elements = $(this),
		        		optionsReal = options[0];
		        	
		        	// Load the images after a timeout
		            elements.each(function(){
		            	var element = this;
		            	setTimeout(function() {
		            			functions.loadImage (options, element);
		            		}, optionsReal.timeout);
		            });	
		        },
		        
		        imagesVisibleLoad : function(options) {
	        		
		        	var elements = $(this);
		        	
		        	functions.checkTheImageInTheScreen(options, elements);
		        		
		        	// Load the images inside the "imgWrapper" node
		        	$(window).bind("scroll", function() {
		        		return functions.checkTheImageInTheScreen(options, elements);
		        	});
		        }
	    },
	    	functions = {
	        
		        checkTheImageInTheScreen : function(options, elements){
	        		elements.each(function(){
	        			var element = this;
	        			if ($.data(element, "loaded") === "true") {
	        				return;
	        			}
	        			
		    			if (functions.isInTheScreen(element)) {
		    				functions.loadImage (options, element);
		    				$.data(element, "loaded", "true");
		    			} else {
		    				$.data(element, "loaded", "false");
		    			}
	        		})
		        },
		        
		       isInTheScreen : function(element) {
	        		return ($(window).scrollTop() < $(element).offset().top) &&
	        				(($(window).scrollTop() + $(window).height()) > $(element).offset().top) &&
	        					($(window).scrollLeft() < $(element).offset().left) &&
	        						(($(window).scrollLeft() + $(window).width()) > $(element).offset().left);
				},
		        
		        loadImage : function(options, element) {
		        	if (options.effect === 'fadein') {
		                $(element).attr("src", $(element).attr("name")).fadeIn(options.speed);
		            } else {
		                $(element).attr("src", $(element).attr("name")).show();
		            }
		        }
    	}
        $.fn.asynchImageLoader = function(options) {
            options = $.extend({
                    timeout : 3000,
                    speed : 400,
                    selector: 'a',
                    event : 'load',
                    group : 'body',
                    loader : 'img/loader.gif',
                    effect : 'fadein',
                    placeholder : true
            }, options);
           
            var elements = this;
           
            // Set the loader in case the image is showing up on load
            if (!options.placeholder) {
                elements.each(function(){
                    $(this).attr("src", options.loader);
                });
            }
           
            switch (options.event) {
            	case 'click' :
            		methods.imagesLoadOnEvent.apply(this, Array.prototype.slice.call(arguments));
		            break;
		        case 'mouseover' :
		        	methods.imagesLoadOnEvent.apply(this, Array.prototype.slice.call(arguments));
		            break;
		        case 'scroll' :
		       	 	methods.imagesVisibleLoad.apply(this, Array.prototype.slice.call(arguments));
            		break;
		        default:
		        	methods.imagesLoadLater.call(this, [options]);
		    };
             
            return this;
        };
        
        $.imageLoader = function(event, options, imgSelector) {
        	
        	// Load the images inside the "imgWrapper" node
            $(options.selector).bind(event, function(e){
            	$(this).parents(options.group).find(imgSelector).each(function(){
                    if (!($(this).parent().get(0).tagName.match(/noscript/ig))) {
                    	loadImage (options, this);
                    }
                });
                e.preventDefault();
            });	
        };
        
        $.imageLoaderLater = function(options, imgSelector) {
        	
        	// Load the images after a timeout
            $(imgSelector).each(function(){
            	var element = this;
            	setTimeout(function() {
            			loadImage (options, element);
            		}, options.timeout);
            });	
        };
        
        $.imageLoaderInTheFold = function(options, imgSelector) {
        	
        	var checkTheImageInTheScreen = (function(){
        		$(imgSelector).each(function(){
        			var element = this;
	    			if (isInTheScreen(element)) {
	    				loadImage (options, element);
	    				jQuery.data(element, "loaded", "true");
	    			}
        		})
        	})();
        		
        	// Load the images inside the "imgWrapper" node
        	$(window).bind("scroll", function() {
        		return $.imageLoaderInTheFold.checkTheImageInTheScreen;
        	});
        };
        
       
    }(jQuery));
 