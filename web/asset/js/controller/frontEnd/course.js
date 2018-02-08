app.controller("userCtrl",function($scope,$route,$http,$location,$routeParams,$cookieStore,$window,$timeout,BASE){
    $scope.$route = $route;
    $scope.activePath = null;
    $scope.userAuth =  $cookieStore.get('userLog');
    $scope.currentDate = new Date();
    var baseUrl = window.location.origin+BASE;
    var url = $location.absUrl();

    $scope.getListCourse = function(){
      var idCategory = $routeParams.categoryId;
      if(idCategory){
        $http.get(baseUrl+'/api/class/category/'+idCategory).then(function(response){
          $scope.listCourse = response.data;
          if($scope.listCourse.length > 0){
            $scope.bigTotalItems = $scope.listCourse.length;
            $scope.bigItemsPerPage = 4;
            $scope.maxSize = 6;
            $scope.bigCurrentPage = 1;
          }else {
            $scope.noPage = true;
          }

          $scope.topCourse($scope.listCourse);
        });
      }else {
        $http.get(baseUrl+'/api/class').then(function(response){
          $scope.listCourse = response.data;
          $scope.bigTotalItems = $scope.listCourse.length;
          $scope.bigItemsPerPage = 4;
          $scope.maxSize = 6;
          $scope.bigCurrentPage = 1;
          $scope.topCourse($scope.listCourse);

        });
      }
    };
    $scope.popularClass = function(){
      $http.get(baseUrl+'/api/popular/class').then(function(response){
        console.log(response.data);
        $scope.popular = response.data;
      });
    };
    $scope.topCourse = function(dataCourse){
      $scope.lastCourse = [];
      var count = 0;
      angular.forEach(dataCourse,function (value,index) {
        count = count + 1;
        if( count <= 4){
          $scope.lastCourse.push(value);
          }
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
        $scope.recommendCourse(response.data.course_category);
      });


    };
    $scope.recommendCourse = function(id){

      $http.get(baseUrl+'/api/recommend/course/'+id).then(function(response){
        $scope.recommends = response.data;
      });
    };
    $scope.getCategory = function(){
      $http.get(baseUrl+'/api/category').then(function(response){
        $scope.dataCategory = response.data;
      });
    };
    $scope.onByCategory = function($categoryId){
      $scope.activePath = $location.path('/class/category/'+$categoryId);
    };

    $scope.registerCourse = function(){
      $http.post(baseUrl+'/api/check/register',{'email':$scope.email},
      {
          headers: {
              'Content-Type': 'application/json; charset=utf-8'
          }
      }).then(function(response){
        if(response.data){
          alert("your email is already used! Please change new email.");
        }else {
          $scope.createRegister();
        }
      });
    };
    $scope.createRegister = function(){
      var url = baseUrl+'/api/student';

      $http.post( url,
        {
            'fname':$scope.fname,
            'lname':$scope.lname,
            'email':$scope.email,
            'phone':$scope.phone,
            'password':$scope.password
        },
        {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function(response){

            console.log(response.data);
            alert('you have registed!');
            $cookieStore.put('userId',response.data);
            $cookieStore.put('userLog',true);
            $('#register').modal('hide');
            // $scope.registerClass();

            $scope.comfirmEmail($scope.email);
            $('#vertify').modal('show');

        });
    };

    $scope.registerClass = function(){
      var url = baseUrl+'/api/students/join';
      $http.post(url,
        {
            'studentID':$cookieStore.get('userId'),
            'classID':$routeParams.id,
        },
        {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).then(function(response){
          console.log(response);
          $('#join').modal('hide');
          if(response.data == '1'){
            alert('Thank you for joining this class!');

          }else {
            alert("this class is Joined already! ");

          }

        });
    };

    $scope.getStudentActivity = function(){
      var url = baseUrl+'/api/students/join/'+$cookieStore.get('userId');
      $http.get(url).then(function(response){
          $scope.activity = response.data;
          console.log(response.data);
      });
    };
    $scope.getProfile = function(){
      var id = $cookieStore.get('userId');
      $http.get(baseUrl+'/api/student/'+id).then(function(response){
        console.log(response.data);
        $scope.fname = response.data.student_firstname;
        $scope.lname = response.data.student_lastname;
        $scope.sex = response.data.student_sex;
        $scope.phone = response.data.student_phone;
        $scope.email = response.data.student_email;
        $scope.address = response.data.student_address;
        $scope.birth = response.data.student_birth;
        $scope.cover = response.data.student_cover;




      });

    };
    $scope.hasFile = false;
    $scope.updateProfile = function(){
      var id = $cookieStore.get('userId');

      var fromData = new FormData();
      if ($scope.hasFile){
        $scope.image = $scope.files[0];
        var size = $scope.files[0].size;
              fromData.append('file',$scope.image);
        }
              fromData.append('fname',$scope.fname);
              fromData.append('lname',$scope.lname);
              fromData.append('email',$scope.email);
              fromData.append('phone',$scope.phone);
              fromData.append('sex',$scope.sex);
              fromData.append('address',$scope.address);
              fromData.append('birth',$scope.birth);
              fromData.append('cover',$scope.cover);
          if(size >= 2097152 ){
              $scope.lagreFile = true;
              $scope.progress = false;
          }else {
              $scope.progress = true;
              $http.post(baseUrl+'/api/student/'+id,fromData,
              {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined,'Process-Data': false}
              }).then(function(response){
              alert('success');
              $scope.getProfile();
              console.log(response.data);
            });
          }

    };
    $scope.register = function(){
      $('#register').modal('show');
    };
    $scope.join = function(){
      $('#join').modal('show');
    };
    $scope.convertDate = function(date){
      var myDate = new Date(date);
      return myDate;
    };
    $scope.startDate = function(date){
      var numOfDay = 93;
      var oldDate = new Date(date);
      var newDate = oldDate.setDate(oldDate.getDate()+numOfDay);
      console.log(newDate);
      return newDate;

    }
    $scope.uploadedFile = function(element) {
          var reader = new FileReader();
          reader.onload = function(event) {
           $scope.$apply(function($scope) {
                $scope.files = element.files;
                $scope.src = event.target.result;
                $scope.hasFile = true;

           });
          }
          reader.readAsDataURL(element.files[0]);
    };
    $scope.comfirmEmail = function(email){
      var url = baseUrl+'/api/user/vertify';
      $http.post(url,{
          'studentID':$cookieStore.get('userId'),
          'email':email
      },
      {
          headers: {
              'Content-Type': 'application/json; charset=utf-8'
          }
      }).then(function(response){
          console.log(response);
      });
    };
    $scope.vertify = function(){
      var param = $routeParams.email;
      var url = baseUrl+'/api/vertified';
      $http.post(url,{
          'email': $routeParams.email
      },
      {
          headers: {
              'Content-Type': 'application/json; charset=utf-8'
          }
      }).then(function(response){
        console.log(response);
        $scope.comfirm = response.data;

      });
    };
  $scope.contact = function(){
    $scope.getProfile();
  };
  $scope.sendContact = function(){
    var url = baseUrl+'/api/contact';
    $http.post(url,{
        'name' : $scope.fname+' '+$scope.lname,
        'email': $scope.email,
        'phone': $scope.phone,
        'comment':$scope.comments
    },
    {
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    }).then(function(response){
      console.log(response);
      if(response.data){
        alert("sending is successed!");
      }else {
        alert("have problem!");
      }
    });
  };

});
