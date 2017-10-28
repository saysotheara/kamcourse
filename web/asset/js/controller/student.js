
app.controller("StudentController", function($scope, $http, $location, $routeParams){

	$scope.activePath = null;
  	var baseUrl = window.location.origin;
    //$config['baseUrl']='http://localhost/kamcourse/';
  	var url = $location.absUrl();
  	var dataId = null;
	$scope.getAll = function(){
        $http.get(baseUrl+'/kamcourse/api/student').then(function(response){
          $scope.studentData = response.data;

        });
      };

      $scope.removeStudent = function(id){
      var deL = confirm('Are you sure want to delete It?');
      var url = baseUrl+'/kamcourse/api/student/'+id;
      if(deL){
        $http.delete(url).then(function(response){
      $scope.activePath = $location.path('/admin/student/');
          $scope.getAll();
            });
          }else if(!deL){
          
            $scope.activePath = $location.path('/admin/student/');
          }
          ;
        };

        $scope.btnSaveNexts = function(){
      var url = baseUrl+'/kamcourse/api/student';
       $http.post(url,{
        'fname':$scope.fname,
        'lname':$scope.lname,
        'phone':$scope.phone,
        'email':$scope.email,
        'sex':$scope.sex,
        'media':$scope.media,
        'address':$scope.address,
        'platform':$scope.platform,
        'create':$scope.create,
        'updates':$scope.updates,
        'active':$scope.active,
        'other_info':$scope.other_info
      },{
    headers: {
            'Content-Type': 'application/json; charset=utf-8'}
          }).then(function(response){
            console.log('Success!');
            $scope.activePath = $location.path('/admin/student/');

          },function(response){
            console.log(ERROR);
          });
    };


    $scope.btnUpdates = function(id){
        $scope.activePath = $location.path('/admin/studentup/'+id);
      };
      $scope.btnAdd = function(id){
        $scope.activePath = $location.path('/admin/createstudent/');
      };
$scope.filterstudent= function(){
      var id = $routeParams.id;
      var url = baseUrl+'/kamcourse/api/student/'+id;
      $http.get(url).then(function(response){
        console.log(response);
        $scope.id = response.data.student_id;
        $scope.fname = response.data.student_firstname;
        $scope.lname = response.data.student_lastname;
        $scope.phone = response.data.student_phone;
        $scope.email = response.data.student_email;
        $scope.sex = response.data.student_sex;
        $scope.media = response.data.student_media;
        $scope.address = response.data.student_address;
        $scope.platform = response.data.student_via_platform;
        $scope.create = response.data.student_create_date;
        $scope.updates = response.data.student_update_date;
        $scope.active = response.data.student_active_date;
        $scope.info = response.data.student_other_info;

      });
    };

$scope.updatestudent = function(){
      var id = $scope.id;
      var url = baseUrl+'/kamcourse/api/student/'+id;
      $http.put(url,{
        'id': id,
        'fname':$scope.fname,
        'lname':$scope.lname,
        'phone':$scope.phone,
        'email':$scope.email,
        'sex':$scope.sex,
        'media':$scope.media,
        'address':$scope.address,
        'platform':$scope.platform,
        'create':$scope.create,
        'updates':$scope.updates,
        'active':$scope.active,
        'other_info':$scope.info

      }).then(function(response){
        console.log('success!');
        $scope.activePath = $location.path('/admin/student');
        $scope.backUp();
      },function(response){
        console.log('error');
      });
    };
});
