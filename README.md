# JAIL aka Jquery Asynchronous Image Loader

JAIL helps loading images asynchronously and it can be used to make your page load faster. 

Selected images will be downloaded after the document is ready not blocking the page to render elements in your page. Images can be loaded after an event is triggered (like clicking on a link, mouseovering on some elements, scrolling up/down) or after some delay.

First of all, this plugin requires you to make some HTML changes. The "data-href" HTML5 data attribute should contain the location of the image, instead the "src" attribute should contain a really tiny image, like 1 pixel x 1 pixel. Also I'd suggest to add a noscript block so that in case the user doesn't have JS enabled, the images will be displayed (progressive enhancement).

<pre>
	<code>
		&lt;img class="lazy" src="/img/blank.gif" data-href="/img/image1.jpg" &gt;
		&lt;noscript&gt;
			&lt;img src="/img/image1.jpg" &gt;
		&lt;noscript&gt;
	</code>
</pre>

In a basic scenario, you just need to import jquery, jquery-asynchImageLoader.js and call the function on the images you want to lazy load. 

<pre>
	<code>
		&lt;script src="/js/jquery.js"&gt;&lt;/script&gt;
		&lt;script src="/js/jquery-asynchImageLoader.js"&gt;&lt;/script&gt;
	</code>
</pre>
<pre>
	<code>
		&lt;script&gt;
			 $(function(){
			 	$('img.lazy').asynchImageLoader();
		     });
		&lt;/script&gt;
	</code>
</pre>

If you inspect the HTTP Requests you'll see how the images are loaded after the DOM is ready.

You can add more configurations when you call the asynchImageLoader function:
- timeout	 : number of msec after that the images will be loaded  - Default: 10ms
- effect 	 : effect that makes the images display (Eg "fadein")   - Default: "show"
- speed  	 : in case of selecting "fadein" effect, you can set the speed of fading.	- Default: 400
- selector   : selector that you need to bind the trigger event     - Default: ""
- event 	 : event that triggers the image to load	- Default: "load"
- callback 	 : function that will be called after the images are loaded		- Default: ""
- placeholder: location of an image (such a loader) you want to display while waiting for the images to be loaded 	- Default: ""

This is another example:
<pre>
	<code>
		&lt;script&gt;
			 $(function(){
			 	$('img.lazy').asynchImageLoader({
					selector:'a#link',
                	event: 'click', 
                	effect: 'fadeIn',
                	speed : '500',
					placeholder : 'img/loader.gif'
                	callback : SA.setActive
				});
		     });
		&lt;/script&gt;
	</code>
</pre>

You can view the demos to have a better understanding of how the plugin works 

#Update 20/01/2011:

Version 0.2 released - HTML5 Data-attr used instead of "name" attribute

