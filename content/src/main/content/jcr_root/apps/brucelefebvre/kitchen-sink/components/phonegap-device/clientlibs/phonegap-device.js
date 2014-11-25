;(function (angular, window, undefined) {

    angular.module('phonegapDevice', ['btford.phonegap.ready'])
        .controller('DeviceCtrl', ['$scope', 'phonegapReady', 
            function ($scope, phonegapReady) {

                var getDeviceData = phonegapReady(function() {
                    $scope.device = window.device;
                });
                
                getDeviceData();
            }
        ]);

}(angular, window));