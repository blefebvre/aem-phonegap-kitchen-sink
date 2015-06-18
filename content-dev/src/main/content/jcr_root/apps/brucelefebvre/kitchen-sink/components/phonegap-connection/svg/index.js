angular.module("ConnectionApp", [])
	.controller("ConnectionCtrl", function ($scope) {
		console.log("ConnectionCtrl", $scope.deviceReady);

		$scope.connection = "unknown";

		var states = {};
		states["unknown"] = 'Unknown connection';

		if ($scope.deviceReady) {
			$scope.connection = navigator.connection.type;
			states[Connection.ETHERNET] = 'Ethernet connection';
			states[Connection.WIFI] = 'WiFi connection';
			states[Connection.CELL_2G] = 'Cell 2G connection';
			states[Connection.CELL_3G] = 'Cell 3G connection';
			states[Connection.CELL_4G] = 'Cell 4G connection';
			states[Connection.CELL] = 'Cell generic connection';
			states[Connection.NONE] = 'No network connection';
		}

		$scope.connectionLabel = states[$scope.connection];
	})
	.run(function ($rootScope) {
		$rootScope.deviceReady = false;

		$rootScope.isIOS7 = navigator.userAgent.match(/iP(ad|hone|od).*OS 7/);

		document.addEventListener("deviceready", function () {
			$rootScope.deviceReady = true;

			$rootSCope.$apply();
		});
	});