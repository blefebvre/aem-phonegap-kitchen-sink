;(function (angular, document, undefined) {

    angular.module('phonegapAPI')
    	.controller('ContactsCtrl', ['$scope', 'phonegapReady', function($scope, phonegapReady) {
            
            var readAndDisplayContacts = phonegapReady(function() {
				function onSuccess(contacts) {
				    $scope.contacts = contacts;
				    $scope.$apply();
				};

				function onError(contactError) {
				    console.error('[contacts] error reading contacts');
				};

				// find all contacts
				if (window.ContactFindOptions) {
					var options = new ContactFindOptions();
					options.filter = "";
					var filter = ["displayName"];
					navigator.contacts.find(filter, onSuccess, onError, options);
				}
            });

            readAndDisplayContacts();
        }]);

}(angular, document));