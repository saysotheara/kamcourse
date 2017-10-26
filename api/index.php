<?php

require 'Slim/Slim.php';

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

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
              $image = '/web/asset/img/'.$file;
              move_uploaded_file($_FILES["file"]["tmp_name"],'../web/asset/img/'.$file);



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

$app->put('/course/:id', function($id) {
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

$app->delete('/course/:id', function($id) {
    $sql_query = "DELETE  FROM kc_tbl_course WHERE course_id = :id";
    responseJSON_ID( $sql_query, $id);
});
$app->delete('/gallery/:id', function($id) {
    $sql_query = "DELETE  FROM kc_tbl_gallery WHERE gallery_id = :id";
    responseJSON_ID( $sql_query, $id);
});
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

$app->put('/student/:id', function($id) {
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

$app->get('/student/:id', function($id) {
    $sql_query = "SELECT * FROM kc_tbl_student WHERE student_id = :id";
    responseJSON_ID( $sql_query, $id);
});
$app->delete('/student/:id', function($id) {
    $sql_query = "DELETE FROM kc_tbl_student WHERE student_id = :id ";

    responseJSON_ID( $sql_query, $id);
});

$app->run();

?>
