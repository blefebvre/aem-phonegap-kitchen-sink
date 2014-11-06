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
;(function (angular, undefined) {

    "use strict";

    /**
     * Module to handle general navigation in the app
     */
    angular.module('cqAppNavigation', ['cqContentSyncUpdate'])
        .controller('AppNavigationController', ['$scope', '$window', '$location', '$timeout', 'cqContentSyncUpdate',
            function ($scope, $window, $location, $timeout, cqContentSyncUpdate) {
                $scope.transition = '';

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
                    // TODO
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
})(angular);