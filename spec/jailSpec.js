describe("JAIL plugin", function(){

	afterEach(function(){
		$('#container').empty();
	});
	
	it("should load the images when visible", function(){
		loadFixtures('myfixture.html');
		runs(function(){
			$('#container img').jail();
		});

		waitsFor(function(){
			return (!!$('img#img1').attr("src").match("sample1.jpg"));
		}, 1000);
		
		// img1 visible, img2 not visible
		runs(function(){
			expect($('img#img1').attr("data-src")).toBeFalsy();
			expect($('img#img2').attr("data-src")).toBeTruthy();
		});
	});

	it("should load an image after scrolling down and the image becomes visible", function(){
		loadFixtures('myfixture2.html');
		// Not loaded immediately
		expect($('img#img2').attr("data-src")).toBeTruthy();
		expect($('img#img3').attr("data-src")).toBeTruthy();

		runs(function(){
			$('#container img').jail();
			$('html, body').animate({
		        scrollTop: $("#img2").offset().top
		    }, 100);
		});

		waitsFor(function(){
			return (!!$('img#img2').attr("src").match("sample2.jpg"));
		}, 1000);
		
		// img1 visible, img2  visible, im3 not visible
		runs(function(){
			expect($('img#img1').attr("data-src")).toBeFalsy();
			expect($('img#img2').attr("data-src")).toBeFalsy();
			expect($('img#img3').attr("data-src")).toBeTruthy();
		});
	});

	it("should load the images when visible after 1000ms with parameter 'timeout:1000'", function(){
		loadFixtures('myfixture.html');
		runs(function(){
			$('#container img').jail({timeout: 1000});
		});

		waitsFor(function(){
			return (!!$('img#img1').attr("src").match("sample1.jpg"));
		}, 2000);
		
		// Not loaded immediately
		expect($('img#img1').attr("data-src")).toBeTruthy();

		// img1 visible, img2 not visible
		runs(function(){
			expect($('img#img1').attr("data-src")).toBeFalsy();
			expect($('img#img2').attr("data-src")).toBeTruthy();
		});
	});

	it("should load the images when visible or, not visible but within a certain 'offset'", function(){
		loadFixtures('myfixture.html');
		runs(function(){
			$('#container img').jail({offset: 1200});
		});

		waitsFor(function(){
			return (!!$('img#img2').attr("src").match("sample2.jpg"));
		}, 1000);
		
		// Not loaded immediately
		expect($('img#img2').attr("data-src")).toBeTruthy();

		// img1 visible, img2 visible
		runs(function(){
			expect($('img#img1').attr("data-src")).toBeFalsy();
			expect($('img#img2').attr("data-src")).toBeFalsy();
		});
	});

	it("should load an image after clicking on a link", function(){
		loadFixtures('myfixture2.html');

		// Not loaded immediately
		expect($('img#img1').attr("data-src")).toBeTruthy();
		expect($('img#img2').attr("data-src")).toBeTruthy();
		expect($('img#img3').attr("data-src")).toBeTruthy();

		runs(function(){
			$('#container img').jail({
				event: 'click',
				triggerElement: 'a.link'
			});
			$('a.link').click();
		});

		waitsFor(function(){
			return (!!$('img#img1').attr("src").match("sample1.jpg"));
		}, 2000);
		
		// img1 loaded, img2 not visible, im3 visible
		runs(function(){
			expect($('img#img1').attr("data-src")).toBeFalsy();
			expect($('img#img2').attr("data-src")).toBeTruthy();
			expect($('img#img3').attr("data-src")).toBeTruthy();
		});

		runs(function(){
			$('html, body').animate({
		        scrollTop: $("#img2").offset().top
		    }, 10);
		});

		waitsFor(function(){
			return (!!$('img#img2').attr("src").match("sample2.jpg"));
		}, 3000);

		// img1 loaded, img2 not visible, im3 visible
		runs(function(){
			expect($('img#img2').attr("data-src")).toBeFalsy();
			expect($('img#img3').attr("data-src")).toBeTruthy();
		});
	});

	it("should load the image after mouseovering on it", function(){
		loadFixtures('myfixture2.html');
		
		// Not loaded immediately
		expect($('img#img1').attr("data-src")).toBeTruthy();
		expect($('img#img2').attr("data-src")).toBeTruthy();
		expect($('img#img3').attr("data-src")).toBeTruthy();

		runs(function(){
			$('html, body').animate({
		        scrollTop: $("#img2").offset().top
		    }, 100);
		    $('#container img').jail({
				event: 'mouseover'
			});
			$('#img2').mouseover();
		});

		waitsFor(function(){
			return (!!$('img#img2').attr("src").match("sample2.jpg"));
		}, 1000);
		
		// img1 visible, img2 visible, img3 not loaded
		runs(function(){
			expect($('img#img2').attr("data-src")).toBeFalsy();
			expect($('img#img3').attr("data-src")).toBeTruthy();
		});
	});

	it("should call callbacks after the images are loaded", function(){
		loadFixtures('myfixture2.html');

		// Not loaded immediately
		expect($('img#img1').attr("data-src")).toBeTruthy();
		expect($('img#img2').attr("data-src")).toBeTruthy();
		expect($('img#img3').attr("data-src")).toBeTruthy();

		runs(function(){
			$('html, body').animate({
		        scrollTop: $("#img2").offset().top
		    }, 100);
		    $('#container img').jail({
				callback: function () { $('img').attr("alt", "Alternative"); },
				callbackAfterEachImage: function () { $('img').attr("alt", "New alt"); }
			});
		});

		waitsFor(function(){
			return (!!$('img#img2').attr("src").match("sample2.jpg"));
		}, 1000);
		
		// img1 visible, img2 visible, img3 not loaded
		runs(function(){
			expect($('img#img1').attr("data-src")).toBeFalsy();
			expect($('img#img2').attr("data-src")).toBeFalsy();
			expect($('img#img3').attr("data-src")).toBeTruthy();

			expect($('img').attr("alt")).toBe("New alt");
		});

		runs(function(){
			$('html, body').animate({
		        scrollTop: $("#img3").offset().top
		    }, 10);
		});

		waitsFor(function(){
			return (!!$('img#img3').attr("src").match("sample3.jpg"));
		}, 3000);

		runs(function(){
			expect($('img#img3').attr("data-src")).toBeFalsy();
			expect($('img').attr("alt")).toBe("Alternative");
		});

	});

	it("should load all images even the hidden ones", function(){
		loadFixtures('myfixture2.html');

		// Not loaded immediately
		expect($('img#img1').attr("data-src")).toBeTruthy();
		expect($('img#img2').attr("data-src")).toBeTruthy();
		expect($('img#img3').attr("data-src")).toBeTruthy();

		$('#container').css('visibility', 'hidden');

		runs(function(){
			$('#container img').jail({
				loadHiddenImages: true
			});
			$('html, body').animate({
		        scrollTop: $("#img2").offset().top
		    }, 10);
		});

		waitsFor(function(){
			return (!!$('img#img2').attr("src").match("sample2.jpg"));
		}, 3000);
		
		// img1 visible, img2 visible, img3 not loaded
		runs(function(){
			expect($('img#img2').attr("data-src")).toBeFalsy();
		});
	});
});