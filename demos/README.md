Demo instructions
=================

What follows are a few dev scenarios which can be used to demonstrate various features of this sample.


Rollout changes to library items
--------------------------------

- Upload updated .csv
    - In the AEM [Products console](http://localhost:4502/aem/products.html/etc/commerce/products/kitchen_sink), click upload
    - Select [kitchen-sink-books-update.csv](blob/master/content/src/main/content/jcr_root/etc/commerce/products/kitchen-sink-books-update.csv) and click next
    - 1 product should be updated. Click Done when complete

- Activate products
    - From the [Products console](http://localhost:4502/aem/products.html/etc/commerce/products/kitchen_sink), navigate into the 'bl' folder
    - select the 'blbk' folder and publish it
    - Click the Publish button on the Assets view to continue

- Rollout changes
    - From the [Catalogs console](http://localhost:4502/aem/catalogs.html/content/catalogs/kitchen-sink), select 'Base Catalog' and click 'Rollout Changes'
    - Click 'Rollout Changes' button to complete the rollout

- Activate app
    - From the [Apps console](http://localhost:4502/aem/apps.html/content/phonegap/brucelefebvre/apps/kitchen-sink), select the 'English' page and click 'Activate All App Pages'

- Content sync update
    - on Publish (you must be logged in via crx/de) [content sync console](http://localhost:4503/libs/cq/contentsync/content/console.html), click 'Update Cache'

- On the app, open up the menu and tap 'Update'
    - the Design Patterns library item should have an updated title (or any other updates you specified in the updated .csv)


Building the camera component
-----------------------------

- Component: copy from location
    - change name to `phonegap-camera`
    - change properties on component

- JSP 
    - change name to `phonegap-camera.jsp`

```
    <%@include file="/libs/foundation/global.jsp" %><%
    %><%@ page session="false" %><%
    %>
    <div ng-controller="CameraCtrl" class="list card">
        <div class="item">
            <h2>Camera</h2>
            <p>Take a picture</p>
        </div>
        
        <div class="item item-image">
            <img ng-src="{{imageSrc}}">
        </div>
        
        <div class="item tabs tabs-secondary tabs-icon-left">
            <a class="tab-item" ng-click="takeAPicture()">
                <i class="icon ion-ios7-camera-outline"></i>
                Take a picture
            </a>
            <a class="tab-item" ng-click="browseForAPicture()">
                <i class="icon ion-ios7-photos-outline"></i>
                Browse gallery
            </a>
        </div>
    </div>
```

- Clientlib
    - change clientlib js file to `phonegap-camera.js`
    - change js.txt

```
    ;(function (angular, document, undefined) {

        angular.module('phonegapCamera', ['brucelefebvre.phonegap.camera'])
            .controller('CameraCtrl', ['$scope', 'camera', function($scope, camera) {
                function gotPicture(imageData) {
                    $scope.imageSrc = "data:image/jpeg;base64," + imageData;
                }

                function cameraError(message) {
                    console.error('Problem: ' + message);
                }

                $scope.takeAPicture = function() {
                    camera.getPicture(gotPicture, cameraError, {
                        quality: 50,
                        destinationType: Camera.DestinationType.DATA_URL
                    });
                };

                $scope.browseForAPicture = function() {
                    camera.getPicture(gotPicture, cameraError, {
                        quality: 50,
                        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                        destinationType: Camera.DestinationType.DATA_URL
                    });
                };
            }]);

    }(angular, document));
```

- Add module to angular-module-list.js.jsp
    - `phonegapCamera`


- Build and Replicate kitchen-sink package


Building the Contact List component
-----------------------------

- Add the `org.apache.cordova.contacts` plugin id to the install_plugins hook object (/content/phonegap/brucelefebvre/content/kitchen-sink/phonegap/.cordova/hooks/before_platform_add/install_plugins.js):
```
,
    {
        id:     "org.apache.cordova.contacts"
    }
```

- Add the following files to the splash page file list (contentsync-file-list.js.jsp):
```
,
"plugins/org.apache.cordova.contacts/www/Contact.js",
"plugins/org.apache.cordova.contacts/www/ContactField.js",
"plugins/org.apache.cordova.contacts/www/ContactOrganization.js",
"plugins/org.apache.cordova.contacts/www/ContactAddress.js",
"plugins/org.apache.cordova.contacts/www/ContactFindOptions.js",
"plugins/org.apache.cordova.contacts/www/contacts.js",
"plugins/org.apache.cordova.contacts/www/ContactError.js",
"plugins/org.apache.cordova.contacts/www/ContactName.js",
"plugins/org.apache.cordova.contacts/www/ios/Contact.js",
"plugins/org.apache.cordova.contacts/www/ios/contacts.js"
```

- Add the following markup to phonegap-contacts.jsp:
```
<div ng-controller="ContactsCtrl" class="list">
    <div class="item item-divider">
        Device Contact List
    </div>
    <div ng-repeat="contact in contacts">
        <a class="item">{{contact.displayName}}</a>
    </div>
</div>
```

- Add this script to phonegap-contacts.js:
```
angular.module('phonegapAPI')
        .controller('ContactsCtrl', ['$scope', 'phonegapReady', function($scope, phonegapReady) {
            
            var readAndDisplayContacts = phonegapReady(function() {
                function onSuccess(contacts) {
                    $scope.contacts = contacts;
                    $scope.$apply();
                };

                function onError(contactError) {
                    console.error('[contacts] error reading contacts');
                };

                // find all contacts
                if (window.ContactFindOptions) {
                    var options = new ContactFindOptions();
                    options.filter = "";
                    var filter = ["displayName"];
                    navigator.contacts.find(filter, onSuccess, onError, options);
                }
            });

            readAndDisplayContacts();
        }]);
```

- Add the component to the page
- Build and replicate the kitchen-sink package if you need the component on pub

