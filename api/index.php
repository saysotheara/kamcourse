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
    $date = date('Y-m-d H:i:s');
    try {
        $sql_query = "INSERT INTO kc_tbl_course (course_name,description , course_category, course_outline,study_time, start_date, schedule, lecturer, course_duration, course_fee, course_media, course_video, course_create_date, course_update_date) VALUES (:name, :description, :category, :outline, :study_time, :start_date, :schedule, :lecturer, :duration, :fee, :photo_url, :video_url, '$date', '$date')";
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql_query);

        $stmt->bindParam("name", $request->name);
        $stmt->bindParam("description", $request->description);
        $stmt->bindParam("category", $request->category);
        $stmt->bindParam("outline", $request->outline);
        $stmt->bindParam("study_time", $request->study_time);
        $stmt->bindParam("start_date", $request->start_date);
        $stmt->bindParam("schedule", $request->schedule);

        $stmt->bindParam("lecturer", $request->lecturer);
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
        $sql_query = "UPDATE kc_tbl_course SET course_name = :name, description = :description, course_category = :category, course_outline = :outline, study_time = :study_time, start_date = :start_date, schedule = :schedule, lecturer = :lecturer, course_duration = :duration, course_fee = :fee, course_media = :photo_url,course_video = :video_url, course_update_date = '$date' WHERE course_id = :id";
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql_query);
        $stmt->bindParam("id", $request->id);
        $stmt->bindParam("name", $request->name);
        $stmt->bindParam("description", $request->description);
        $stmt->bindParam("category", $request->category);
        $stmt->bindParam("outline", $request->outline);
        $stmt->bindParam("study_time", $request->study_time);
        $stmt->bindParam("start_date", $request->start_date);
        $stmt->bindParam("schedule", $request->schedule);

        $stmt->bindParam("lecturer", $request->lecturer);
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
    $sql_query = "DELETE  FROM kc_tbl_gallery WHERE id = :id";
    responseJSON_ID( $sql_query, $id);
});


$app->run();

?>
