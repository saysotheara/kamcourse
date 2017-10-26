
app.config(function($routeProvider){
    $routeProvider.when("/admin/course",{
        templateUrl: "template/course/course.html",
        controller: "CourseController"
    }).when('/admin/create',{
        templateUrl: "template/course/create.html",
        controller: "CourseController"

    }).when('/admin/update/:id',{
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

    // URL Path Not Found
    }).when('/home',{
      templateUrl: 'template/home.html',
      controller: 'userCtrl'
    }).otherwise({
        redirectTo: '/home'
    });
});
