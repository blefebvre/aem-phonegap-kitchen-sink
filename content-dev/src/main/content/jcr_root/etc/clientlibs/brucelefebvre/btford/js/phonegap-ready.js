/**
 * angular-phonegap-ready v0.0.1
 * (c) 2013 Brian Ford http://briantford.com
 * License: MIT
 */

'use strict';

angular.module( 'btford.phonegap.ready', [] ).
	factory( 'phonegapReady', ['$window', function( $window ) {
		return function( fn ) {
			var queue = [];

			var impl = function() {
				queue.push( Array.prototype.slice.call( arguments ) );
			};

			function onDeviceReady() {
				queue.forEach( function( args ) {
					fn.apply( this, args );
				} );
				impl = fn;
			}

			if( $window.cordova ) {
				document.addEventListener( 'deviceready', onDeviceReady, false );
			} else {
				onDeviceReady();
			}

			return function() {
				return impl.apply( this, arguments );
			};
		};
	}] );