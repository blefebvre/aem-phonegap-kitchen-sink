;(function (angular, document, undefined) {

    angular.module('phonegapCompass', ['brucelefebvre.phonegap.geolocation'])
        .controller('CompassCtrl', ['$scope', '$timeout', 'compass', function ($scope, $timeout, compass) {
            $scope.heading = 0;
            $scope.magneticHeading = 0;
            $scope.lastMagneticHeading = 0;
            $scope.headingChange = 0;
            
            var timer;
            // Update compass at most every .1 seconds. Match this to the transition duration in the SVG.
            var frequency = 100;

            function onCompassSuccess(heading) {
                // we need the heading to wrap over 360 or under 0 (because we can't smoothly animate between 359deg and 0deg), 
                // so we'll always monitor the change
                $scope.headingChange = heading.magneticHeading - $scope.lastMagneticHeading;
                
                // find the shortest path
                if($scope.headingChange > 180) {
                    $scope.headingChange -= 360;
                }
                else if($scope.headingChange < -180) {
                    $scope.headingChange += 360;
                }
                $scope.heading -= $scope.headingChange;
                $scope.magneticHeading = heading.magneticHeading;
                $scope.lastMagneticHeading = heading.magneticHeading;

                // Ping the compass again
                queryCompass();
            }

            function onCompassError(error) {
                if (timer) {
                    console.log('stopping compass refresh');
                    $timeout.cancel(timer);
                }
                alert('Compass error. Code: ' + error.code);
            }

            function queryCompass() {
                timer = $timeout(function() {
                    compass.getCurrentHeading(onCompassSuccess, onCompassError);
                }, frequency);
            }

            // Start watching compass
            if (navigator.compass) {
                queryCompass();
            }

            // Stop watching when view changes
            $scope.$on('$destroy', function() {
                if (timer) {
                    $timeout.cancel(timer);
                }
            });
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