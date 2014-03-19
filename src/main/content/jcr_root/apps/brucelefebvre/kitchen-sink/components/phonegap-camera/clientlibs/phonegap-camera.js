;(function (angular, document, undefined) {

    angular.module('phonegapCamera', ['brucelefebvre.phonegap.camera'])
        .controller('CameraCtrl', ['$scope', 'camera', function($scope, camera) {
        	function gotPicture(imageData) {
			    $scope.imageSrc = "data:image/jpeg;base64," + imageData;
			}

			function cameraError(message) {
			    alert('Failed with error: ' + message);
			}

            $scope.takeAPicture = function() {
				camera.getPicture(gotPicture, cameraError, {
					quality: 50,
    				destinationType: Camera.DestinationType.DATA_URL
				});
            };

            $scope.browseForAPicture = function() {
				alert("browse!");
            };
        }]);

}(angular, document));