var app = angular.module("KamcourseApp", ["ngRoute", "angular-thumbnails",'ngSanitize','textAngular','ngCookies','ui.bootstrap']);
app.controller("ClassController", function($scope, $http, $location, $routeParams){
});
app.constant('BASE','/kamcourse');
app.run(['$rootScope', 'BASE', function($rootScope, BASE) {
    $rootScope.base = BASE;
}]);
