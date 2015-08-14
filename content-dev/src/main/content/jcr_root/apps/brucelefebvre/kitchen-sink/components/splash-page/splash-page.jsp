<%@page session="false"
	      import="com.day.cq.wcm.api.WCMMode,
	              java.util.Iterator,
	              com.day.cq.wcm.api.Page,
	              com.adobe.cq.mobile.angular.data.util.FrameworkContentExporterUtils,
	              org.apache.commons.lang.StringUtils" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
%><c:set var="wcmMode"><%= WCMMode.fromRequest(request) != WCMMode.DISABLED %></c:set><%

    // Page to redirect to on successful app init
    Page successRedirectPage;

    // Use redirectTarget if specified
    String redirectTarget = properties.get("./redirectTarget", String.class);
    if (StringUtils.isNotBlank(redirectTarget)) {
        successRedirectPage = pageManager.getPage(redirectTarget);
    }
    // else, use the first child page
    else {
        Iterator<Page> childPageIterator = currentPage.listChildren();
        successRedirectPage = childPageIterator.next();
    }

    // Unique identifer to reference the cached content
    String appId = successRedirectPage.getProperties().get("applicationName", "AEMAngularApp");
    String successRedirectPath = successRedirectPage.getPath() + ".html";
    String title = successRedirectPage.getTitle();
    String relativePathToRoot = FrameworkContentExporterUtils.getRelativePathToRootLevel(currentPage.adaptTo(Resource.class));
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <title><%= xssAPI.encodeForHTML(currentPage.getTitle()) %> - Splash</title>
    <cq:include script="/libs/wcm/core/components/init/init.jsp"/>
    <cq:include script="headlibs.jsp" />
</head>
<body class="cq-mobile-phonegap-splash-page">

    <c:choose>
        <c:when test="${wcmMode}">

            <p align="center">
                This page redirects to <a href="<%= xssAPI.getValidHref(successRedirectPath) %>"><%= xssAPI.filterHTML(title) %></a>
            </p>

        </c:when>
        <c:otherwise>

            <script type="text/javascript" src="<%= xssAPI.getValidHref(relativePathToRoot) %>cordova.js"></script>
            <cq:include script="bodylibs.jsp" />
            <script>
                // Redirect to the following path once init has finished
                var successRedirectPath = '<%= xssAPI.getValidHref(successRedirectPath) %>';
                var additionalContentCopyFiles = ["cordova.js", "cordova_plugins.js"];

                var initializationComplete = function(error, localContentPath) {
                    if (error) {
                        return console.error("ContentSync init error: " + error);
                    }

                    // App was successfully initialized. Redirect to the new local content path.
                    console.log("ContentSync success. Returned path: [" + localContentPath + "]");
                    localContentPath = CQ.mobile.contentUtils.getPathToWWWDir(localContentPath);
                    return window.location.href = localContentPath + successRedirectPath;
                };

                var initializeApplication = function() {
                    var pluginUrl = CQ.mobile.contentUtils.getPathToWWWDir(window.location.href) + "cordova_plugins.js";
                    var request = new XMLHttpRequest();
                    request.open("GET", pluginUrl, true);
                    request.onreadystatechange = function() {
                        if (request.readyState == 4) {
                            var text = request.responseText;
                            //parse text for module exports
                            if ( text && text.length > 0 ) {
                                var searchPos = text.indexOf( "module.exports =" );
                                if ( searchPos >= 0 ) {
                                    var startPos = text.indexOf( "[", searchPos ),
                                        endPos = text.indexOf( "];", startPos );

                                    if ( startPos > searchPos && endPos > startPos ) {
                                        var rawFiles = JSON.parse( text.substring( startPos, endPos + 1 ) );
                                        for ( var i = 0; i < rawFiles.length; i++ ) {
                                            var module = rawFiles[i];
                                            if ( module.file ) {
                                                additionalContentCopyFiles.push( module.file );
                                            }
                                        }
                                    }
                                }
                            }
                            // Initialize app 
                            var contentInitializer = CQ.mobile.contentInit({
                                id: '<%= xssAPI.encodeForJSString(appId) %>',
                                additionalFiles: additionalContentCopyFiles
                            });
                            contentInitializer.initializeApplication(initializationComplete);
                        }
                    };
                    request.send();
                };

                // Begin initialization once Cordova bridge is ready
                document.addEventListener('deviceready', initializeApplication, false)
            </script>
        </c:otherwise>
    </c:choose>
</body>
</html>