;(function (angular, document, undefined) {

    angular.module('phonegapCamera', ['btford.phonegap.ready'])
        .controller('CameraCtrl', ['$scope', 'geolocation', function($scope, geolocation) {
            alert('what up');
        }]);

}(angular, document));