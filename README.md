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


