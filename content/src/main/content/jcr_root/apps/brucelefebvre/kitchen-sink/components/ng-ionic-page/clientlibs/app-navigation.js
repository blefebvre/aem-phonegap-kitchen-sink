;(function (angular, undefined) {

    "use strict";

    /**
     * Module to handle general navigation in the app
     */
    angular.module('cqAppNavigation', ['cqContentSyncUpdate'])
        .controller('AppNavigationController', ['$scope', '$window', '$location', 'cqContentSyncUpdate',
            function ($scope, $window, $location, cqContentSyncUpdate) {
                $scope.transition = '';

                /**
                 * Handle back button
                 */
                $scope.back = function() {
                    $scope.transition = 'transition-right';
                    $window.history.back();
                    console.log('[nav] handled back event.');
                };

                /**
                 * Handle navigation to app pages
                 */
                $scope.go = function(path){
                    if ($scope.wcmMode) {
                        // WCMMode is not disabled; head to the page itself
                        navigateToPageInAuthorMode(path);
                    }
                    else {
                        navigateToPageInApp(path);
                    }

                    console.log('[nav] app navigated to: [' + path + '].');
                };

                /**
                 * Handle navigation to library items
                 */
                $scope.goLibraryItem = function( templatePath, skuPrefix, productName ) {
					if( $scope.wcmMode ) {
						// WCMMode is not disabled; head to the product page itself
						navigateToPageInAuthorMode( getFullLibraryPagePath( templatePath, skuPrefix, productName ) );
					}
					else {
						navigateToPageInApp( templatePath + '/' + skuPrefix + '/' + productName );
					}

					console.log( '[nav] app navigated to product: [' + skuPrefix + '].' );
				};


                /**
                 * Toggle the menu
                 */
                $scope.toggleMenu = function() {
                    $scope.navigationMenuStatus = !$scope.navigationMenuStatus;
                };

                /**
                 * Trigger an app update
                 */
                $scope.updateApp = function() {
                    try{
                        cqContentSyncUpdate.fetchAndApplyDeltaUpdate();
                    }catch(err){
                        console.log('Update Failed: ' + err);
                    }
                };

                /*
                 * Private helpers
                 */
                function navigateToPageInAuthorMode(path) {
                    $window.location.href = path + '.html';
                }

                function navigateToPageInApp(path) {
                    // SPA hash navigation
                    $scope.transition = 'transition-left';
                    $location.url(path);
                    $scope.navigationMenuStatus = false;
                }

				function getFullLibraryPagePath( base, skuPrefix, name ) {
					return base + '/' + skuPrefix + '/' + name;
				}
            }
        ]);
})(angular);