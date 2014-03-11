;(function (angular, document, undefined) {

    angular.module('phonegapCompass', ['btford.phonegap.ready'])
        .directive('phonegapCompass', ['$http', 'phonegapReady', function ($http, phonegapReady) {
            function link(scope, element, attrs) {
                // The watch id references the current `watchHeading`
                var watchID = null;
				
				scope.heading = 0;
				scope.lastMagneticHeading = 0;
				scope.headingChange = 0;

                function onCompassSuccess(heading) {
					console.log(heading);
					// we need the heading to wrap over 360 or under 0 (because we can't smoothly animate between 359deg and 0deg), 
					// so we'll always monitor the change
					scope.headingChange = heading.magneticHeading - scope.lastMagneticHeading;
                    scope.heading -= scope.headingChange;
					scope.lastMagneticHeading = heading.magneticHeading;
                    scope.$apply();
                }

                function onCompassError(error) {
                    if (watchID) {
                        navigator.compass.clearWatch(watchID);
                        watchID = null;
                    }
                    alert('Compass error. Code: ' + error.code);
                }

                // Update compass every .25 seconds, match this to the transition duration in the SVG.
                var options = { frequency: 250 };
                // Start watching compass
                watchID = navigator.compass.watchHeading(onCompassSuccess, onCompassError, options);
            }


            return {
                link: phonegapReady(link)
            };
        }])
	
		/* inline SVG's with a dynamic width like to keep a static height, so we need to manually resize them when their width changes */
		.directive( "svg", ["$window", function ( $window ) {
			return {
				restrict: "E",
				transclude: false,
				controller: ["$scope", "$element", function ( $scope, $element ) {
					console.log("running svg directive controller");
					$scope.lastHeight = undefined;

					// If the window resizes, check to see if we need to resize the svg.
					// If there's already an onresize handler, make sure that it doesn't get lost.
					var origResize = $window.onresize;
					$window.onresize = function () {
						$scope.resizeSvg();

						if(typeof origResize === "function") {
							origResize.apply($window, arguments);
						}
					};

					// The SVG has an aspect ratio represented by the viewBox="x y w h", find it's width, then set its height.
					// If the height is the same, don't change it, or the browser will re-paint, which can strain performance
					// unnecessarily.
					$scope.resizeSvg = function () {
						var svg = $element,
							aspect = svg.attr("viewBox").split(" "),
							h = Math.round(aspect[2] / aspect[3] * svg[0].offsetWidth) + "px";

							 console.log("svg is", svg);
							 console.log("aspect is ", aspect);
							console.log("height should be ", h);

						// make sure we don't force another draw if the values are the same.
						if ( h == $scope.lastHeight ) return;
						
							 console.log("updating svg height to " + h);


						svg.css( "height", h );
						$scope.lastHeight = h;
					};
					
					$scope.resizeSvg();
				}]
			};
		}] );

}(angular, document));