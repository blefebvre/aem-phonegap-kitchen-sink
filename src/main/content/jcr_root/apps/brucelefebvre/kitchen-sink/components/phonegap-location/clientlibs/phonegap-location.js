;(function (angular, document, undefined) {

    angular.module('phonegapLocation', ['btford.phonegap.geolocation'])
        .controller('LocationCtrl', ['$scope', 'geolocation', function($scope, geolocation) {
            function geolocationSuccess(position) {
                $scope.latitude = position.coords.latitude;
                $scope.longitude = position.coords.longitude;
                console.log('[phonegapLocation] current device lat: [' + $scope.latitude + '] long: [' + $scope.longitude + ']');
                $scope.foundLocation = true;
            }

            function geolocationError(error) {
                alert('Location error. Code: ' + error.code + '\n' +
                    'Message: ' + error.message + '\n');
            }

            geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
        }]);

}(angular, document));