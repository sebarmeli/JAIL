describe("JAIL plugin", function() {

    afterEach(function() {
        $('#container').empty();
        $(window).off('scroll');
    });

    it("should load the images when visible", function(done) {
        loadFixtures('myfixture.html');
        $('#container img').jail();

        setTimeout(function() {
            expect($('img#img1').attr("src")).toMatch(/sample1.jpg/);
            expect($('img#img1').attr("data-src")).toBeFalsy();
            expect($('img#img2').attr("data-src")).toBeTruthy();
            done();
        }, 1000);
    });

    it("should load an image after scrolling down and the image becomes visible", function(done) {
        loadFixtures('myfixture2.html');
        expect($('img#img2').attr("data-src")).toBeTruthy();
        expect($('img#img3').attr("data-src")).toBeTruthy();

        $('#container img').jail();
        $('html, body').animate({
            scrollTop: $("#img2").offset().top
        }, 100);

        setTimeout(function() {
            expect($('img#img1').attr("src")).toMatch(/sample1.jpg/);
            expect($('img#img2').attr("src")).toMatch(/sample2.jpg/);
            expect($('img#img1').attr("data-src")).toBeFalsy();
            expect($('img#img2').attr("data-src")).toBeFalsy();
            expect($('img#img3').attr("data-src")).toBeTruthy();
            done();
        }, 1000);
    });

    it("should load the images when visible after 1000ms with parameter 'timeout:1000'", function(done) {
        loadFixtures('myfixture.html');
        $('#container img').jail({ timeout: 1000 });

        // Not loaded immediately
        expect($('img#img1').attr("data-src")).toBeTruthy();

        setTimeout(function() {
            expect($('img#img1').attr("src")).toMatch(/sample1.jpg/);
            expect($('img#img1').attr("data-src")).toBeFalsy();
            expect($('img#img2').attr("data-src")).toBeTruthy();
            done();
        }, 2000);
    });

    it("should load the images when visible or, not visible but within a certain 'offset'", function(done) {
        loadFixtures('myfixture.html');
        $('#container img').jail({ offset: 1200 });

        setTimeout(function() {
            expect($('img#img1').attr("src")).toMatch(/sample1.jpg/);
            expect($('img#img2').attr("src")).toMatch(/sample2.jpg/);
            expect($('img#img1').attr("data-src")).toBeFalsy();
            expect($('img#img2').attr("data-src")).toBeFalsy();
            done();
        }, 1000);
    });

    it("should load an image after clicking on a link", function(done) {
        loadFixtures('myfixture2.html');

        expect($('img#img1').attr("data-src")).toBeTruthy();
        expect($('img#img2').attr("data-src")).toBeTruthy();
        expect($('img#img3').attr("data-src")).toBeTruthy();

        $('#container img').jail({
            event: 'click',
            triggerElement: 'a.link'
        });
        $('a.link').click();

        setTimeout(function() {
            expect($('img#img1').attr("src")).toMatch(/sample1.jpg/);
            expect($('img#img1').attr("data-src")).toBeFalsy();
            expect($('img#img2').attr("data-src")).toBeTruthy();
            expect($('img#img3').attr("data-src")).toBeTruthy();

            $('html, body').animate({
                scrollTop: $("#img2").offset().top
            }, 10);

            setTimeout(function() {
                expect($('img#img2').attr("src")).toMatch(/sample2.jpg/);
                expect($('img#img2').attr("data-src")).toBeFalsy();
                expect($('img#img3').attr("data-src")).toBeTruthy();
                done();
            }, 1000);
        }, 1000);
    });

    it("should load the image after mouseovering on it", function(done) {
        loadFixtures('myfixture2.html');

        expect($('img#img1').attr("data-src")).toBeTruthy();
        expect($('img#img2').attr("data-src")).toBeTruthy();
        expect($('img#img3').attr("data-src")).toBeTruthy();

        $('html, body').animate({
            scrollTop: $("#img2").offset().top
        }, 100);

        $('#container img').jail({
            event: 'mouseover'
        });
        $('#img2').mouseover();

        setTimeout(function() {
            expect($('img#img2').attr("src")).toMatch(/sample2.jpg/);
            expect($('img#img2').attr("data-src")).toBeFalsy();
            expect($('img#img3').attr("data-src")).toBeTruthy();
            done();
        }, 1000);
    });

    it("should call callbacks after the images are loaded", function(done) {
        loadFixtures('myfixture2.html');

        expect($('img#img1').attr("data-src")).toBeTruthy();
        expect($('img#img2').attr("data-src")).toBeTruthy();
        expect($('img#img3').attr("data-src")).toBeTruthy();

        var callbackAfterEachImageCalled = false;
        var callbackCalled = false;

        $('html, body').animate({
            scrollTop: $("#img2").offset().top
        }, 100);

        $('#container img').jail({
            callback: function() {
                callbackCalled = true;
                $('img').attr("alt", "Alternative");
            },
            callbackAfterEachImage: function() {
                callbackAfterEachImageCalled = true;
                $('img').attr("alt", "New alt");
            }
        });

        setTimeout(function() {
            expect($('img#img1').attr("data-src")).toBeFalsy();
            expect($('img#img2').attr("data-src")).toBeFalsy();
            expect($('img#img3').attr("data-src")).toBeTruthy();
            expect(callbackAfterEachImageCalled).toBe(true);
            expect($('img').attr("alt")).toBe("New alt");

            $('html, body').animate({
                scrollTop: $("#img3").offset().top
            }, 10);

            setTimeout(function() {
                expect($('img#img3').attr("data-src")).toBeFalsy();
                expect(callbackCalled).toBe(true);
                expect($('img').attr("alt")).toBe("Alternative");
                done();
            }, 1000);
        }, 1000);
    });

    it("should load all images even the hidden ones", function(done) {
        loadFixtures('myfixture2.html');

        expect($('img#img1').attr("data-src")).toBeTruthy();
        expect($('img#img2').attr("data-src")).toBeTruthy();
        expect($('img#img3').attr("data-src")).toBeTruthy();

        $('#container').css('visibility', 'hidden');

        $('#container img').jail({
            loadHiddenImages: true
        });
        $('html, body').animate({
            scrollTop: $("#img2").offset().top
        }, 10);

        setTimeout(function() {
            expect($('img#img2').attr("src")).toMatch(/sample2.jpg/);
            expect($('img#img2').attr("data-src")).toBeFalsy();
            done();
        }, 1000);
    });
});
