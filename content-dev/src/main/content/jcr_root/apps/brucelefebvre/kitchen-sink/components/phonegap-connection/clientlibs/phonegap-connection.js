;(function (angular, window, undefined) {

    angular.module('phonegapConnection', ['btford.phonegap.ready'])
        .controller('ConnectionCtrl', ['$scope', '$interval', 'phonegapReady', function ($scope, $interval, phonegapReady) {
            var timerPromise;
            var frequency = 500;
            
            var queryConnection = phonegapReady(function() {
                var states = {};
                states[Connection.UNKNOWN]  = 'Unknown connection';
                states[Connection.ETHERNET] = 'Ethernet connection';
                states[Connection.WIFI]     = 'WiFi connection';
                states[Connection.CELL_2G]  = 'Cell 2G connection';
                states[Connection.CELL_3G]  = 'Cell 3G connection';
                states[Connection.CELL_4G]  = 'Cell 4G connection';
                states[Connection.CELL]     = 'Cell generic connection';
                states[Connection.NONE]     = 'No network connection';
                
                var networkState = navigator.connection.type;
                console.log('network state: [' + states[networkState] + ']');
                $scope.connectionType = states[networkState];
            });
            
            if (window.navigator && navigator.connection) {
                timerPromise = $interval(queryConnection, frequency);
            }
            
            // Stop watching when view changes
            $scope.$on('$destroy', function() {
                if (timerPromise) {
                    $interval.cancel(timerPromise);
                }
            });
        }]);

}(angular, window));