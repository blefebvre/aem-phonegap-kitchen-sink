window.kitchenSink = window.kitchenSink || {};

(function(contentUtils, contentUpdate, undefined) {

    /**
     * Functional constructor for kitchenSink.contentPackageSwitcher. Assumes 
     * `deviceready` event has already fired.
     */
    kitchenSink.contentPackageSwitcher = function(spec) {

        'use strict';

        var contentPackageName = spec.name;
        var id = spec.id;

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
            
            // Absolute path to the requested content package root file
            var contentPackageRootAbsoluteUrl = contentUtils.getPathToWWWDir(window.location.href) +
                    contentPackDetails.path.substring(1) + '.html';

            isContentPackageAlreadyInstalled(contentPackageRootAbsoluteUrl, function(result) {

                // Truthy result indicates that the contentn package is already installed
                if (result) {
                    // Switch to the content package
                    redirectTo(contentPackageRootAbsoluteUrl);
                    // TODO: check for an update, either before or after switching. 
                }
                else {
                    // Set timestamp to 0 and request package from the server
                    contentPackDetails.timestamp = 0;
                    contentUtils.storeContentPackageDetails(contentPackageName, contentPackDetails);
                    
                    // Fetch and install the requested content package 
                    var contentUpdater = contentUpdate({
                        id: id
                    });
                    contentUpdater.updateContentPackageByName(contentPackageName, 
                        function(error, packageRootUrl) {
                            if (error) {
                                return console.error(error);
                            }

                            // Success. Redirect to the new content package root
                            console.log('Successfully installed content package: [' + contentPackageName + 
                                    ']. Redirecting to: [' + contentPackageRootAbsoluteUrl + ']');
                             
                            // Redirect to the new content package
                            redirectTo(contentPackageRootAbsoluteUrl);
                        }
                    );
                }
            });

        }

        /* Private helpers */
        var redirectTo = function(absoluteUrl) {
            window.location.href = absoluteUrl;
        }
        
        var isContentPackageAlreadyInstalled = function(pathToHtmlContent, callback) {
            console.log('[contentPackageSwitcher] looking for existing content at: [' + pathToHtmlContent + ']' );
            
            window.resolveLocalFileSystemURL(pathToHtmlContent,
                function success(packageRootFile) {
                    console.log('[contentPackageSwitcher] package [' + contentPackageName + '] ' +
                            'root detected: package is already installed.');
                    callback(true);
                },
                function fail(error) {
                    console.log('[contentPackageSwitcher] package [' + contentPackageName + '] ' + 
                            'is NOT already installed.');
                    callback(false);
                }
            );
        };

        return {
            usePackage: usePackage
        }
    };

})(CQ.mobile.contentUtils, CQ.mobile.contentUpdate);