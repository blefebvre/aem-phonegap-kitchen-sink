// In Cordova Android 4.0, support for _getLocalFilesystemPath has been dropped.
// Override the provided function.
CQ.mobile.contentUtils.getLocalFilesystemPath = function(url, callback) {
	callback(null, url);
};