/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2013 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 **************************************************************************/
;(function (angular, contentUpdate, contentPackageSwitcher, undefined) {

    "use strict";

    /**
     * Module to handle general navigation in the app
     */
    angular.module('cqAppNavigation', [])
        .controller('AppNavigationController', ['$scope', '$window', '$location', '$timeout',
            function ($scope, $window, $location, $timeout) {
                $scope.transition = '';
                var contentUpdater = contentUpdate();

                /**
                 * Handle back button
                 */
                $scope.back = function() {
                    if ($scope.wcmMode || !window.plugins) {
                        navigateBackInAuthorMode();
                    }
                    else {
                        navigateBackInApp();
                    }
                    console.log('[nav] handled back event.');
                };

                /**
                 * Handle navigation to app pages
                 */
                $scope.go = function(path){
                    if (window.ADB){
                        ADB.trackState(path, {});
                    }

                    if ($scope.wcmMode || !window.plugins) {
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
                    if($scope.wcmMode || !window.plugins) {
                        // WCMMode is not disabled; head to the product page itself
                        navigateToPageInAuthorMode( getFullLibraryPagePath( templatePath, skuPrefix, productName ) );
                    }
                    else {
                        navigateToPageInApp( templatePath + '/' + skuPrefix + '/' + productName );
                    }

                    console.log( '[nav] app navigated to library item: [' + productName + '].' );
                }

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
                    // If update is in progress, NOOP
                    if($scope.updating) return;

                    // Check if an update is available
                    contentUpdater.isContentPackageUpdateAvailable($scope.contentPackageName,
                        function callback(error, isUpdateAvailable) {
                            if (error) {
                                // Alert the error details.
                                return navigator.notification.alert(error, null, 'ContentSync Error');
                            }

                            if (isUpdateAvailable) {
                                // Confirm if the user would like to update now 
                                navigator.notification.confirm('Update is available, would you like to install it now?', 
                                    function onConfirm(buttonIndex) {
                                        if (buttonIndex == 1) {
                                            // user selected 'Update'                                           
                                            $scope.updating = true;
                                            contentUpdater.updateContentPackageByName($scope.contentPackageName,
                                                function callback(error, pathToContent) {
                                                    if (error) {
                                                        return navigator.notification.alert(error, null, 'Error');
                                                    }
                                                    // else 
                                                    console.log('Update complete; reloading app.');
                                                    window.location.reload( true );
                                                });
                                        }
                                        else {
                                            // user selected Later
                                            // no-op
                                        }
                                    }, 
                                    'ContentSync Update',       // title
                                    ['Update', 'Later'] // button labels
                                );
                            }
                            else {
                                navigator.notification.alert('App is up to date.', null, 'ContentSync Update', 'Done');
                            }
                        }
                    );
                };

                /**
                 * Switch to an alternate content package
                 */
                $scope.switchContentPackage = function(name) {
                    var spec = {name: name};
                    var switcher = contentPackageSwitcher(spec);
                    switcher.usePackage();
                };

                /**
                 * Handle navigation to product pages
                 */
                $scope.goProduct = function(templatePath, sku){
                    if ($scope.wcmMode || !window.plugins) {
                        // WCMMode is not disabled; head to the product page itself
                        navigateToPageInAuthorMode(getFullProductPagePath(templatePath, sku));
                    }
                    else {
                        navigateToPageInApp(templatePath + '/' + sku);
                    }

                    console.log('[nav] app navigated to product: [' + sku + '].');
                };


                /*
                 * Private helpers
                 */
                function navigateToPageInAuthorMode(path) {
                    $window.location.href = path + '.html';
                }

                function navigateBackInAuthorMode() {
                    $window.history.back();
                }

                function navigateToPageInApp(path) {
                    // SPA hash navigation
                    $scope.navigationMenuStatus = false;
                    window.plugins.nativepagetransitions.slide({
                        //'href': '#' + path  // Does not function with AngularJS routing
                        'href': null,
                    },
                    function success(msg) {
                        // NOOP
                    },
                    function error(msg) {
                        console.error('[native transitions][ERROR] msg: ' + msg);
                    });

                    // Manually change the URL
                    $timeout(function() {
                        $location.url(path)
                    }, 10);
                }

                function navigateBackInApp() {
                    $scope.navigationMenuStatus = false;
                    window.plugins.nativepagetransitions.slide({
                        'href': null,
                        'direction': 'right'
                    },
                    function success(msg) {
                        // NOOP
                    },
                    function error(msg) {
                        console.error('[native transitions][ERROR] msg: ' + msg);
                    });
                    
                    $timeout(function() {
                        $window.history.back();
                    }, 10);
                }

                function getFullLibraryPagePath( base, skuPrefix, name ) {
                    return base + '/' + skuPrefix + '/' + name;
                }
            }
        ]);
})(angular, CQ.mobile.contentUpdate, kitchenSink.contentPackageSwitcher);