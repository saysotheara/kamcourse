app.controller('categoryCtl',function($scope,$http,$location,$routeParams){
  $scope.activePath = null;
  var baseUrl = window.location.origin+'/kamcourse/api';
  var currentUrl = $location.absUrl();
  $scope.getGallery = function(){
    $http.get(baseUrl+'/gallery').then(function(response){
      $scope.dataGallery = response.data;
    });
  };

      $scope.hasFile = null;
      $scope.uploadFile = function() {
        var uploadUrl = baseUrl+'/gallery';
        if($scope.hasFile){
            $scope.image = $scope.files[0];
            var file = $scope.image;
            var fromData = new FormData();
                fromData.append('file', file);
            var config = {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined,'Process-Data': false}
                };
            $scope.postGallery(uploadUrl,fromData,config);
        }else if($scope.urlPic){
            var data = {'image': $scope.urlPic};
            var config = {
                headers: {'Content-Type': 'application/json; charset=utf-8'}
                      };
                $scope.postGallery(uploadUrl,data,config);
                  }
      };
      $scope.postGallery = function(url,data,con){
        $http.post(url,data,con).then(function(response){
          $scope.getGallery();
          $scope.src = null;
          console.log(response.data);
          },function(data){
            alert("Error");
        });
      };
      $scope.uploadedFile = function(element) {
            var reader = new FileReader();
            reader.onload = function(event) {
             $scope.$apply(function($scope) {
                  $scope.files = element.files;
                  $scope.src = event.target.result;
                  $scope.hasFile = 'file';
             });
            }
            reader.readAsDataURL(element.files[0]);
      };
      $scope.changePic = function(){
      $scope.src = $scope.urlPic;
      $scope.files = null;
      };
      $scope.deletePic = function(id){
        var remove = confirm('delete picture id '+id);
        var url =  baseUrl+'/gallery/'+id;
        if(remove){
          $http.delete(url).then(function(response){
            $scope.getGallery();
          });
        }
      };
      $scope.selectPic = function (img) {
        $scope.photo = img;
      };
      //get category data
      $scope.getCategory = function(){
        var url = baseUrl+'/category';
        $http.get(url).then(function(response){
          $scope.categoryList = response.data;
        });
      };
      //event Insert
      $scope.btnInsertCate = function(){
        $scope.activePath = $location.path('/admin/category/create');
      };
      $scope.insertCategory = function(){
        var url = baseUrl+'/category';
        $http.post(url,
          {
              'name':$scope.name,
              'description':$scope.description,
              'cover':$scope.photo,
              'other_info':$scope.other_info

          },{
              headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }

        }).then(function(response){
          alert('you have successed to insert new category!');
          $scope.getCategory();
          $scope.activePath = $location.path('/admin/category');
        },function (error) {
          alert('Insert is bad working');
        });
      };
      //event Edit

      $scope.btnEditCate = function(id){
        $scope.activePath = $location.path('/admin/category/update/'+id);
      };

      $scope.filterCategory = function(){
        var id = $routeParams.id;
        var url = baseUrl+'/category/'+id;
        $http.get(url).then(function(response){
          console.log(response.data.category_id);
          $scope.category_id = response.data.category_id;
          $scope.name = response.data.category_name;
          $scope.description = response.data.category_description;
          $scope.photo = response.data.category_cover;
          $scope.other_info = response.data.category_other_info;
        });
      };
      $scope.updateCategory = function(){
        var url = baseUrl+'/category';
        $http.put(url,{
            'category_id':$scope.category_id,
            'name':$scope.name,
            'description':$scope.description,
            'cover':$scope.photo,
            'other_info':$scope.other_info

        },{
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
        }).then(function(response){
          alert('update successed!');
          $scope.getCategory();
          $scope.activePath = $location.path('/admin/category');
        },function(error){
          alert('update is bad working!');
        });
      };
      //event Delete category
      $scope.deleteCategory = function(id){
        var deleteCate = confirm('Are you sure want to delete this category ID: '+id);
        if(deleteCate){
          var url = baseUrl+'/category/'+id;
          $http.delete(url).then(function(response){
            console.log(response);
            $scope.getCategory();
          },function(error){
            console.log(Error);
          });
        }

      };
      // -- schedule --
      $scope.getSchedule = function(){
        var url = baseUrl+'/schedule';
        $http.get(url).then(function(response){
          $scope.scheduleList = response.data;
        });
      };
      // event btn Insert schedule
      $scope.btnInsertSche = function(){
        $scope.activePath = $location.path('/admin/schedule/create');
      } ;
      $scope.insertSchedule = function(){
        var url = baseUrl+'/schedule';
        $http.post(url,
          {
              'time':$scope.time,
              'description':$scope.description,
              'cover':$scope.photo,
              'other_info':$scope.other_info

          },{
              headers: {
                  'Content-Type': 'application/json; charset=utf-8'
                }
          }).then(function(response){
            alert('create schedule is successed!');
            $scope.activePath = $location.path('/admin/schedule');
          },function(error){
            alert('bad working!');
          });
      };
      //event edit schedule
      $scope.btnEditSche = function(id){
        $scope.activePath = $location.path('/admin/schedule/update/'+id);
      };
      $scope.filterSchedule = function(){
        var id = $routeParams.id;
        var url = baseUrl+'/schedule/'+id;
        $http.get(url).then(function(response){
          $scope.schedule_id = response.data.schedule_id;
          $scope.time = response.data.schedule_time;
          $scope.description = response.data.schedule_description;
          $scope.photo = response.data.schedule_cover;
          $scope.other_info = response.data.schedule_other_info;
        });
      };
      $scope.updateSchedule = function(){
        var url = baseUrl+'/schedule';
        $http.put(url,{

            'schedule_id':$scope.schedule_id,
            'time':$scope.time,
            'description':$scope.description,
            'cover':$scope.photo,
            'other_info':$scope.other_info

        },{
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
        }).then(function(response){
          alert('update is successed!');
          $scope.activePath = $location.path('/admin/schedule');
        },function(error){
          alert('bad working!');
        });
      };
      $scope.deleteSche = function(id){
        var deleteSchedule  = confirm('Are you sure want to delete schedule ID: '+id);
        if(deleteSchedule){
          var url = baseUrl+'/schedule/'+id;
          $http.delete(url).then(function(response){
            $scope.getSchedule();
          });
        }
      };

});
