;(function (angular, document, undefined) {

    angular.module('phonegapCompass', ['btford.phonegap.ready'])
        .directive('phonegapCompass', ['$http', 'phonegapReady', function ($http, phonegapReady) {
            function link(scope, element, attrs) {
                // The watch id references the current `watchHeading`
                var watchID = null;

                function onCompassSuccess(heading) {
                    scope.heading = heading.magneticHeading;
                    scope.$apply();
                }

                function onCompassError(error) {
                    if (watchID) {
                        navigator.compass.clearWatch(watchID);
                        watchID = null;
                    }
                    alert('Compass error. Code: ' + error.code);
                }

                // Update compass every .25 seconds
                var options = { frequency: 250 };
                // Start watching compass
                watchID = navigator.compass.watchHeading(onCompassSuccess, onCompassError, options);
            }


            return {
                link: phonegapReady(link)
            };
        }]);

}(angular, document));