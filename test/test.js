// Create new YUI instance, and populate it with the required modules
YUI().use("node", "console", "test", "node-event-simulate", function (Y) {
 
	// Test Case for delayed images loaded
		var testCaseAsynch = new Y.Test.Case({
			name: "TestCase Images loaded after timeout",
			setUp : function() {
				$('#container').append('<img class="lazy" data-href="../sample1.jpg" src="../img/blank.jpg" width="200" height="200"/> ');
			},
			tearDown : function() {
				$('.lazy').remove();
			},

			"test Images Loaded Asynchronously after DOM is ready" : function() {
				// Call to the method
				$('img.lazy').asynchImageLoader();

				this.wait(function(){
					Y.Assert.areEqual($('img.lazy').attr("src"), "../sample1.jpg");
					Y.Assert.isTrue( $('img.lazy').data('loaded'));
					Y.Assert.isUndefined( $('img.lazy').attr('data-href'));
				}, 10);
			},

			"test Images Loaded Asynchronously with 1 seconds Delay" : function () {
				// Call to the method with timeout
				$('img.lazy').asynchImageLoader({timeout : 1000 });
				
				Y.Assert.areEqual($('img.lazy').attr("src"), "../img/blank.jpg");

				this.wait(function(){
					Y.Assert.areEqual($('img.lazy').attr("src"), "../sample1.jpg");
				}, 1000);
			}
		});
	
		// Test Case for images loading after a click
		var testCaseClickAsynch = new Y.Test.Case({
			name: "TestCase Images loaded after a click",
			setUp : function() {
				$('#container')
					.append('<a class="link">Link</a><img id="img1" class="lazy" data-href="img1.jpg" src="blank.jpg" /><img class="lazy" data-href="img2.jpg" src="blank.jpg" /> ')
					.append('<a class="link2">Link</a><img class="lazy" data-href="img3.jpg" src="blank.jpg" /><img class="lazy" data-href="img4.jpg" src="blank.jpg" 	/>');
			},
			tearDown : function() {
				$('.lazy').remove();
				$('.link').remove();
				$('.link2').remove();
			},

			"test All Images Loaded after a click on a link" : function () {
				$('img.lazy').asynchImageLoader({event: "click", selector : "a.link" });

				// Click on the link
				Y.one("a.link").simulate("click");

				this.wait(function() {
					Y.Assert.areEqual($('img.lazy').eq(0).attr("src"), "img1.jpg");
					Y.Assert.areEqual($('img.lazy').eq(1).attr("src"), "img2.jpg");
					Y.Assert.areEqual($('img.lazy').eq(2).attr("src"), "img3.jpg");
					Y.Assert.areEqual($('img.lazy').eq(3).attr("src"), "img4.jpg");
				}, 1);
			},

			"test Image Fades in after a click on the image placeholder" : function () {
				$('img.lazy').asynchImageLoader({event: "click", effect : "fadeIn", placeholder: "img/loader" });

				Y.one("#img1").simulate("click");

				Y.Assert.areEqual($('img.lazy').eq(0).attr("src"), "img1.jpg");
				Y.Assert.areEqual($('img.lazy').eq(1).attr("src"), "img/loader");
				Y.Assert.areEqual($('img.lazy').eq(2).attr("src"), "img/loader");
				Y.Assert.areEqual($('img.lazy').eq(3).attr("src"), "img/loader");
			},

			"test Images loaded after a click on a link and callback associated" : function () {
				Y.Assert.areEqual(value, "10");

				$('img.lazy').asynchImageLoader({event: "click", selector : "a.link", callback : function(){value=20;}});

				Y.one("a.link").simulate("click");

				this.wait(function() {
					Y.Assert.areEqual($('img.lazy').eq(0).attr("src"), "img1.jpg");
					Y.Assert.areEqual($('img.lazy').eq(1).attr("src"), "img2.jpg");
					Y.Assert.areEqual($('img.lazy').eq(2).attr("src"), "img3.jpg");
					Y.Assert.areEqual($('img.lazy').eq(3).attr("src"), "img4.jpg");

					Y.Assert.areEqual(value, "20");
				}, 1);
			}
		});

		// Test Case for images loading after mouseover on a div
		var testCaseMouseOverAsynch = new Y.Test.Case({
			name: "TestCase Images loaded after mousing over on a div",
			setUp : function() {
				$('#container').append('<div id="tool" class="tool"></div><img id="img1" class="lazy" data-href="img1.jpg" src="blank.jpg" /><img class="lazy" data-href="img2.jpg" src="blank.jpg" /> ');
				$('body').append('<div id="wrapper"><div class="container2"><a class="link2">Link</a><img class="lazy" data-href="img3.jpg" src="blank.jpg" /><img class="lazy" data-href="img4.jpg" src="blank.jpg" /></div></div>');
			},
			tearDown : function() {
				$('.tool').remove().empty();
				$('.lazy').remove().empty();
				$('.link').remove().empty();
				$('#wrapper').remove().empty();
			},

			"test All Images Loaded after a mouse over on a div" : function () {
				$('img.lazy').asynchImageLoader({event: "mouseover", selector : ".tool" });

				//Click on the link
				Y.one("#tool").simulate("mouseover");

				this.wait(function() {
					Y.Assert.areEqual($('img.lazy').eq(0).attr("src"), "img1.jpg");
					Y.Assert.areEqual($('img.lazy').eq(1).attr("src"), "img2.jpg");
					Y.Assert.areEqual($('img.lazy').eq(2).attr("src"), "img3.jpg");
					Y.Assert.areEqual($('img.lazy').eq(3).attr("src"), "img4.jpg");

					testCaseMouseOverAsynch.tearDown();
				}, 1);
			},

			"test Image loading after mousing over" : function() {
				testCaseMouseOverAsynch.setUp();

				$('img.lazy').asynchImageLoader({event: "mouseover"});

				Y.one("#img1").simulate("mouseover");

				Y.Assert.areEqual($('img.lazy').eq(0).attr("src"), "img1.jpg");
				Y.Assert.areEqual($('img.lazy').eq(1).attr("src"), "blank.jpg");
				Y.Assert.areEqual($('img.lazy').eq(2).attr("src"), "blank.jpg");
				Y.Assert.areEqual($('img.lazy').eq(3).attr("src"), "blank.jpg");

				testCaseMouseOverAsynch.tearDown();
			},

			"test Images only inside a wrapper after mousing over on a link" : function() {
				testCaseMouseOverAsynch.setUp();
				$('img.lazy').asynchImageLoader({event: "mouseover", selector : ".tool", callback : function(){value2=20;}});

				Y.one(".tool").simulate("mouseover");

				this.wait(function() {
					Y.Assert.areEqual($('.container2 img.lazy').eq(0).attr("src"), "img3.jpg");
					Y.Assert.areEqual($('.container2 img.lazy').eq(1).attr("src"), "img4.jpg");

					Y.Assert.areEqual(value2, "20");

					testCaseMouseOverAsynch.tearDown();
				}, 1);
			}
		});

	var console = new Y.Console({
		verbose: true,
		newestOnTop: false,
		style: "separate", // This prevents the Logger console from interferring with the tests
		width:"600px",
		height:"900px"
	});

	console.render('#testLogger');

	Y.Test.Runner.add(testCaseAsynch);
	Y.Test.Runner.add(testCaseClickAsynch);
	Y.Test.Runner.add(testCaseMouseOverAsynch);
	Y.Test.Runner.run();

	// Ensure that the test window isn't scrolled itself, or tests will fail!
	$(window).scrollTop(0);
	$('body').css('overflow','hidden'); // Prevent the scrolling of the test window to prevent false test failures
3});

