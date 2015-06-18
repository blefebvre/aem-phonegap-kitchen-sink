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
					options.multiple = true;
					options.desiredFields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
					var fields = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
					navigator.contacts.find(fields, onSuccess, onError, options);
				}
            });

            readAndDisplayContacts();
        }]);

}(angular, document));