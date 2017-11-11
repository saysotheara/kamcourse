
app.config(function($routeProvider){
    $routeProvider.when("/admin",{
            templateUrl:'template/login.html',
            controller: 'loginCtrl'
    }).when("/admin/course",{
            resolve:{
              "check": function($location,$rootScope){
                if(!$rootScope.loggedIn){
                  $location.path('/admin');
                }
              }
            },
              templateUrl: "template/course/course.html",
              controller: "CourseController"
    }).when('/admin/create',{
      resolve:{
        "check": function($location,$rootScope){
          if(!$rootScope.loggedIn){
            $location.path('/admin');
          }
        }
      },
        templateUrl: "template/course/create.html",
        controller: "CourseController"

    }).when('/admin/update/:id',{
      resolve:{
        "check": function($location,$rootScope){
          if(!$rootScope.loggedIn){
            $location.path('/admin');
          }
        }
      },
        templateUrl: "template/course/update.html",
        controller: "CourseController"
    }).when('/course',{
        templateUrl: "template/course/frontEnd/course1.html",
        controller: "userCtrl"
    }).when('/course/:id',{
        templateUrl: "template/course/frontEnd/detail.html",
        controller: "userCtrl"

    // Class Management
    }).when('/admin/class',{
        templateUrl: "template/class/class-list.html",
        controller: "ClassController"
    }).when('/admin/class/add',{
        templateUrl: "template/class/class-add.html",
        controller: "ClassController"
    }).when('/admin/class/update',{
        templateUrl: "template/class/class-update.html",
        controller: "ClassController"

        // Student
    }).when('/admin/createstudent',{
    templateUrl: "template/student/create_student.html",
    controller: "StudentController"
     }).when('/admin/student',{
    templateUrl: "template/student/student.html",
    controller: "StudentController"
     }).when('/admin/studentup/:id',{
    templateUrl: "template/student/update_student.html",
    controller: "StudentController"

   }).when('/admin/createfacilitator',{
    templateUrl: "template/facilitator/create_facilitator.html",
    controller: "FacilitatorController"
     }).when('/admin/facilitator',{
    templateUrl: "template/facilitator/facilitator.html",
    controller: "FacilitatorController"
     }).when('/admin/updatefacilitator/:id',{
    templateUrl: "template/facilitator/update_facilitator.html",
    controller: "FacilitatorController"

    // URL Path Not Found
    }).when('/home',{
      templateUrl: 'template/home.html',
      controller: 'userCtrl'
    }).otherwise({
        redirectTo: '/home'
    });
    //category
    $routeProvider.when('/admin/category/create',{
      // resolve:{
      //   "check": function($location,$rootScope){
      //     if(!$rootScope.loggedIn){
      //       $location.path('/admin');
      //     }
      //   }
      // },
      templateUrl: "template/category/create.html",
      controller: "categoryCtl"
    }).when('/admin/category',{
      templateUrl: "template/category/category.html",
      controller: "categoryCtl"
    }).when('/admin/category/update/:id',{
      templateUrl: 'template/category/update.html',
      controller: 'categoryCtl'
    });
    //schedule
    $routeProvider.when('/admin/schedule',{
      templateUrl:'template/schedule/schedule.html',
      controller: 'categoryCtl'
    }).when('/admin/schedule/update/:id',{
      templateUrl: 'template/schedule/update.html',
      controller: 'categoryCtl'
    }).when('/admin/schedule/create',{
      templateUrl: 'template/schedule/create.html',
      controller: 'categoryCtl'
    });
});
