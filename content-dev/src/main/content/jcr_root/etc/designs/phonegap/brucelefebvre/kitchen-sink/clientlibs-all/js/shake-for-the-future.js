var initShakeForTheFuture = function() {

	'use strict';

	var audioURL = 'http://brucelefebvre.com/assets/future.m4a';
	var speaking = false;

	var shakeDetected = function() {
		if (speaking) return;

		speaking = true;

		var audio = new Media(audioURL,
			function () {
				console.log('the fuuuUUUuuUUuuUUTure!');
				audio.release();
				speaking = false;
			},
			function (err) {
				console.log('playAudio() error code: [' + err.code + 
						'] and message: [' + err.message + '].' );
				audio.release();
				speaking = false;
			}
		);
		audio.play();
	};

	var watchForShake = function() {
		shake.startWatch(shakeDetected);
	};

	document.addEventListener('deviceready', watchForShake, false);
};

initShakeForTheFuture();