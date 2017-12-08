app.controller("userCtrl",function($http,$scope,$location,$routeParams,BASE){
    $scope.activePath = null;
    var baseUrl = window.location.origin+BASE;
    var url = $location.absUrl();

    $scope.getListCourse = function(){
      $http.get(baseUrl+'/api/class').then(function(response){
        $scope.listCourse = response.data;
        $scope.bigTotalItems = $scope.listCourse.length;
        $scope.bigItemsPerPage = 4;
        $scope.maxSize = 6;
        $scope.bigCurrentPage = 1;

        $scope.lastCourse = [];
        var count = 0;

        angular.forEach($scope.listCourse,function (value,index) {
          count = count + 1;
          if( count <= 4){
            $scope.lastCourse.push(value);


          }
        });

      });


    };
    $scope.detail = function(id){
      $scope.activePath = $location.path('/course/'+id);
    };
    $scope.showDetail = function(){
      var id = $routeParams.id;
      var url = baseUrl+'/api/class/user/'+id;
      $http.get(url).then(function(response){
        $scope.courseData = response.data;
      });
    };
    var category = [{name:'Mechanical Engineering',color:BASE+'/web/asset/img/web1.png'},{name:'Civil Engineering',color:BASE+'/web/asset/img/web.png'},{name:'Architechture',color:BASE+'/web/asset/img/web3.png'},{name:'IT Engineering',color:BASE+'/web/asset/img/web1.png'},{name:'Electrical Engineering',color:BASE+'/web/asset/img/web3.png'}
                    ,{name:'Japanes Languages',color:BASE+'/web/asset/img/web.png'}];
    var row = '';
    angular.forEach(category,function(value,index){
        if( index < 2){
          row +=  '<div class="col-sm-6 category "><figure class="figure-6">'+
                  '<img src="'+value.color+'" alt="Thumb" width="100%" height="130" />'+
                  '<figcaption><div>'+value.name+'</div></figcation>'+
                  '</figure></div>';
        }else if(index < 5){
          row +=  '<div class="col-sm-4 category " ><figure class="figure-4">'+
                  '<img src="'+value.color+'" alt="Thumb" width="100%" height="130" />'+
                  '<figcaption><div>'+value.name+'</div></figcation>'+
                  '</figure></div>';
        }else if(index >= 5){
          row +=  '<div class="col-sm-6  category  " ><figure class="figure-6 ">'+
                  '<img src="'+value.color+'" alt="Thumb" width="100%" height="130" />'+
                  '<figcaption><div>'+value.name+'</div></figcation>'+
                  '</figure></div>';
        }
    });
    $scope.myHtml = row;




});
