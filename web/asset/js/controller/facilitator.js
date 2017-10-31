
app.controller("FacilitatorController", function($scope, $http, $location, $routeParams){
$scope.activePath = null;
  	var baseUrl = window.location.origin;
    //$config['baseUrl']='http://localhost/kamcourse/';
  	var url = $location.absUrl();
  	var dataId = null;
	$scope.getAll = function(){
        $http.get(baseUrl+'/kamcourse/api/facilitator').then(function(response){
          $scope.facilitatorData = response.data;

        });
      };

      $scope.removefacilitator = function(id){
      var deL = confirm('Are you sure want to delete It?');
      var url = baseUrl+'/kamcourse/api/facilitator/'+id;
      if(deL){
        $http.delete(url).then(function(response){
      $scope.activePath = $location.path('/admin/facilitator/');
          $scope.getAll();
            });
          }else if(!deL){
          
            $scope.activePath = $location.path('/admin/facilitator/');
          }
          ;
        };

        $scope.btnSaveNexts = function(){
      var url = baseUrl+'/kamcourse/api/facilitator';
       $http.post(url,{
        'fname':$scope.fname,
        'lname':$scope.lname,
        'phone':$scope.phone,
        'email':$scope.email,
        'sex':$scope.sex,
        'media':$scope.media,
        'address':$scope.address,
        'platform':$scope.platform,
        'profile':$scope.profile,
        'create':$scope.create,
        'updates':$scope.updates,
        'active':$scope.active,
        'other_info':$scope.other_info
      },{
    headers: {
            'Content-Type': 'application/json; charset=utf-8'}
          }).then(function(response){
            console.log('Success!');
            $scope.activePath = $location.path('/admin/facilitator/');

          },function(response){
            console.log(ERROR);
          });
    };


    $scope.btnUpdates = function(id){
        $scope.activePath = $location.path('/admin/updatefacilitator/'+id);
      };
      $scope.btnAdd = function(id){
        $scope.activePath = $location.path('/admin/createfacilitator/');
      };
$scope.filterfacilitator= function(){
      var id = $routeParams.id;
      var url = baseUrl+'/kamcourse/api/facilitator/'+id;
      $http.get(url).then(function(response){
        console.log(response);
        $scope.id = response.data.facilitator_id;
        $scope.fname = response.data.facilitator_firstname;
        $scope.lname = response.data.facilitator_lastname;
        $scope.phone = response.data.facilitator_phone;
        $scope.email = response.data.facilitator_email;
        $scope.sex = response.data.facilitator_sex;
        $scope.media = response.data.facilitator_media;
        $scope.address = response.data.facilitator_address;
        $scope.platform = response.data.facilitator_via_platform;
        $scope.profile = response.data.facilitator_profile;
        $scope.create = response.data.facilitator_create_date;
        $scope.updates = response.data.facilitator_update_date;
        $scope.active = response.data.facilitator_active_date;
        $scope.other_info = response.data.facilitator_other_info;

      });
    };

$scope.updatefacilitator = function(){
      var id = $scope.id;
      var url = baseUrl+'/kamcourse/api/facilitator/'+id;
      $http.put(url,{

        'id':id,
        'fname':$scope.fname,
        'lname':$scope.lname,
        'phone':$scope.phone,
        'email':$scope.email,
        'sex':$scope.sex,
        'media':$scope.media,
        'address':$scope.address,
        'platform':$scope.platform,
        'profile':$scope.profile,
        'create':$scope.create,
        'updates':$scope.updates,
        'active':$scope.active,
        'other_info':$scope.other_info

      }).then(function(response){
        console.log('success!');
        $scope.activePath = $location.path('/admin/facilitator');
      },function(response){
        console.log('error');
      });
    };
    
});
