
/*global alert:false*/

var phantom = phantom || {};

phantom.sendMessage = function(){
  var args = [].slice.call( arguments );
  alert( JSON.stringify( args ) );
};



