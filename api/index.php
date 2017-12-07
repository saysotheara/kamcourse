<?php

require 'vendor/autoload.php';
use Slim\App;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Http\UploadedFile;
use Slim\Middleware\TokenAuthentication;
$config = [
    'settings' => [
        'displayErrorDetails' => true
    ]
];

$app = new App($config);
$authenticator = function($request, TokenAuthentication $tokenAuth){
    /**
     * Try find authorization token via header, parameters, cookie or attribute
     * If token not found, return response with status 401 (unauthorized)
     */
    $token = $tokenAuth->findToken($request);
    /**
     * Call authentication logic class
     */
    $auth = new \app\Auth();
    /**
     * Verify if token is valid on database
     * If token isn't valid, must throw an UnauthorizedExceptionInterface
     */
    $auth->getUserByToken($token);
};
/**
 * Add token authentication middleware
 */
$app->add(new TokenAuthentication([
    'path' =>   '/api/course',
    'authenticator' => $authenticator,

]));
$app->get('/apiTest',function($request, $response){
  $response->write('token');
});
$app->get('/testprs',function($request,$response){
  $response->write('Hello')->withAttribute('name','who');
});
function getConnection() {
    try {
        $db_username = "usr_kamcourse";
        $db_password = "pwd_kamcourse";
        $conn = new PDO('mysql:host=166.62.27.186;dbname=nkk-db-kamcourse;charset=utf8', $db_username, $db_password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch(PDOException $e) {
        echo 'ERROR: ' . $e->getMessage();
    }
    return null;
}

function responseJSON($sql_query) {
    try {
        $dbCon = getConnection();
        $stmt  = $dbCon->query($sql_query);
        $results = $stmt->fetchAll(PDO::FETCH_OBJ);
        $dbCon = null;
        echo json_encode($results, JSON_NUMERIC_CHECK);
    }
    catch(PDOException $e) {
        echo '{"error": {"text":'. $e->getMessage() .'}}';
    }
}

function responseJSON_ID($sql_query, $id) {
    try {
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql_query);
        $stmt->bindParam("id", $id);
        $stmt->execute();
        $results = $stmt->fetchObject();
        $dbCon = null;
        echo json_encode($results, JSON_NUMERIC_CHECK);
    }
    catch(PDOException $e) {
        echo '{"error": {"text":'. $e->getMessage() .'}}';
    }
}
$app->get('/gallery', function() {
    $sql_query = "SELECT * FROM kc_tbl_gallery";
    responseJSON( $sql_query );
});


$app->get('/course', function() {
    $sql_query = "SELECT co.course_id,co.course_name,co.course_description,co.course_outline
    ,co.course_duration,co.course_fee,co.course_cover,co.course_video,co.course_create_date
    ,co.course_update_date,co.course_other_info,cat.category_name FROM kc_tbl_course co INNER JOIN kc_tbl_course_category cat
    ON co.course_category = cat.category_id";
    responseJSON( $sql_query );
});

$app->get('/course/{id}', function($request, $response, $args) {
    $id = $args['id'];
    $sql_query = "SELECT * FROM kc_tbl_course WHERE course_id = $id";
    responseJSON_ID( $sql_query, $id);
});
$app->post('/gallery',function($request, $response){
  $file = $request->getUploadedFiles();
  // handle single input with single file upload
   $filename = $file['file'];
   if ($filename->getError() === UPLOAD_ERR_OK) {
       $extension = pathinfo($filename->getClientFilename(), PATHINFO_EXTENSION);
       $rename = time().'.'.$extension;
      $imgFile = "/web/asset/img/".$rename;
      $image = '/kamcourse'.$imgFile;
       $filename->moveTo('..'.$imgFile);
    }else{
      $postdata = file_get_contents("php://input");
      $request = json_decode($postdata);
      $image = $request->image;
    }
  try {
     $date = date('Y-m-d H:i:s');
     $sql_query = "INSERT INTO kc_tbl_gallery (gallery_image,gallery_upload_date,gallery_other_info) VALUES (:image,'$date','$date')";
     $dbCon = getConnection();
     $stmt = $dbCon->prepare($sql_query);
     $stmt->bindParam("image",$image);
     $stmt->execute();
     $dbCon = null;
     $response->write('uploaded');
   } catch (Exception $e) {
    echo '{"error": {"text":'. $e->getMessage() .'}}';
  }
});

$app->post('/course', function() {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $date = date('Y-m-d H:i:s');
    try {
        $sql_query = "INSERT INTO kc_tbl_course (course_name, course_description, course_category, course_outline, course_duration, course_fee, course_cover, course_video, course_create_date, course_update_date) VALUES (:name, :description, :category, :outline, :duration, :fee, :photo_url, :video_url, '$date', '$date')";
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql_query);
        $stmt->bindParam("name", $request->name);
        $stmt->bindParam("description", $request->description);
        $stmt->bindParam("category", $request->category);
        $stmt->bindParam("outline", $request->outline);
        $stmt->bindParam("duration", $request->duration);
        $stmt->bindParam("fee", $request->fee);
        $stmt->bindParam("photo_url", $request->photo_url);
        $stmt->bindParam("video_url", $request->video_url);
        $stmt->execute();
        $dbCon = null;
    }
    catch(PDOException $e) {
        echo '{"error": {"text":'. $e->getMessage() .'}}';
    }
});

$app->put('/course/{id}', function($request, $response, $args) {

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $date = date('Y-m-d H:i:s');
    try {
        $sql_query = "UPDATE kc_tbl_course SET course_name = :name, course_description = :description, course_category = :category, course_outline = :outline, course_duration = :duration, course_fee = :fee, course_cover = :photo_url, course_video = :video_url, course_update_date = '$date' WHERE course_id = :id";
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql_query);
        $stmt->bindParam("id", $request->id);
        $stmt->bindParam("name", $request->name);
        $stmt->bindParam("description", $request->description);
        $stmt->bindParam("category", $request->category);
        $stmt->bindParam("outline", $request->outline);
        $stmt->bindParam("duration", $request->duration);
        $stmt->bindParam("fee", $request->fee);
        $stmt->bindParam("photo_url", $request->photo_url);
        $stmt->bindParam("video_url", $request->video_url);

        $stmt->execute();
        $dbCon = null;
    }
    catch(PDOException $e) {
        echo '{"error": {"text":'. $e->getMessage() .'}}';
    }
});

$app->delete('/course/{id}', function($request, $response, $args) {
    $id = $args['id'];
    $sql_query = "DELETE  FROM kc_tbl_course WHERE course_id = $id";
    responseJSON_ID( $sql_query, $id);
});
$app->delete('/gallery/{id}', function($request, $response, $args) {
    $id = $args['id'];
    $sql_query = "DELETE  FROM kc_tbl_gallery WHERE gallery_id = $id";
    responseJSON_ID( $sql_query, $id);
});

// _________________student________________________

$app->post('/student', function() {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    //$date = date('Y-m-d H:i:s');

    try {
        $sql_query = "INSERT INTO kc_tbl_student (student_firstname, student_lastname, student_phone, student_email, student_sex, student_media, student_address, student_via_platform,student_create_date,student_update_date,student_active_date  , student_other_info) VALUES ( :fname, :lname, :phone, :email, :sex, :media, :address, :platform,:create,:updates,:active ,:other_info)";
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql_query);


        $stmt->bindParam("fname", $request->fname);
        $stmt->bindParam("lname", $request->lname);
        $stmt->bindParam("phone", $request->phone);
        $stmt->bindParam("email", $request->email);
        $stmt->bindParam("sex", $request->sex);
        $stmt->bindParam("media", $request->media);
        $stmt->bindParam("address", $request->address);
        $stmt->bindParam("platform", $request->platform);
        $stmt->bindParam("create", $request->create);
        $stmt->bindParam("updates", $request->updates);
        $stmt->bindParam("active", $request->active);
        $stmt->bindParam("other_info", $request->other_info);
        $stmt->execute();
        $dbCon = null;
    }
    catch(PDOException $e) {
        echo '{"error": {"text":'. $e->getMessage() .'}}';
    }
});

$app->put('/student/{id}', function($request, $response, $args) {

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    try {
        $sql_query = "UPDATE kc_tbl_student SET student_firstname = :fname, student_lastname = :lname, student_phone = :phone, student_email = :email, student_sex = :sex, student_media = :media, student_address = :address, student_via_platform= :platform,student_create_date=:create,student_update_date=:updates,student_active_date=:active ,student_other_info = :other_info WHERE student_id = :id";
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql_query);
        $stmt->bindParam("id", $request->id);
        $stmt->bindParam("fname", $request->fname);
        $stmt->bindParam("lname", $request->lname);
        $stmt->bindParam("phone", $request->phone);
        $stmt->bindParam("email", $request->email);
        $stmt->bindParam("sex", $request->sex);
        $stmt->bindParam("media", $request->media);
        $stmt->bindParam("address", $request->address);
        $stmt->bindParam("platform", $request->platform);
        $stmt->bindParam("create", $request->create);
        $stmt->bindParam("updates", $request->updates);
        $stmt->bindParam("active", $request->active);
        $stmt->bindParam("other_info", $request->other_info);
        $stmt->execute();
        $dbCon = null;
    }
    catch(PDOException $e) {
        echo '{"error": {"text":'. $e->getMessage() .'}}';
    }
});

$app->get('/student', function() {
    $sql_query = "SELECT * FROM kc_tbl_student";
    responseJSON( $sql_query );
});

$app->get('/student/{id}', function($request, $response, $args) {
    $id = $args['id'];
    $sql_query = "SELECT * FROM kc_tbl_student WHERE student_id = $id";
    responseJSON_ID( $sql_query, $id);
});
$app->delete('/student/{id}', function($request, $response, $args) {
    $id=$args['id'];
    $sql_query = "DELETE FROM kc_tbl_student WHERE student_id = $id ";

    responseJSON_ID( $sql_query, $id);
});

//___________facilitator___________

$app->get('/facilitator', function() {
    $sql_query = "SELECT * FROM kc_tbl_facilitator";
    responseJSON( $sql_query );
});

$app->get('/facilitator/{id}', function($request, $response, $args) {
    $id=$args['id'];
    $sql_query = "SELECT * FROM kc_tbl_facilitator WHERE facilitator_id = $id";
    responseJSON_ID( $sql_query, $id);
});

$app->post('/facilitator', function() {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    //$date = date('Y-m-d H:i:s');

    try {
        $sql_query = "INSERT INTO kc_tbl_facilitator (facilitator_firstname, facilitator_lastname, facilitator_phone, facilitator_email, facilitator_sex, facilitator_media, facilitator_address, facilitator_profile, facilitator_via_platform, facilitator_create_date, facilitator_update_date, facilitator_active_date, facilitator_other_info) VALUES ( :fname, :lname, :phone, :email, :sex, :media, :address, :profile,:platform,:create,:updates,:active ,:other_info)";
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql_query);


        $stmt->bindParam("fname", $request->fname);
        $stmt->bindParam("lname", $request->lname);
        $stmt->bindParam("phone", $request->phone);
        $stmt->bindParam("email", $request->email);
        $stmt->bindParam("sex", $request->sex);
        $stmt->bindParam("media", $request->media);
        $stmt->bindParam("address", $request->address);
        $stmt->bindParam("profile", $request->profile);
        $stmt->bindParam("platform", $request->platform);
        $stmt->bindParam("create", $request->create);
        $stmt->bindParam("updates", $request->updates);
        $stmt->bindParam("active", $request->active);

        $stmt->bindParam("other_info", $request->other_info);
        $stmt->execute();
        $dbCon = null;
    }
    catch(PDOException $e) {
        echo '{"error": {"text":'. $e->getMessage() .'}}';
    }
});

$app->put('/facilitator/:id', function($id) {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    try {
        $sql_query = "UPDATE kc_tbl_facilitator SET facilitator_firstname= :fname,facilitator_lastname=:lname,facilitator_phone= :phone,facilitator_email= :email,facilitator_sex= :sex,facilitator_media= :media,facilitator_address= :address,facilitator_profile=:profile,facilitator_via_platform=:platform,facilitator_create_date=:create,facilitator_update_date=:updates,facilitator_active_date=:active,facilitator_other_info=:other_info WHERE facilitator_id = :id";

        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql_query);
        $stmt->bindParam("id", $request->id);
        $stmt->bindParam("fname", $request->fname);
        $stmt->bindParam("lname", $request->lname);
        $stmt->bindParam("phone", $request->phone);
        $stmt->bindParam("email", $request->email);
        $stmt->bindParam("sex", $request->sex);
        $stmt->bindParam("media", $request->media);
        $stmt->bindParam("address", $request->address);
        $stmt->bindParam("platform", $request->platform);
        $stmt->bindParam("profile", $request->profile);
        $stmt->bindParam("create", $request->create);
        $stmt->bindParam("updates", $request->updates);
        $stmt->bindParam("active", $request->active);
        $stmt->bindParam("other_info", $request->other_info);
        $stmt->execute();
        $dbCon = null;
    }
    catch(PDOException $e) {
        echo '{"error": {"text":'. $e->getMessage().'}}';
    }
});

$app->delete('/facilitator/{id}', function($request, $response, $args) {
    $id=$args['id'];
    $sql_query = "DELETE FROM kc_tbl_facilitator WHERE facilitator_id = $id ";

    responseJSON_ID( $sql_query, $id);
});
//category
$app->get('/category',function(){
  $sql_query = "SELECT * FROM kc_tbl_course_category";
  responseJSON( $sql_query );
});
$app->get('/category/{id}',function($request, $response, $args){
  $id = $args['id'];
  $sql_query = "SELECT * FROM kc_tbl_course_category WHERE category_id = $id";
  responseJSON_ID( $sql_query, $id);

});
$app->post('/category',function(){
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  try {
      $sql_query = "INSERT INTO kc_tbl_course_category (category_name,category_description, category_cover, category_other_info) VALUES (:name, :description, :cover, :other_info)";
      $dbCon = getConnection();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("name", $request->name);
      $stmt->bindParam("description", $request->description);
      $stmt->bindParam("cover", $request->cover);
      $stmt->bindParam("other_info", $request->other_info);
      $stmt->execute();
      $dbCon = null;
  }
  catch(PDOException $e) {
      echo '{"error": {"text":'. $e->getMessage() .'}}';
  }
});
$app->put('/category',function(){
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  try {
      $sql_query = "UPDATE kc_tbl_course_category SET category_name= :name,category_description=:description,category_cover= :cover,category_other_info= :other_info WHERE category_id = :category_id";

      $dbCon = getConnection();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("category_id", $request->category_id);
      $stmt->bindParam("name", $request->name);
      $stmt->bindParam("description", $request->description);
      $stmt->bindParam("cover", $request->cover);
      $stmt->bindParam("other_info", $request->other_info);
      $stmt->execute();
      $dbCon = null;
  }
  catch(PDOException $e) {
      echo '{"error": {"text":'. $e->getMessage().'}}';
  }
});
$app->delete('/category/{id}',function($request, $response, $args){
  $id = $args['id'];
  $sql_query = "DELETE FROM kc_tbl_course_category WHERE category_id = $id ";
  responseJSON_ID( $sql_query, $id);

});
//schedule
$app->get('/schedule',function(){
  $sql_query = "SELECT * FROM kc_tbl_course_schedule";
  responseJSON( $sql_query );
});
$app->post('/schedule',function(){
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  try {
      $sql_query = "INSERT INTO kc_tbl_course_schedule (schedule_time,schedule_description, schedule_cover, schedule_other_info) VALUES (:schedule_time, :description, :cover, :other_info)";
      $dbCon = getConnection();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("schedule_time", $request->time);
      $stmt->bindParam("description", $request->description);
      $stmt->bindParam("cover", $request->cover);
      $stmt->bindParam("other_info", $request->other_info);



      $stmt->execute();
      $dbCon = null;
  }
  catch(PDOException $e) {
      echo '{"error": {"text":'. $e->getMessage() .'}}';
  }
});
$app->get('/schedule/{id}',function($request,$response,$args){
  $id = $args['id'];
  $sql_query = "SELECT * FROM kc_tbl_course_schedule WHERE schedule_id = $id";
  responseJSON_ID( $sql_query, $id);
});
$app->put('/schedule',function(){
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  try {
      $sql_query = "UPDATE kc_tbl_course_schedule SET schedule_time= :schedule_time,schedule_description=:description,schedule_cover= :cover,schedule_other_info= :other_info WHERE schedule_id = :schedule_id";

      $dbCon = getConnection();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("schedule_id", $request->schedule_id);
      $stmt->bindParam("schedule_time", $request->time);
      $stmt->bindParam("description", $request->description);
      $stmt->bindParam("cover", $request->cover);
      $stmt->bindParam("other_info", $request->other_info);

      $stmt->execute();
      $dbCon = null;
  }
  catch(PDOException $e) {
      echo '{"error": {"text":'. $e->getMessage().'}}';
  }
});
$app->delete('/schedule/{id}',function($request,$response,$args){
  $id = $args['id'];
  $sql_query = "DELETE FROM kc_tbl_course_schedule WHERE schedule_id = $id ";
  responseJSON_ID( $sql_query, $id);
});
//--Class
$app->post('/class',function(){
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);
  $date = date('Y-m-d H:i:s');

  try {
      $sql_query = "INSERT INTO kc_tbl_class (class_course,class_schedule,
        class_facilitator,class_status,create_date,update_date,class_start_date,class_turn)
      VALUES (:class_course, :class_schedule, :class_facilitator,:class_status,'$date','$date',:class_start_date,:class_turn)";
      $dbCon = getConnection();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("class_course", $request->class_course);
      $stmt->bindParam("class_schedule", $request->class_schedule);
      $stmt->bindParam("class_facilitator", $request->class_facilitator);
      $stmt->bindParam("class_start_date", $request->start_date);
      $stmt->bindParam("class_turn", $request->turn);
      $stmt->bindParam("class_status", $request->class_status);

      $stmt->execute();
      $dbCon = null;
  }
  catch(PDOException $e) {
      echo '{"error": {"text":'. $e->getMessage() .'}}';
  }
});
$app->get('/class',function(){
  $sql_query = "SELECT cl.class_id,cl.class_start_date,cl.class_turn,cl.class_status,cl.create_date,
  cl.update_date,co.course_name,co.course_description,co.course_fee,co.course_duration,co.course_outline,
  co.course_cover,co.course_video,s.schedule_time,f.facilitator_firstname,f.facilitator_lastname
   FROM kc_tbl_class cl inner join kc_tbl_course co on cl.class_course= co.course_id
   inner join kc_tbl_course_schedule s on cl.class_schedule=s.schedule_id
   inner join kc_tbl_facilitator f on cl.class_facilitator=f.facilitator_id";
  responseJSON( $sql_query );
});
$app->get('/class/user/{id}',function($request,$response,$args){
  $id = $args['id'];
  $sql_query = "SELECT cl.class_id,cl.class_start_date,cl.class_turn,cl.class_status,cl.create_date,
  cl.update_date,co.course_name,co.course_description,co.course_fee,co.course_duration,co.course_outline,
  co.course_cover,co.course_video,s.schedule_time,f.facilitator_firstname,f.facilitator_lastname
   FROM kc_tbl_class cl inner join kc_tbl_course co on cl.class_course= co.course_id
   inner join kc_tbl_course_schedule s on cl.class_schedule=s.schedule_id
   inner join kc_tbl_facilitator f on cl.class_facilitator=f.facilitator_id WHERE cl.class_id = $id ";
  responseJSON_ID( $sql_query, $id);
});
$app->get('/class/{id}',function($request,$response,$args){
  $id = $args['id'];
  $sql_query = "SELECT * FROM kc_tbl_class WHERE class_id = $id ";
  responseJSON_ID( $sql_query, $id);
});
$app->put('/class',function(){
  $date = date('Y-m-d H:i:s');
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  try {
      $sql_query = "UPDATE  kc_tbl_class SET class_course= :class_course,class_schedule=:class_schedule,class_facilitator= :class_facilitator,class_status= :class_status
      , class_start_date=:start_date ,class_turn=:turn,update_date= '$date' WHERE class_id = :class_id";

      $dbCon = getConnection();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("class_id", $request->class_id);
      $stmt->bindParam("class_course", $request->class_course);
      $stmt->bindParam("class_schedule", $request->class_schedule);
      $stmt->bindParam("class_facilitator", $request->class_facilitator);
      $stmt->bindParam("class_status", $request->class_status);
      $stmt->bindParam("start_date", $request->start_date);
      $stmt->bindParam("turn", $request->turn);
      $stmt->execute();
      $dbCon = null;
  }
  catch(PDOException $e) {
      echo '{"error": {"text":'. $e->getMessage().'}}';
  }
});
$app->delete('/class/{id}',function($request,$response,$args){
  $id = $args['id'];
  $sql_query = "DELETE FROM kc_tbl_class WHERE class_id = $id ";
  responseJSON_ID( $sql_query, $id);
});
$app->run();

?>
