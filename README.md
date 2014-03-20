PhoneGap Kitchen Sink
======

A PhoneGap API showcase app managed in AEM.

Requirements
------------

- AEM 6.0 version `>=load 18`
    - author on :4502
    - publish on :4503
- [node.js](http://nodejs.org/) version `>=0.10.x`
- [PhoneGap CLI](https://github.com/phonegap/phonegap-cli) version `==3.3.*`
    - `$ npm install -g phonegap@3.3`
- (iOS only) Xcode version `<=5.0.2`
- (iOS only) [ios-sim](https://github.com/phonegap/ios-sim#installation) 
    - `$ npm install -g ios-sim`
- (Android only) [Android SDK](https://developer.android.com/sdk/index.html)

Building
--------

This project uses Maven for building. Common commands:

From the project directory, run ``mvn -PautoInstallPackage clean install`` to build the bundle and content package and install to a CQ instance.

Using with VLT
--------------

To use vlt with this project, first build and install the package to your local CQ instance as described above. Then cd to `src/main/content/jcr_root` and run

    vlt --credentials admin:admin checkout -f ../META-INF/vault/filter.xml --force http://localhost:4502/crx

Once the working copy is created, you can use the normal ``vlt up`` and ``vlt ci`` commands.

Specifying CRX Host/Port
------------------------

The CRX host and port can be specified on the command line with:
mvn -Dcrx.host=otherhost -Dcrx.port=5502 <goals>

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
                    alert('Problem: ' + message);
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

- 
