;(function (angular, contentUpdate, contentPackageSwitcher, undefined) {

    'use strict';

    /**
     * Module to handle general navigation in the app
     */
    angular.module( 'cqAppNavigation', ['ionic', 'btford.phonegap.ready'] )

        .controller( 'AppNavigationController', ['$scope', '$window', '$location', '$timeout', 'phonegapReady', '$rootElement', '$ionicSideMenuDelegate', '$ionicTabsDelegate',
            function( $scope, $window, $location, $timeout, phonegapReady, $rootElement, $ionicSideMenuDelegate, $ionicTabsDelegate) {

                $scope.updating = false;

                // Request headers for Content Sync
                var reqHeaderObject = {
                    // Basic auth example:
                    //Authorization: "Basic " + btoa("username:password")
                };

                // Use app name as ContentSync package ID
                var appName = $rootElement.attr('ng-app');
                var contentUpdater = contentUpdate({
                    id: appName,
                    requestHeaders: reqHeaderObject,
                    // Indicate that self-signed certificates should be trusted
                    // should be set to `false` in production.
                    trustAllHosts: false
                });

                // Counter to indicate how far we've travelled from the root of the app
                var numberOfPagesFromRoot = 0;
                $scope.atRootPage = true;

                // Page dimensions for consistent transitions
                var headerHeight = 44;
                var footerHeight = 0;

                // Add 20px when iOS is detected
                if (/iPad|iPhone|iPod/.test(navigator.platform)) {
                    headerHeight += 20;
                }

                // Page transition constants
                var pageTransitions = {
                    direction: {
                        right:  'right',
                        left:   'left',
                        up:     'up',
                        down:   'down',
                        none:   'none'
                    },
                    effect: {
                        slide: function(){
                            // NOOP
                        },
                        flip: function(){
                            // NOOP
                        }
                    }
                };

                // Initialize pageTransition effect options once deviceready has fired
                var initializeTransitions = phonegapReady(function() {
                    if (($scope.wcmMode === false) &&
                            (window.plugins && window.plugins.nativepagetransitions)) {
                        pageTransitions.effect = {
                            slide: window.plugins.nativepagetransitions.slide.bind(window.plugins.nativepagetransitions),
                            flip: window.plugins.nativepagetransitions.flip.bind(window.plugins.nativepagetransitions)
                        }
                    }
                });
                initializeTransitions();

                // Make platform available to $scope for setting tab spacing on Android
                $scope.platform = ionic.Platform;

                /**
                 * Handle back button
                 */
                $scope.back = function() {
                    numberOfPagesFromRoot--;
                    navigateBack( pageTransitions.effect.slide, pageTransitions.direction.right );

                    console.log( '[nav] handled back event.' );
                };

                /**
                 * Handle navigation to app pages
                 */
                $scope.go = function( path, trackingTitle, transitionDirection ) {
                    numberOfPagesFromRoot++;
                    $scope.atRootPage = false;
                    transitionDirection = transitionDirection || pageTransitions.direction.left;
                    navigateToPage( path, trackingTitle,
                            pageTransitions.effect.slide, transitionDirection );
                    console.log( '[nav] app navigated to: [' + (trackingTitle || path) + '].' );
                };


                /**
                 * Handle navigation to library items
                 */
                $scope.goLibraryItem = function( templatePath, skuPrefix, productName ) {
                    numberOfPagesFromRoot++;
                    if($scope.wcmMode || !window.plugins) {
                        // WCMMode is not disabled; head to the product page itself
                        navigateToPage( getFullLibraryPagePath( templatePath, skuPrefix, productName ), productName );
                    }
                    else {
                        navigateToPage( templatePath + '/' + skuPrefix + '/' + productName, productName,
                            pageTransitions.effect.slide,
                            pageTransitions.direction.left );
                    }

                    console.log( '[nav] app navigated to library item: [' + productName + '].' );
                };

                /**
                 * Handle navigation to another tab, with no transition
                 */
                $scope.goTab = function( path, trackingTitle, tabId ) {
                    numberOfPagesFromRoot = 0;
                    $scope.atRootPage = true;
                    navigateToPage( path, trackingTitle,
                            pageTransitions.effect.slide, pageTransitions.direction.none );
                    console.log( '[nav] app navigated to tab: [' + (trackingTitle || path) + '].' );
                    if (tabId) {
                        $scope.selectedTab = tabId;
                        $timeout(function () {
                            $ionicTabsDelegate.select(tabId);
                        }, 20);
                    }
                };

                /**
                 * Toggle the left flyout menu
                 */
                $scope.toggleMenu = function() {
                    $ionicSideMenuDelegate.toggleLeft();
                };

                /**
                 * Handle navigation from menu items to pages in the app
                 */
                $scope.goMenuItem = function( path, trackingTitle ) {
                    numberOfPagesFromRoot++;
                    $scope.atRootPage = false;
                    // Navigate to the given path with a fixed header & footer size of 0
                    navigateToPage( path, trackingTitle,
                            pageTransitions.effect.slide, pageTransitions.direction.left, 0, 0 );
                    console.log( '[nav] app navigated to menu item: [' + (trackingTitle || path) + '].' );
                };

                /**
                 * Trigger an app update
                 */
                $scope.updateApp = function() {
                    // don't start updating again if we're already updating.
                    if($scope.updating) return;

                    // Check if an update is available
                    contentUpdater.isContentPackageUpdateAvailable($scope.contentPackageName,
                        function callback(error, isUpdateAvailable) {
                            if (error) {
                                // Alert the error details.
                                return navigator.notification.alert(error, null, 'Content Update Error');
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
                                    'Content Update',       // title
                                    ['Update', 'Later'] // button labels
                                );
                            }
                            else {
                                navigator.notification.alert('App is up to date.', null, 'Content Update', 'Done');
                            }
                        }
                    );
                };

                /**
                 * Switch to an alternate content package
                 */
                $scope.switchContentPackage = function(packageName) {
                    var spec = {
                        id: appName, 
                        name: packageName
                    };
                    var switcher = contentPackageSwitcher(spec);
                    switcher.usePackage();
                };
                
                function navigateToPage( path, trackingTitle, transition, transitionDirection, 
                        fixedHeaderHeight, fixedFooterHeight) {

                    if( $scope.wcmMode ) {
                        // WCMMode is enabled; head to the page itself
                        $window.location.href = path + '.html';
                    }
                    else {
                        if (window.ADB) {
                            // Track using trackingTitle, falling back to path if unavailable
                            ADB.trackState(trackingTitle || path, {});
                        }

                        // Set to default values if parameters are undefined (0 is OK)
                        if (fixedHeaderHeight === undefined) {
                            fixedHeaderHeight = headerHeight;
                        }
                        if (fixedFooterHeight === undefined) {
                            fixedFooterHeight = footerHeight;
                        }

                        // Configure transition options
                        var transitionConfig = {
                            // Change $location below after a brief $timeout
                            'href': null,
                            'direction': transitionDirection
                        };

                        // Set the fixed pixels properties *only* if they are > 0
                        if (fixedHeaderHeight > 0) {
                            transitionConfig.fixedPixelsTop = fixedHeaderHeight;
                        }
                        if (fixedFooterHeight > 0) {
                            transitionConfig.fixedPixelsBottom = fixedFooterHeight;
                        }

                        if (transition && (transitionDirection !== pageTransitions.direction.none)) {
                            // Invoke transition
                            transition(
                                transitionConfig,
                                function success(msg) {
                                    // NOOP
                                },
                                function error(msg) {
                                    console.error('[native transitions][ERROR] msg: ' + msg);
                                }
                            );
                        }

                        // Manually change the $location
                        $timeout(function () {
                            $location.url(path);
                            $scope.navigationMenuStatus = false;
                        }, 10);
                    }
                }

                function navigateBack(transition, transitionDirection) {
                    if( $scope.wcmMode ) {
                        $window.history.back();
                    }
                    else {
                        if (numberOfPagesFromRoot < 0) {
                            // Don't allow user to navigate further back than the first page
                            return;
                        }

                        transition(
                            {
                                'direction': transitionDirection,
                                // Change $location below after a brief $timeout
                                'href': null,
                                'fixedPixelsTop': headerHeight,
                                'fixedPixelsBottom': footerHeight
                            },
                            function success(msg) {
                                // NOOP
                            },
                            function error(msg) {
                                console.error('[native transitions][ERROR] msg: ' + msg);
                            }
                        );

                        $scope.navigationMenuStatus = false;

                        $timeout(function() {
                            $window.history.back();
                            if (numberOfPagesFromRoot === 0) {
                                $scope.atRootPage = true;
                            }
                        }, 10);
                    }
                }

                function getFullLibraryPagePath( base, skuPrefix, name ) {
                    return base + '/' + skuPrefix + '/' + name;
                }
            }
        ]
    );
})(angular, CQ.mobile.contentUpdate, kitchenSink.contentPackageSwitcher);