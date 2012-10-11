# Jquery Asynchronous Image Loader (JAIL)

JAIL helps loading images asynchronously and it can be used to make your page load faster. 

Selected images will be downloaded if they are visible and when they are visible inside the viewport (rectangular viewing region). Images can be loaded after an event is triggered (such as `click`, `mouseover`, and `scroll`) or after a specified delay.  It's advisable to call jail() after the DOM has been constructed (document ready).

First of all, this plugin requires you to make some HTML changes. The `data-src` ('data-href' prior version 0.9.8) attribute (HTML5 data attribute) should contain the location of the image, instead the `src` attribute should contain a placeholder such as a really tiny image (E.g. 1 px x 1 px). Also, I would suggest to add a `noscript` block so that in case the user doesn't have Javascript enabled, the images will be displayed (progressive enhancement).

<pre>
	<code>
		&lt;img class="lazy" src="/img/blank.gif" data-src="/img/image1.jpg" &gt;
		&lt;noscript&gt;
			&lt;img src="/img/image1.jpg" &gt;
		&lt;/noscript&gt;
	</code>
</pre>

In a basic scenario, you just need to import `jquery`, `jail.js` and call the function on the images you want to lazy load.

<pre>
	<code>
		&lt;script src="/js/jquery.js"&gt;&lt;/script&gt;
		&lt;script src="/js/jail.js"&gt;&lt;/script&gt;
		&lt;script&gt;
			 $(function(){
			 	$('img.lazy').jail();
		     });
		&lt;/script&gt;
	</code>
</pre>

You will verify how only the visible images are loaded after the DOM is ready. As soon other images become available in the viewport (for instance scrolling down), they are lazy loaded.

You can add additional configuration options when you initially call jail():

* `timeout`     : number of msec after that the images will be loaded - Default: `10`
* `effect`      : any jQuery effect that makes the images display (e.g. "fadeIn") - Default: `NULL`

  **NOTE:** If you are loading a large number of images, it is best to NOT use this setting. Effects calls are very expensive. Even a simple `show()` can have a major impact on the browser's responsiveness.

* `speed`       : string or number determining how long the animation will run  - Default: 400
* `triggerElement`    : selector that you need to bind the trigger event - Default: `NULL`
* `event`       : event : event that triggers the image to load. You can choose among `load`, `click`, `mouseover`, 'scroll', etc. Default: `load`
* `callback`    : function that will be called after all the images are loaded - Default: ""
* `callbackAfterEachImage`    : function that will be called after each image is loaded - Default: ""
* `placeholder` : location of an image (such a loader) you want to display while waiting for the images to be loaded - Default: ""
* `offset`      : an offset of "500" would cause any images that are less than 500px below the bottom of the window or 500px above the top of the window to load. - Default: 0
* `loadHiddenImages` : boolean to load hidden images - Default: false (so hidden images are not loaded)

## Examples

Here are some examples in order to have a better understanding of how the plugin works

### Load images after clicking on anchor with id 'link'. The images will fade in with speed 500. Placeholder specified.

<pre>
	<code>
		&lt;script&gt;
			$(function(){
				$('img.lazy').jail({
					triggerElement:'a#link',
					event: 'click',
					effect: 'fadeIn',
					speed : 500,
					placeholder : 'img/loader.gif',
					callback : SA.setActive
				});
			});
		&lt;/script&gt;
	</code>
</pre>


### Initially load the visible images within `#my_container`. Then, as `#my_container` is scrolled (let's say it has scrolling bars), load the images that become visible

<pre>
	<code>
		&lt;script&gt;
			$(function(){
				$('img.lazy').jail({
					triggerElement:'#my_container',
					event: 'scroll'
				});
			});
		&lt;/script&gt;
	</code>
</pre>

### After 1 second the hidden images are loaded

<pre>
	<code>
		&lt;script&gt;
			$(function(){
				$('img.lazy').jail({
					timeout : 1000
				});
			});
		&lt;/script&gt;
	</code>
</pre>

### Load images after mouse-overing on the placeholder for the image

<pre>
	<code>
		&lt;script&gt;
			$(function(){
				$('img.lazy').jail({
					event: 'mouseover',
					placeholder : 'img/loader.gif'
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
				$('img.lazy').jail({
					offset : 300
				});
			});
		&lt;/script&gt;
	</code>
</pre>

### Alert saying "all the images are loaded" is called after all the images are loaded, alert saying "one image is loaded" after one image is loaded 

<pre>
	<code>
		&lt;script&gt;
			$(function(){
				$('img.lazy').jail({
					callback : (function(){alert("All the images are loaded");}),
					callbackAfterEachImage : function() {alert("one image is loaded");}
				});
			});
		&lt;/script&gt;
	</code>
</pre>

### Ignore hidden images to be loaded (images with or under a "display:none" or with hidden "visibility" or not visible inside a "overflow:hidden" element)
<pre>
	<code>
		&lt;script&gt;
			$(function(){
				$('img.lazy').jail({
					loadHiddenImages : true
				});
			});
		&lt;/script&gt;
	</code>
</pre>

## Tests

You can run tests by pointing your web browser at `[location of JAIL]/test/test.html`

## AMD

Plugin supports AMD through define() method. You can call the plugin using RequireJS for example, see 'example14' and 'example15' in the 'demo' folder.

## package.json

Json file defining the plugin that will be used by plugins.jquery.com

## Licence

MIT License - see MIT-LICENSE.txt
