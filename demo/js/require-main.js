requirejs.config({
    
    baseUrl: '../lib',
    
    paths: {
        app: '../src'
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