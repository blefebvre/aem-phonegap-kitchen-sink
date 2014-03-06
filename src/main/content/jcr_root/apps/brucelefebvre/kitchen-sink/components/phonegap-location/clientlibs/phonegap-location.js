;(function (angular, document, undefined) {

    angular.module('phonegapLocation', ['btford.phonegap.ready'])
        .directive('phonegapLocation', ['$http', 'phonegapReady', function ($http, phonegapReady) {
            function link(scope, element, attrs) {

                function geolocationSuccess(position) {
                    scope.latitude = position.coords.latitude;
                    scope.longitude = position.coords.longitude;
                    console.log('[phonegapLocation] current device lat: [' + scope.latitude + '] long: [' + scope.longitude + ']');
                    scope.foundLocation = true;
                    scope.$apply();
                }

                function geolocationError(error) {
                    alert('Location error. Code: '    + error.code    + '\n' +
                        'Message: ' + error.message + '\n');
                }

                navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, {
                    maximumAge: 10000,
                    timeout: 15000,
                    enableHighAccuracy: true
                });
            }


            return {
                link: phonegapReady(link)
            };
        }]);

}(angular, document));