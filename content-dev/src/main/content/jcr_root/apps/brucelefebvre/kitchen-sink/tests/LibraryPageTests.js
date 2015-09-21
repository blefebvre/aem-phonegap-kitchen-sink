new hobs.TestSuite("Library Page Tests", {path:"/apps/brucelefebvre/kitchen-sink/tests/LibraryPageTests.js", register: true})

    .addTestCase(new hobs.TestCase("Navigate to library page")
        .navigateTo("/content/phonegap/kitchen-sink/en/home.html")
        .asserts.location("/content/phonegap/kitchen-sink/en/home.html", true)

        // Head to Library page
		.click("a.item[ng-click*='library']")
        .asserts.location("/content/phonegap/kitchen-sink/en/home/library.html", true)
		.asserts.isTrue(function() { 
            return hobs.find("h1.title")[0].innerHTML == "Library"; 
        })

        // Should contain two anchor items
        .asserts.isTrue(function() { 
            console.log(hobs.find("a.item").size());
            return hobs.find(".page-content a.item").size() === 2; 
        })
    )

	.addTestCase(new hobs.TestCase("View library category page")
		// Head to Topic
        .navigateTo("/content/phonegap/kitchen-sink/en/home/library/topic.html")
		.asserts.isTrue(function() { 
            return hobs.find("h1.title")[0].innerHTML == "Topic"; 
        })

		// Verify correct number of topics are listed
		.asserts.isTrue(function() { 
            return hobs.find(".page-content a.item").size() === 4; 
        })
    )
/* todo: correct this test
	.addTestCase(new hobs.TestCase("Open and close menu")
        .navigateTo("/content/phonegap/kitchen-sink/en/home.html")

        // Make sure it is closed to begin
		.asserts.hasCssClass("body", "snapjs-left", false)

		// Tap the hamburger icon to open it
        .click("a.button[snap-toggle]")

		// Menu should now be open
		.asserts.hasCssClass("body", "snapjs-left")
    )
*/
    ;

