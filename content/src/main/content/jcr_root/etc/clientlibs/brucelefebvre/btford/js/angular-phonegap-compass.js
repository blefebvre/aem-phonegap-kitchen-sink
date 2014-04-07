/*
 * Based on code written by: Brian Ford http://briantford.com
 * License: MIT
 */

'use strict';

angular.module('brucelefebvre.phonegap.geolocation',
  ['btford.phonegap.ready']).
  factory('compass', function ($rootScope, phonegapReady) {
    return {
      getCurrentHeading: phonegapReady(function (onSuccess, onError, options) {
        navigator.compass.getCurrentHeading(function () {
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