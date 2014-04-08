<%@ page session="false"
         import="com.day.cq.wcm.api.components.IncludeOptions" %><%
%><%@include file="/libs/foundation/global.jsp" %><%
%><%
    // Prevent wrapping of module .js content
    IncludeOptions opts = IncludeOptions.getOptions(request, true);
    opts.setDecorationTagName("");
    opts.forceSameContext(Boolean.TRUE);

%>[
"cordova.js",
"cordova_plugins.js",
"plugins/org.apache.cordova.file/www/ios/Entry.js",
"plugins/org.apache.cordova.file/www/ios/FileSystem.js",
"plugins/org.apache.cordova.file/www/android/FileSystem.js",
"plugins/org.apache.cordova.file/www/DirectoryEntry.js",
"plugins/org.apache.cordova.file/www/DirectoryReader.js",
"plugins/org.apache.cordova.file/www/Entry.js",
"plugins/org.apache.cordova.file/www/File.js",
"plugins/org.apache.cordova.file/www/FileEntry.js",
"plugins/org.apache.cordova.file/www/FileError.js",
"plugins/org.apache.cordova.file/www/FileReader.js",
"plugins/org.apache.cordova.file/www/FileSystem.js",
"plugins/org.apache.cordova.file/www/FileUploadOptions.js",
"plugins/org.apache.cordova.file/www/FileUploadResult.js",
"plugins/org.apache.cordova.file/www/FileWriter.js",
"plugins/org.apache.cordova.file/www/Flags.js",
"plugins/org.apache.cordova.file/www/LocalFileSystem.js",
"plugins/org.apache.cordova.file/www/Metadata.js",
"plugins/org.apache.cordova.file/www/ProgressEvent.js",
"plugins/org.apache.cordova.file/www/requestFileSystem.js",
"plugins/org.apache.cordova.file/www/resolveLocalFileSystemURI.js",
"plugins/org.apache.cordova.file-transfer/www/FileTransfer.js",
"plugins/org.apache.cordova.file-transfer/www/FileTransferError.js",
"plugins/org.apache.cordova.geolocation/www/Coordinates.js",
"plugins/org.apache.cordova.geolocation/www/geolocation.js",
"plugins/org.apache.cordova.geolocation/www/Position.js",
"plugins/org.apache.cordova.geolocation/www/PositionError.js",
"plugins/org.apache.cordova.device/www/device.js",
"plugins/org.apache.cordova.network-information/www/network.js",
"plugins/org.apache.cordova.network-information/www/Connection.js",
"plugins/org.chromium.zip/zip.js",
"plugins/org.apache.cordova.device-orientation/www/CompassError.js",
"plugins/org.apache.cordova.device-orientation/www/CompassHeading.js",
"plugins/org.apache.cordova.device-orientation/www/compass.js",
"plugins/org.apache.cordova.camera/www/Camera.js",
"plugins/org.apache.cordova.camera/www/CameraPopoverHandle.js",
"plugins/org.apache.cordova.camera/www/ios/CameraPopoverHandle.js",
"plugins/org.apache.cordova.camera/www/CameraConstants.js",
"plugins/org.apache.cordova.camera/www/CameraPopoverOptions.js",
"plugins/org.apache.cordova.network-information/www/Connection.js",
"plugins/org.apache.cordova.network-information/www/network.js",
"plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js"
]