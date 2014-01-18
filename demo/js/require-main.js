requirejs.config({
    
    baseUrl: '../lib',
    
    paths: {
        app: '../src'
    }
});

require(["jquery", "app/jail"], function() {
    $(function(){
		$('img.lazy').jail();
	});
});
