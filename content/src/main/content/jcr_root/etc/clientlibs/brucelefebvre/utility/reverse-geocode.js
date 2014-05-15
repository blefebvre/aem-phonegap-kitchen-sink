;(function (angular, undefined) {

    "use strict";

    /**
     * Reverse geocode - determine location details based on coordinates
     */
    angular.module('brucelefebvre.reverse-geocode', [])
        .factory('loadGoogleMapsAPI', ['$q',
            function($q) {
                var apiAlreadyLoaded = false;
                return function() {
                    var remoteAPIDeferred = $q.defer();

                    if (apiAlreadyLoaded) {
                        remoteAPIDeferred.resolve();
                        return remoteAPIDeferred.promise;
                    }

                    var googleAPILoaded = function() {
                        apiAlreadyLoaded = true;
                        console.log('[reverseGeocode] maps API loaded.');
                        remoteAPIDeferred.resolve();
                    };

                    // Expose `googleAPILoaded()` globally 
                    var mapsAPILoadedCallbackName = 'google_maps_loaded_cb';
                    window[mapsAPILoadedCallbackName] = googleAPILoaded;

                    // Load Google maps API
                    var script = document.createElement('script');
                    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&' + 
                        'callback=' + mapsAPILoadedCallbackName;
                    document.body.appendChild(script);

                    return remoteAPIDeferred.promise;
                };
            }]
        )
        .factory('reverseGeocodeCity', ['$q', 'loadGoogleMapsAPI',
            function reverseGeocodeFactory($q, loadGoogleMapsAPI) {

                return function(latitude, longitude) {
                    var deferred = $q.defer();
                    // Proceed once the remote API has been loaded
                    loadGoogleMapsAPI().then(function() {
                        var geocoder = new google.maps.Geocoder();
                        var latlng = new google.maps.LatLng(latitude, longitude);

                        geocoder.geocode({'latLng': latlng}, function(results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                if (results[0]) {
                                    var result = results[0];
                                    for(var i=0, len=result.address_components.length; i<len; i++) {
                                        var ac = result.address_components[i];
                                        if(ac.types.indexOf("locality") >= 0) {
                                            // TODO: test with non North American coordinates
                                            deferred.resolve(ac.long_name);
                                        }
                                    }
                                } 
                                else {
                                    console.log('[reverseGeocode] No results found');
                                }
                            } 
                            else {
                                console.log('[reverseGeocode] Geocoder failed due to: ' + status);
                            }
                        });
                    });
                    return deferred.promise;
                };
            }
        ]);
        
})(angular);