<?php

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

function getConnection() {
    try {
        $db_username = "usr_kamcourse";
        $db_password = "pwd_kamcourse";
        $conn = new PDO('mysql:host=localhost;dbname=nkk-db-kamcourse;charset=utf8', $db_username, $db_password);
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
    $sql_query = "SELECT * FROM kc_tbl_course";
    responseJSON( $sql_query );
});

$app->get('/course/:id', function($id) {
    $sql_query = "SELECT * FROM kc_tbl_course WHERE course_id = :id";
    responseJSON_ID( $sql_query, $id);
});
$app->post('/gallery',function(){

  if(!empty($_FILES['file'])){
      $ext = pathinfo($_FILES['file']['name'],PATHINFO_EXTENSION);
              $file = time().'.'.$ext;
              $image = '/web/kamcourse/asset/img/'.$file;
              move_uploaded_file($_FILES["file"]["tmp_name"],'../web/kamcourse/asset/img/'.$file);



  }else{
      $postdata = file_get_contents("php://input");
      $request = json_decode($postdata);
      $image = $request->image;
  }
  try {
    $sql_query = "INSERT INTO kc_tbl_gallery (image) VALUES (:image)";
    $dbCon = getConnection();
    $stmt = $dbCon->prepare($sql_query);

    $stmt->bindParam("image",$image);


    $stmt->execute();
    $dbCon = null;

  } catch (Exception $e) {
    echo '{"error": {"text":'. $e->getMessage() .'}}';
  }
});

$app->post('/course', function() {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    try {
        $sql_query = "INSERT INTO kc_tbl_course (course_name, course_summary, course_category, course_outline, course_duration, course_fee, course_media, course_video, course_create_date, course_update_date, course_other_info) VALUES (:name, :summary, :category, :outline, :duration, :fee, :photo_url, :video_url, :create_date, :update_date, :other_info)";
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql_query);
        $stmt->bindParam("id", $request->id);
        $stmt->bindParam("name", $request->name);
        $stmt->bindParam("summary", $request->summary);
        $stmt->bindParam("category", $request->category);
        $stmt->bindParam("outline", $request->outline);
        $stmt->bindParam("duration", $request->duration);
        $stmt->bindParam("fee", $request->fee);
        $stmt->bindParam("photo_url", $request->photo_url);
        $stmt->bindParam("video_url", $request->video_url);
        $stmt->bindParam("create_date", NOW());
        $stmt->bindParam("update_date", NOW());
        $stmt->bindParam("other_info", $request->other_info);
        $stmt->execute();
        $dbCon = null;
    }
    catch(PDOException $e) {
        echo '{"error": {"text":'. $e->getMessage() .'}}';
    }
});

$app->put('/course/:id', function($id) {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    try {
        $sql_query = "UPDATE kc_tbl_course SET course_name = :name, course_summary = :summary, course_category = :category, course_outline = :outline, course_duration = :duration, course_fee = :fee, course_media = :photo_url, course_update_date = :update_date, course_other_info = :other_info WHERE course_id = :id";
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql_query);
        $stmt->bindParam("id", $request->id);
        $stmt->bindParam("name", $request->name);
        $stmt->bindParam("summary", $request->summary);
        $stmt->bindParam("category", $request->category);
        $stmt->bindParam("outline", $request->outline);
        $stmt->bindParam("duration", $request->duration);
        $stmt->bindParam("fee", $request->fee);
        $stmt->bindParam("photo_url", $request->photo_url);
        $stmt->bindParam("video_url", $request->video_url);
        $stmt->bindParam("update_date", NOW());
        $stmt->bindParam("other_info", $request->other_info);
        $stmt->execute();
        $dbCon = null;
    }
    catch(PDOException $e) {
        echo '{"error": {"text":'. $e->getMessage() .'}}';
    }
});

$app->delete('/course/:id', function($id) {
    $sql_query = "DELETE  FROM kc_tbl_course WHERE course_id = :id";
    responseJSON_ID( $sql_query, $id);
});
$app->delete('/gallery/:id', function($id) {
    $sql_query = "DELETE  FROM kc_tbl_gallery WHERE id = :id";
    responseJSON_ID( $sql_query, $id);
});

$app->post('/student', function() {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    try {
        $sql_query = "INSERT INTO kc_tbl_student (student_firstname, student_lastname, student_phone, student_email, student_sex, student_media, student_address, student_via_platform, student_create_date, student_update_date, student_other_info) VALUES ( :fname, :lname, :phone, :email, :sex, :media, :address, :platform, :create_date, :update_date, :other_info)";
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
        $stmt->bindParam("create_date", NOW());
        $stmt->bindParam("update_date", NOW());
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

$app->get('/student/:id', function($id) {
    $sql_query = "SELECT * FROM kc_tbl_student WHERE student_id = :id";
    responseJSON_ID( $sql_query, $id);
});

$app->run();

?>
