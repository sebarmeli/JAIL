# Jquery Asynchronous Image Loader (JAIL)

JAIL is a jQuery plugin that lazy load images making your page load faster. 

[![Build Status](https://secure.travis-ci.org/sebarmeli/JAIL.png)](http://travis-ci.org/sebarmeli/JAIL)

Images are downloaded when they are visible or when they become visible inside the viewport (area you see in your browser). Images can be loaded after an event is triggered (such as `click`, `mouseover`, and `scroll`) or after a specified delay.  It's advisable to call jail() after the DOM has been constructed (document ready).

## Getting Started

First of all, this plugin requires you to make some HTML changes. The `data-src` attribute (HTML5 data attribute) should contain the location of the image, instead the `src` attribute should contain a placeholder such as a really tiny image (E.g. 1 px x 1 px). Also, I would suggest to add a `noscript` block so that in case the user doesn't have Javascript enabled, the images will be displayed (progressive enhancement).

```html
	<img class="lazy" src="/img/blank.gif" data-src="/img/image1.jpg"/>
	<noscript>
		<img src="/img/image1.jpg"/>
	</noscript>
```

In a basic scenario, you just need to import `jquery`, `jail.js` and call the jail() function on the images you want to lazy load.

```html
	<script src="/lib/jquery.js"></script>
	<script src="/src/jail.js"></script>
	<script>
		$(function(){
			$('img.lazy').jail();
		});
	</script>
```

The images in the viewport are loaded straight away after the DOM is ready. As soon other images become visible in the viewport (for instance after the user scrolls down), they are lazy loaded.

## Config
You can add additional configuration options when you initially call jail():

- `id`          : unique identifier for this jail instance. - Default: `jail`
- `timeout`     : number of msec after that the images will be loaded - Default: `10`
- `effect`      : any jQuery effect that makes the images display (e.g. "fadeIn") - Default: `NULL`

  **NOTE:** If you are loading a large number of images, it is best  NOT to use this setting.

- `speed`       : string or number determining how long the animation will run  - Default: 400
- `triggerElement`    : selector that triggers the images to be loaded - Default: `NULL`
- `event`       : event : event that triggers the image to be loaded. You can choose among `load`, `click`, `mouseover`, 'scroll', etc. Default: `load`
- `callback`    : function that will be called after all the images are loaded - Default: ""
- `callbackAfterEachImage`    : function that will be called after each image is loaded - Default: ""
- `placeholder` : location of an image (such a loader) you want to display while waiting for the images to be loaded - Default: ""
- `offset`      : an offset of "500" would cause any images that are less than 500px below the bottom of the window or 500px above the top of the window to load. - Default: 0
- `loadHiddenImages` : boolean to load hidden images - Default: false (so hidden images are not loaded)

## How to invoke jail()

Here are some examples on how to invoke jail() in order to have a better understanding of how the plugin works

### Load images after clicking on anchor with id 'link'. The images will fade in with speed 500. Placeholder specified.

```javascript
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
```

### Initially load the visible images within `#my_container`. Then, as you scroll inside `#my_container`, images become visible

```javascript
	$(function(){
		$('img.lazy').jail({
			triggerElement:'#my_container',
			event: 'scroll'
		});
	});
```

### After 1 second the hidden images are loaded

```javascript
	$(function(){
		$('img.lazy').jail({
			timeout : 1000
		});
	});
```

### Load images after mouse-overing on the placeholder for the image

```javascript
	$(function(){
		$('img.lazy').jail({
			event: 'mouseover',
			placeholder : 'img/loader.gif'
		});
	});
```

### Load the images that are up to 300px over/below theviewport

```javascript
	$(function(){
		$('img.lazy').jail({
			offset : 300
		});
	});
```

### Alert saying "all the images are loaded" is called after all the images are loaded, alert saying "one image is loaded" after one image is loaded 

```javascript
	$(function(){
		$('img.lazy').jail({
			callback : (function(){alert("All the images are loaded");}),
			callbackAfterEachImage : function() {alert("one image is loaded");}
		});
	});
```

### Ignore hidden images to be loaded (images with or under a "display:none" or with hidden "visibility" or not visible inside a "overflow:hidden" element)

```javascript
	$(function(){
		$('img.lazy').jail({
			loadHiddenImages : true
		});
	});
```

### Create multiple jail instances for various image collections. Required when asynchronously rendering templates that contain images that should also be jailed.

```javascript
	$(function(){
		$('img.lazy').jail({id: 'page'});
		$('#template').load('/serverside.html', function(){
			$('#template img.lazy').jail({id: 'template'});
		});
	});
```

## Demo

You can view a few demo examples usign JAIL [here](https://github.com/sebarmeli/JAIL/tree/master/demo)

## AMD support

Plugin supports AMD through define() method. If you use RequireJS (version > 2.0), you can require the plugin as follows:

```javascript
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: 'src'
    },
    shim: {
        'app/jail': ['jquery']
    }
});

require(["jquery", "app/jail"], function() {
    $(function(){
		$('img.lazy').jail();
	});
});
```

For more information, you view example 14 and example 15 from the [demo folder](https://github.com/sebarmeli/JAIL/tree/master/demo)

## Testing / Building the plugin

After getting node and npm, install grunt and grunt-jasmine-runner.

```npm install grunt```
```npm install grunt-jasmine-runner```

You can run Jasmine specs through phantomjs with :

```grunt jasmine```

If you don't have phantomjs, please download it from [here](http://phantomjs.org/)

You can run JSHint, Jasmine specs and minification tool simply launching: ```grunt```

## Licence

Copyright (c) 2011-2012 Sebastiano Armeli-Battana
Licensed under the MIT license.
(https://github.com/sebarmeli/JAIL/blob/master/MIT-LICENSE.txt)
