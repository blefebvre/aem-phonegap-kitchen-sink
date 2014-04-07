;(function(CQ, document, undefined) {

    // iOS 7 status bar shim to prevent content from flowing beneath the transparent status bar
    if(navigator.userAgent.match(/iPhone OS 7/)) {
        document.body.className = document.body.className + ' ios7';
    }
})(CQ, document);