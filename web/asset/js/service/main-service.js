var app = angular.module("KamcourseApp", ["ngRoute", "angular-thumbnails",'ngSanitize','textAngular','ngCookies','ui.bootstrap']);
app.constant('BASE','/kamcourse');
app.run(['$rootScope', 'BASE', function($rootScope, BASE) {
    $rootScope.base = BASE;
}]);
app.service('sharedProperties', function () {
        var searchData;

        return {
            getProperty: function () {
                return searchData;
            },
            setProperty: function(value) {
                searchData = value;
            }
        };
    });
app.controller('searchCtrl',function($scope,$http,$route,$location,$rootScope,BASE,sharedProperties){

    $scope.searchAble = function(){
    $location.path('/search');

  };
    $scope.filterCourse = function(){
      sharedProperties.setProperty($scope.dataSearch);
      $scope.getListCourse();
    };
  var baseUrl = window.location.origin+BASE;
  var url = $location.absUrl();

  $scope.getListCourse = function(){

      $http.get(baseUrl+'/api/class').then(function(response){
        $scope.listCourse = response.data;
        $scope.bigTotalItems = $scope.listCourse.length;
        $scope.bigItemsPerPage = 4;
        $scope.maxSize = 6;
        $scope.bigCurrentPage = 1;

      });

  };
  $scope.detail = function(id){
    $scope.activePath = $location.path('/course/'+id);
  };

});
