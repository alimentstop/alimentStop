var underscore = angular.module('async', []);
underscore.factory('async', ['$window', function($window) {
  return $window.async; // assumes underscore has already been loaded on the page
}]);