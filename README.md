# jQuery Asynchronous Image Loader (JAIL)

JAIL helps loading images asynchronously and it can be used to make your page load faster. 

Selected images will be downloaded after the document is ready not blocking the page to render elements in your page. Images can be loaded after an event is triggered (like `click`, `mouseover`, and `scroll`) or after a specified delay.

First of all, this plugin requires you to make some HTML changes. The `data-href` HTML5 data attribute should contain the location of the image, instead the `src` attribute should contain a really tiny image, like 1 pixel x 1 pixel. Also, I'd suggest to add a `noscript` block so that in case the user doesn't have Javascript enabled, the images will be displayed (progressive enhancement).

<pre>
	<code>
		&lt;img class="lazy" src="/img/blank.gif" data-href="/img/image1.jpg" &gt;
		&lt;noscript&gt;
			&lt;img src="/img/image1.jpg" &gt;
		&lt;noscript&gt;
	</code>
</pre>

In a basic scenario, you just need to import `jquery`, `jquery-asynchImageLoader.js` and call the function on the images you want to lazy load.

<pre>
	<code>
		&lt;script src="/js/jquery.js"&gt;&lt;/script&gt;
		&lt;script src="/js/jquery-asynchImageLoader.js"&gt;&lt;/script&gt;
		&lt;script&gt;
			 $(function(){
			 	$('img.lazy').jail();
		     });
		&lt;/script&gt;
	</code>
</pre>

If you inspect the HTTP requests, you'll see how the images are loaded after the DOM is ready.

You can add additional configuration options when you initially call the `asynchImageLoader` function (or 'jail' function):

* `timeout`     : number of msec after that the images will be loaded - Default: `10`
* `effect`      : any jQuery effect that makes the images display (e.g. "fadeIn") - Default: `NULL`

  **NOTE:** If you are loading a large number of images, it is best to NOT use this setting. Effects calls are very expensive. Even a simple `show()` can have a major impact on the browser's responsiveness.

* `speed`       : string or number determining how long the animation will run  - Default: 400
* `selector`    : selector that you need to bind the trigger event - Default: `NULL`
* `event`       : event : event that triggers the image to load. You can choose `load`, `load+scroll`, `click`, `mouseover`, or `scroll`. Default: `load+scroll`
* `callback`    : function that will be called after the images are loaded - Default: ""
* `placeholder` : location of an image (such a loader) you want to display while waiting for the images to be loaded - Default: ""
* 'offset'      : an offset of "500" would cause any images that are less than 500px below the bottom of the window or 500px above the top of the window to load. - Default: 0

## More Examples

Here are some examples in order to have a better understanding of how the plugin works

### Load images on click, fade them in, and execute the `SA.setActive` callback

<pre>
	<code>
		&lt;script&gt;
			$(function(){
				$('img.lazy').asynchImageLoader({
					selector:'a#link',
					event: 'click',
					effect: 'fadeIn',
					speed : 500,
					placeholder : 'img/loader.gif'
					callback : SA.setActive
				});
			});
		&lt;/script&gt;
	</code>
</pre>

### Initially load the visible images within `#my_container`. Then, as `#my_container` is scrolled, load the images that become visible

<pre>
	<code>
		&lt;script&gt;
			$(function(){
				$('img.lazy').jail({
					selector : '#my_container'
				});
			});
		&lt;/script&gt;
	</code>
</pre>

The above example showcases the default `event` behavior (`load+scroll`)

### Once the `#my_container` element has been scrolled, load the newly visible images

<pre>
	<code>
		&lt;script&gt;
			$(function(){
				$('img.lazy').asynchImageLoader({
					selector:'#my_container',
					event: 'scroll'
				});
			});
		&lt;/script&gt;
	</code>
</pre>

### Immediately load the visible images and then, after 1 second has passed, load the hidden images

<pre>
	<code>
		&lt;script&gt;
			$(function(){
				$('img.lazy').jail({
					timeout : 1000,
					event: 'load'
				});
			});
		&lt;/script&gt;
	</code>
</pre>

### Load the images that are up to 300px below the window or up the window

<pre>
	<code>
		&lt;script&gt;
			$(function(){
				$('img.lazy').asynchImageLoader({
					offset : 300
				});
			});
		&lt;/script&gt;
	</code>
</pre>

## Tests

You can run tests by pointing your web browser at `[location of JAIL]/test/test.html`

# Update 20/01/2011:

Version 0.2 released - HTML5 data attribute `data-href` used instead of `name` attribute

# Update 21/01/2011:

Version 0.4 released - Added ability to detect scroll on containing elements instead of just `window`. Plus, lots of refactoring. (Contributor : Derek Lindahl - dlindahl)

# Update 27/01/2011:

Version 0.5 released - 'Delay' configuration removed, critical fix on unbind method, refactoring to pass JSLint without warnings.

# Update 05/02/2011:

Version 0.6 released - Fixed a critical issue on "effect" configuration

# Update 19/02/2011:

Version 0.7 released - Added "offset" configuration

# Update 03/04/2011:

Version 0.8 released - jail() function, fixed critical issue on v0.7, resizing function, scrolling fixes

