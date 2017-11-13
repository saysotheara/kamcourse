frontEnd.controller("userCtrl",function($http,$scope,$location,$routeParams){
    $scope.activePath = null;
    var baseUrl = window.location.origin+'/kamcourse';
    var url = $location.absUrl();

    $scope.getListCourse = function(){
      $http.get(baseUrl+'/api/course').then(function(response){
        $scope.listCourse = response.data;

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
      var url = baseUrl+'/api/course/'+id;
      $http.get(url).then(function(response){
        $scope.courseData = response.data;
      });
    };
    var category = [{name:'Mechanical Engineering',color:'/kamcourse/web/asset/img/web1.png'},{name:'Civil Engineering',color:'/kamcourse/web/asset/img/web.png'},{name:'Architechture',color:'/kamcourse/web/asset/img/web3.png'},{name:'IT Engineering',color:'/kamcourse/web/asset/img/web1.png'},{name:'Electrical Engineering',color:'/kamcourse/web/asset/img/web3.png'}
                    ,{name:'Japanes Languages',color:'/kamcourse/web/asset/img/web.png'}];
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
