module("Asynch Loading Images");
 
test ('iPhoneRedirection()', function() {
window.TEST.mockDocument.location.host = "domain.com";
window.TEST.config.param = "";
SA.redirection_mobile(window.TEST.mockDocument, window.TEST, window.TEST.mockIphoneNavigator, window.TEST.config);
ok (window.TEST.mockDocument.location.href === "http://m.domain.com", "Redirection for iPhone not happening");
})

