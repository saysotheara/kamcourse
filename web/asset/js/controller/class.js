
app.controller("ClassController", function($scope, $http, $location, $routeParams,$route){
    $scope.$route = $route;
    $scope.activePath = null;
    var baseUrl = window.location.origin+'/kamcourse/api';
    var url = $location.absUrl();

    // get data Course
    $scope.getCourse = function(){
      $http.get(baseUrl+'/course').then(function(response){
        $scope.courses = response.data;
      });
    };
    // get data shedule
    $scope.getSchedule = function(){
      $http.get(baseUrl+'/schedule').then(function(response){
        $scope.schedules = response.data;
      });
    };
    // get data facilitator
    $scope.getFacilitator = function(){
      $http.get(baseUrl+'/facilitator').then(function(response){
        $scope.facilitators = response.data;
      });
    } ;

	  $scope.onNewClassClick = function() {
      $scope.activePath = $location.path('/admin/class/add');
	  };
    //create class
    $scope.btnSaveClose = function(){

        var url = baseUrl+'/class';
        var video = 'N/A';
        if($scope.classVideo != null){
            video = $scope.classVideo;
        }

        $http.post(
            url,
            {
                'class_course':$scope.classCourse,
                'class_schedule':$scope.classSchedule,
                'class_facilitator':$scope.classFacilitator,
                'class_status':$scope.classStatus
            },
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then( function(response){
                console.log('Success!');
                $scope.activePath = $location.path('/admin/class');
                alert("Successfully created a new class");
            },function(response){
                console.log(ERROR);
                alert("Failed to create a new class");
            }
        );
    };
    $scope.btnSaveNext = function(){
        var url = baseUrl+'/class';
        var video = 'N/A';
        if($scope.classVideo != null){
          video = $scope.classVideo;
        }

        $http.post(
            url,
            {
                'class_course':$scope.classCourse,
                'class_schedule':$scope.classSchedule,
                'class_facilitator':$scope.classFacilitator,
                'class_status':$scope.classStatus,

            },
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).then( function(response){
                console.log('Success!');
                alert("Successfully created a new class");
                $scope.classCourse = '';
                $scope.classSchedule = '';
                $scope.classFacilitator = '';
                $scope.classStatus = '';
                
            },function(response){
                console.log(ERROR);
                alert("Failed to create a new class");
            }
        );
    };
    $scope.btnCancel = function(){
      $window.history.back();
    };




});
