
app.controller("ClassController", function($scope, $http, $location, $routeParams,$route,$window){
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
                'start_date':$scope.startDate,
                'turn': $scope.turn,
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
                'start_date':$scope.startDate,
                'turn': $scope.turn,
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
    // get class
    $scope.getDataClass = function(){
      $http.get(baseUrl+'/class').then(function(response){
        $scope.listClass = response.data;
      });
    };
    $scope.btnCancel = function(){
      $window.history.back();
    };
    // button update class
    $scope.btnUpdate = function(id){
      $scope.activePath = $location.path('/admin/class/update/'+id);
    };
    $scope.filterClass = function(){
      var id = $routeParams.id;
      $http.get(baseUrl+'/class/'+id).then(function(response){
        $scope.id = response.data.class_id;
        $scope.classCourse = response.data.class_course;
        $scope.classSchedule = response.data.class_schedule;
        $scope.classFacilitator = response.data.class_facilitator;
        $scope.startDate = response.data.class_start_date;
        $scope.turn = response.data.class_turn;
        $scope.classStatus = response.data.class_status;
      });
    };
    $scope.updateClass = function(){
      $http.put(baseUrl+'/class',
        {
            'class_id':$scope.id,
            'class_course':$scope.classCourse,
            'class_schedule':$scope.classSchedule,
            'class_facilitator':$scope.classFacilitator,
            'start_date':$scope.startDate,
            'turn': $scope.turn,
            'class_status':$scope.classStatus,
        },
        {
          headers: {
                'Content-Type': 'application/json; charset=utf-8'
          }
        }).then(function (response) {
            alert('update Successfully!');
            $scope.btnCancel();
        },function (ERROR) {
          alert('update error!');
        });
    };
      // delete class
    $scope.deleteClass = function(id){
      var deleteData = confirm('Are you sure want to delete class ID: '+id+' ?');
      var url = baseUrl+'/class/'+id;
      if(deleteData){
        $http.delete(url).then(function(response){
          $scope.getDataClass();
        });
      }
    };


});
