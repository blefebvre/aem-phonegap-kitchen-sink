/*
 * Based on code written by: Brian Ford http://briantford.com
 * License: MIT
 */

'use strict';

angular.module('brucelefebvre.phonegap.camera',
  ['btford.phonegap.ready']).
  factory('camera', function ($rootScope, phonegapReady) {
    return {
      getPicture: phonegapReady(function (onSuccess, onError, options) {
        navigator.camera.getPicture(function () {
          var that = this,
            args = arguments;
            
          if (onSuccess) {
            $rootScope.$apply(function () {
              onSuccess.apply(that, args);
            });
          }
        }, function () {
          var that = this,
          args = arguments;
            
          if (onError) {
            $rootScope.$apply(function () {
              onError.apply(that, args);
            });
          }
        },
        options);
      })
    };
  });