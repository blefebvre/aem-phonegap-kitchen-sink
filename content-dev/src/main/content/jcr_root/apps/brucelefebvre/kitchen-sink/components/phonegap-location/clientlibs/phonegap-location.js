;(function (angular, document, undefined) {

    angular.module('phonegapLocation', ['btford.phonegap.geolocation'])
        .controller('LocationCtrl', ['$scope', 'geolocation', function($scope, geolocation) {
            function geolocationSuccess(position) {
                $scope.latitude = position.coords.latitude;
                $scope.longitude = position.coords.longitude;
                console.log('[phonegapLocation] current device lat: [' + $scope.latitude + '] long: [' + $scope.longitude + ']');

                // Show a static Google Maps image of the device's current location
                $scope.mapImageSrc = 'https://maps.googleapis.com/maps/api/staticmap?center=' + $scope.latitude + ',' + $scope.longitude + 
                    '&markers=' + $scope.latitude + ',' + $scope.longitude +
                    '&size=640x640&sensor=true';
            }

            function geolocationError(error) {
                console.error('Location error. Code: ' + error.code + '\n' +
                    'Message: ' + error.message + '\n');
            }

            geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
        }]);

}(angular, document));