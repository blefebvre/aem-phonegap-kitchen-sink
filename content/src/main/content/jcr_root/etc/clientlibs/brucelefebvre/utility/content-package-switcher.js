window.kitchenSink = window.kitchenSink || {};

(function(contentUtils, contentUpdate, undefined) {

    /**
     * Functional constructor for kitchenSink.contentPackageSwitcher. Assumes 
     * `deviceready` event has already fired.
     */
    kitchenSink.contentPackageSwitcher = function(spec) {

        'use strict';

        var contentPackageName = spec.name;

        /**
         *
         */
        var usePackage = function() {
            console.log('[contentPackageSwitcher] switching to: ' + contentPackageName);

            // Check to see if the requested content package is already installed

            // If it is:
            // - Load the content path specified by it's 
            //   cq.mobile.contentPackage.<packName> entry.

            // If it is not: 
            // - Set it's cq.mobile.contentPackage.<packName> timestamp to 0
            // - request this pack's zip content, specified by it's updatePath
            //   property
            // - once complete, load the new content

            var contentPackDetails = contentUtils.getContentPackageDetailsByName(contentPackageName);

            isContentPackageAlreadyInstalled(contentPackDetails.path + '.html', function(error, result) {
                if (error) {
                    // Something went wrong
                    console.error('[contentPackageSwitcher] error requesting content') 
                }

                // Truthy result indicates that the contentn package is already installed
                if (result) {
                    // Switch to the content package
                }
                else {
                    // Set timestamp to 0 and request package from the server
                }
            });

        }

        /* Private helpers */
        var isContentPackageAlreadyInstalled = function(pathToHtmlContent, callback) {
            var checkForContentPackageRoot = function(wwwDirectoryEntry) {
                wwwDirectoryEntry.getFile(pathToHtmlContent, {create: false}, 
                    function success(packageRootFile) {
                        console.log('[contentPackageSwitcher] package [' + contentPackageName + '] ' +
                                'root detected: package is already installed.');
                        callback(null, packageRootFile);
                    },
                    function fail(error) {
                        console.log('[contentPackageSwitcher] package [' + contentPackageName + '] ' + 
                                'is NOT already installed.');
                        callback(null);
                    }
                );
            };

            console.log('[contentPackageSwitcher] looking for existing content at: [' + pathToHtmlContent + ']' );
            CQ.mobile.contentUtils.requestFileSystemRoot(function(error, fileSystemRoot) {
                if (error) {
                    return callback(error);
                }

                fileSystemRoot.getDirectory('www', {create: false}, 
                    function success(wwwDir) {
                        checkForContentPackageRoot(wwwDir);
                    },
                    // Callback will be invoked on error
                    callback
                );
            });
        };

        return {
            usePackage: usePackage
        }
    };

})(CQ.mobile.contentUtils, CQ.mobile.contentUpdate);