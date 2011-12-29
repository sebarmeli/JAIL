require(["jquery", "../../jail"], function() {
    $(function(){
		$('img.lazy').each(function(i){
			$(this).jail({
				triggerElement:'a#link' + (i + 1), 
				event: 'click', 
				effect: 'fadeIn',
				speed : 500
			});
		});
	});
});