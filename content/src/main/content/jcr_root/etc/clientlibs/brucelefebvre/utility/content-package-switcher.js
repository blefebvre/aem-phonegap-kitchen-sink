window.kitchenSink = window.kitchenSink || {};

/**
 * Functional constructor for CQ.mobile.contentInit. Assumes `deviceready` 
 * event has already fired.
 */
kitchenSink.contentPackageSwitcher = function(spec) {

    'use strict';

    var usePackage = function() {
    	alert('switching to: ' + spec.name);
    }

    return {
    	usePackage: usePackage
    }
};