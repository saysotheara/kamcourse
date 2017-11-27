
app.config(function($routeProvider,$locationProvider){

    $routeProvider.when("/admin",{
            templateUrl:'template/login.html',
            controller: 'loginCtrl'
    }).when("/admin/course",{
            resolve:{
              "check": function($location,$cookieStore){
                if(!$cookieStore.get('loggedIn')){
                  $location.path('/admin');
                }
              }
            },
              templateUrl: "template/course/course.html",
              controller: "CourseController",
              activetab: 'course'
    }).when('/admin/create',{
      resolve:{
        "check": function($location,$cookieStore){
          if(!$cookieStore.get('loggedIn')){
            $location.path('/admin');
          }
        }
      },
        templateUrl: "template/course/create.html",
        controller: "CourseController"


    }).when('/admin/update/:id',{
      resolve:{
        "check": function($location,$cookieStore){
          if(!$cookieStore.get('loggedIn')){
            $location.path('/admin');
          }
        }
      },
        templateUrl: "template/course/update.html",
        controller: "CourseController"
    // Class Management
    }).when('/admin/class',{
      resolve:{
        "check": function($location,$cookieStore){
          if(!$cookieStore.get('loggedIn')){
            $location.path('/admin');
          }
        }
      },
        templateUrl: "template/class/class-list.html",
        controller: "ClassController",
        activetab: 'class'

    }).when('/admin/class/add',{
      resolve:{
        "check": function($location,$cookieStore){
          if(!$cookieStore.get('loggedIn')){
            $location.path('/admin');
          }
        }
      },
        templateUrl: "template/class/create.html",
        controller: "ClassController"
    }).when('/admin/class/update',{
      resolve:{
        "check": function($location,$cookieStore){
          if(!$cookieStore.get('loggedIn')){
            $location.path('/admin');
          }
        }
      },
        templateUrl: "template/class/class-update.html",
        controller: "ClassController"

        // Student
    }).when('/admin/createstudent',{
      resolve:{
        "check": function($location,$cookieStore){
          if(!$cookieStore.get('loggedIn')){
            $location.path('/admin');
          }
        }
      },
    templateUrl: "template/student/create_student.html",
    controller: "StudentController"
     }).when('/admin/student',{
       resolve:{
         "check": function($location,$cookieStore){
           if(!$cookieStore.get('loggedIn')){
             $location.path('/admin');
           }
         }
       },
    templateUrl: "template/student/student.html",
    controller: "StudentController",
    activetab: 'student'
     }).when('/admin/studentup/:id',{
       resolve:{
         "check": function($location,$cookieStore){
           if(!$cookieStore.get('loggedIn')){
             $location.path('/admin');
           }
         }
       },
    templateUrl: "template/student/update_student.html",
    controller: "StudentController"
      // facilitator
   }).when('/admin/createfacilitator',{
     resolve:{
       "check": function($location,$cookieStore){
         if(!$cookieStore.get('loggedIn')){
           $location.path('/admin');
         }
       }
     },
    templateUrl: "template/facilitator/create_facilitator.html",
    controller: "FacilitatorController"
     }).when('/admin/facilitator',{
       resolve:{
         "check": function($location,$cookieStore){
           if(!$cookieStore.get('loggedIn')){
             $location.path('/admin');
           }
         }
       },
    templateUrl: "template/facilitator/facilitator.html",
    controller: "FacilitatorController"
     }).when('/admin/updatefacilitator/:id',{
       resolve:{
         "check": function($location,$cookieStore){
           if(!$cookieStore.get('loggedIn')){
             $location.path('/admin');
           }
         }
       },
    templateUrl: "template/facilitator/update_facilitator.html",
    controller: "FacilitatorController"


  });
    //category
    $routeProvider.when('/admin/category/create',{
      resolve:{
        "check": function($location,$cookieStore){
          if(!$cookieStore.get('loggedIn')){
            $location.path('/admin');
          }
        }
      },
      templateUrl: "template/category/create.html",
      controller: "categoryCtl"
    }).when('/admin/category',{
      resolve:{
        "check": function($location,$cookieStore){
          if(!$cookieStore.get('loggedIn')){
            $location.path('/admin');
          }
        }
      },
      templateUrl: "template/category/category.html",
      controller: "categoryCtl",
      activetab: 'category'
    }).when('/admin/category/update/:id',{
      resolve:{
        "check": function($location,$cookieStore){
          if(!$cookieStore.get('loggedIn')){
            $location.path('/admin');
          }
        }
      },
      templateUrl: 'template/category/update.html',
      controller: 'categoryCtl'
    });
    //schedule
    $routeProvider.when('/admin/schedule',{
      resolve:{
        "check": function($location,$cookieStore){
          if(!$cookieStore.get('loggedIn')){
            $location.path('/admin');
          }
        }
      },
      templateUrl:'template/schedule/schedule.html',
      controller: 'categoryCtl',
      activetab: 'schedule'
    }).when('/admin/schedule/update/:id',{
      resolve:{
        "check": function($location,$cookieStore){
          if(!$cookieStore.get('loggedIn')){
            $location.path('/admin');
          }
        }
      },
      templateUrl: 'template/schedule/update.html',
      controller: 'categoryCtl'
    }).when('/admin/schedule/create',{
      resolve:{
        "check": function($location,$cookieStore){
          if(!$cookieStore.get('loggedIn')){
            $location.path('/admin');
          }
        }
      },
      templateUrl: 'template/schedule/create.html',
      controller: 'categoryCtl'
    });
    $routeProvider.when('/course',{
      templateUrl: "template/course/frontEnd/course1.html",
      controller: "userCtrl",
          activetab: 'course'
      }).when('/course/:id',{
          templateUrl: "template/course/frontEnd/detail.html",
          controller: "userCtrl"
      }).when('/home',{
        templateUrl: 'template/home.html',
        controller: 'userCtrl'
      }).otherwise({
        templateUrl:'template/Error/404.html',
        controller:'CourseController'
      });


});
