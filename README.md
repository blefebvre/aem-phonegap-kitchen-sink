AEM Apps Kitchen Sink
=====================

:new: Note that the requirements have changed as of November 2014. If you do not have the Apps featurepack installed, please use the `release/6.0` branch.

A PhoneGap API showcase app managed in AEM.

What is this?
-------------

An AEM App which demonstrates the usage of various Cordova/PhoneGap API's, implemented as authorable components in an application that can be updated over-the-air. This app was originally built to accompany my talks at SUMMIT and [AEMHub](http://brucelefebvre.com/blog/2014/04/10/aemhub-mobile-apps-in-aem/), but has lived on as a companion to the [AEM Apps Starter Kit](https://github.com/Adobe-Marketing-Cloud/aem-phonegap-starter-kit).

Background: [So, you want to build an app](http://brucelefebvre.com/blog/2014/03/14/so-you-want-to-build-an-app/)


Requirements
------------

- AEM 6.0, with:
	- [Service Pack 1](https://www.adobeaemcloud.com/content/marketplace/marketplaceProxy.html?packagePath=/content/companies/public/adobe/packages/aem600/servicepack/AEM-6.0-Service-Pack) installed
	- [Apps Feature Pack 1](https://www.adobeaemcloud.com/content/marketplace/marketplaceProxy.html?packagePath=/content/companies/public/adobe/packages/cq600/featurepack/cq-6.0.0-featurepack-4558) installed
	- [Geometrixx Apps update](https://www.adobeaemcloud.com/content/marketplace/marketplaceProxy.html?packagePath=/content/companies/public/adobe/packages/cq60/product/cq-geometrixx-outdoors-app-pkg) installed
- [node.js](http://nodejs.org/) version `>=0.10.x`
- [PhoneGap CLI](https://github.com/phonegap/phonegap-cli) version `>=3.6.0`
- (iOS only) Xcode version `==6.1`
- (iOS only) [ios-sim](https://github.com/phonegap/ios-sim#installation) 
- (Android only) [Android SDK](https://developer.android.com/sdk/index.html)


Testing
-------

Download [PhantomJS](http://phantomjs.org/download.html) and add it to your path.

Install the testing dependencies with `npm`:

	npm install

You will also need the karma-cli installed in order to run tests:

	npm install -g karma-cli

To run the Jasmine tests with Karma, use maven:

	mvn test


Building
--------

This project uses Maven for building and installation to AEM. Common commands:

From the project directory, run:

	mvn -PautoInstallPackage clean install 

..to build the bundle and content package and install to a AEM instance.

Don't have the required testing tools installed? You can skip the tests with ``mvn -PautoInstallPackage clean install -DskipTests``


Viewing and editing app pages
-----------------------------

Open up the [AEM Apps console](http://localhost:4502/aem/apps.html/content/phonegap) (assumes you have an author instance running locally on :4502) to view your installed apps. Tap 'Kitchen Sink Shell' to open up the command center for this app.

In the 'Content' tile, tap the '[Kitchen Sink English](http://localhost:4502/aem/apps.html/content/phonegap/kitchen-sink/en)' item to browse the content hierarchy and make changes (or additions) to the app's content.


Demo scenarios
--------------

I've added a few demo scenarios to the [demos directory](demos) of this repository.


Using with VLT
--------------

To use vlt with this project, first build and install the package to your local AEM instance as described above. Then `cd content/src/main/content/jcr_root` and run

    vlt --credentials admin:admin checkout -f ../META-INF/vault/filter.xml --force http://localhost:4502/crx

Once the working copy is created, you can use the normal ``vlt up`` and ``vlt ci`` commands.


Specifying CRX Host/Port
------------------------

The CRX host and port can be specified on the command line with:

    mvn -Dcrx.host=otherhost -Dcrx.port=5502 <goals>


Credits
-------

- Compass designed by <a href="https://twitter.com/jay_proulx">Jay Proulx</a>
- Sink (app icon) designed by <a href="http://www.thenounproject.com/ArtZ91">Arthur Shlain</a> from the <a href="http://www.thenounproject.com">Noun Project</a>
