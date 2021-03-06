<?php

require 'vendor/autoload.php';

use Slim\App;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Http\UploadedFile;
use Slim\Middleware\TokenAuthentication;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

//Load composer's autoloader
require 'mailler/vendor/autoload.php';
$config = [
    'settings' => [
        'displayErrorDetails' => true
    ]
];

$app = new App($config);

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
function configMail(){

}
function responseJSON($sql_query) {
    try {
        $dbCon = getConnection();
        $stmt  = $dbCon->query($sql_query);
        $results = $stmt->fetchAll(PDO::FETCH_OBJ);
        $dbCon = null;
        // echo json_encode($results, JSON_NUMERIC_CHECK);
        return $results;
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
        return $results;
    }
    catch(PDOException $e) {
        echo '{"error": {"text":'. $e->getMessage() .'}}';
    }
}
function vertifyEmail($email,$urlLink){

  $mail = new PHPMailer(true);                              // Passing `true` enables exceptions
  try {
    //Server settings
    $mail->SMTPDebug = 2;                                 // Enable verbose debug output
    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Username = 'khmengkhmer.it@gmail.com';                 // SMTP username
    $mail->Password = 'khmer.IT@1234';                           // SMTP password
    $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 587;                                    // TCP port to connect to
    //Recipients
    $mail->setFrom('ratanahai2468@gmail.com', 'khmeng Khmer IT');
    $mail->addAddress($email);     // Add a recipient
    //Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Register Kamcourse.';
    $mail->Body    = '<div style="width:60%;height:300px; border-top:solid 1px;" >
                      <img src="http://ppit-edu.co/images/logo.png" style="margin-left:8%;" width="500" height="150">
                      <h1 style="text-align:center;">Phnom Penh Institue of Technology </h1>
                        <p style="margin-top:2%; margin-left:5%;"> Thank you for your register! Please click vertify button to
                        comfirm your email.</p>
                        <a href="'.$urlLink.$email.'">
                      <button type="button" style="background:rgb(66, 215, 244); color:#ffff; width:80px; height:30px; text-align:center; border-bottom:solid 2px #34a4c9; margin-left:35%;
                      border-top-left-radius:6px;border-top-right-radius:6px;border-bottom-left-radius:6px;
                      border-bottom-right-radius:6px;">vertify</button></a>
                      </div>';


    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    $mail->send();
    } catch (Exception $e) {
    echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
  }
};
$app->get('/gallery', function($request, $response) {
    $sql_query = "SELECT * FROM kc_tbl_gallery";
    $data = responseJSON( $sql_query );
    return $response->withJson($data,200);
});


$app->get('/course', function($request, $response) {
    $sql_query = "SELECT co.course_id,co.course_name,co.course_description,co.course_outline
    ,co.course_duration,co.course_fee,co.course_cover,co.course_video,co.course_create_date
    ,co.course_update_date,co.course_other_info,cat.category_name FROM kc_tbl_course co INNER JOIN kc_tbl_course_category cat
    ON co.course_category = cat.category_id";
    $data = responseJSON( $sql_query );
    return $response->withJson($data,200);
});

$app->get('/course/{id}', function($request, $response, $args) {
    $id = $args['id'];
    $sql_query = "SELECT * FROM kc_tbl_course WHERE course_id = $id";
    $data = responseJSON_ID( $sql_query, $id);
    return $response->withJson($data,200);
});
$app->post('/gallery',function($request, $response){
  $file = $request->getUploadedFiles();
  // handle single input with single file upload
   $filename = $file['file'];
   if ($filename->getError() === UPLOAD_ERR_OK) {
       $extension = pathinfo($filename->getClientFilename(), PATHINFO_EXTENSION);
       $rename = time().'.'.$extension;
      $imgFile = "/web/asset/img/".$rename;
      $image = $imgFile;
       $filename->moveTo('..'.$imgFile);

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
    $data = responseJSON_ID( $sql_query, $id);
    return $response->withJson($data,200);
});
$app->delete('/gallery/{id}', function($request, $response, $args) {
    $id = $args['id'];
    $sql_query = "DELETE  FROM kc_tbl_gallery WHERE gallery_id = $id";
    $data = responseJSON_ID( $sql_query, $id);
    return $response->withJson($data,200);
});

// _________________student________________________

$app->post('/student', function($request,$response) {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    $date = date('Y-m-d H:i:s');

    try {
        $sql_query = "INSERT INTO kc_tbl_student (student_firstname, student_lastname,
          student_phone,student_email,student_pass, student_create_date, student_update_date) VALUES
         ( :student_firstname, :student_lastname, :student_phone, :student_email,:password,'$date','$date')";
        $dbCon = getConnection();
        $stmt = $dbCon->prepare($sql_query);
        $stmt->bindParam("student_firstname", $request->fname);
        $stmt->bindParam("student_lastname", $request->lname);
        $stmt->bindParam("student_phone", $request->phone);
        $stmt->bindParam("student_email", $request->email);
        $stmt->bindParam("password", $request->password);


        $stmt->execute();
        $results = $dbCon->lastInsertId();
        $dbCon = null;

        return $response->withJson($results,200);
    }
    catch(PDOException $e) {
        $data = '{"error": {"text":'. $e->getMessage() .'}}';
        return $response->withJson($data,500);
    }
});
$app->post('/check/register',function($request,$response){
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);
  try {
      $sql_query = "SELECT student_email FROM kc_tbl_student WHERE student_email = :student_email";
      $dbCon = getConnection();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("student_email", $request->email);
      $stmt->execute();
      $results = $stmt->fetchObject();
      $dbCon = null;
  }
  catch(PDOException $e) {
      echo '{"error": {"text":'. $e->getMessage() .'}}';
  }
  if($results){
    return $response->withJson('true',200);
  }


});

$app->post('/student/{id}', function($request, $response, $args) {
    $id = $args['id'];
    $date = date('Y-m-d H:i:s');
    $profile= $request->getUploadedFiles();
    $fname = $request->getParam('fname');
    $lname = $request->getParam('lname');
    $phone = $request->getParam('phone');
    $email = $request->getParam('email');
    $sex = $request->getParam('sex');
    $birth = $request->getParam('birth');
    $address = $request->getParam('address');
    $dbCon = getConnection();
     if($profile){
       $filename = $profile['file'];
       if ($filename->getError() === UPLOAD_ERR_OK) {
          $extension = pathinfo($filename->getClientFilename(), PATHINFO_EXTENSION);
          $rename = time().'.'.$extension;
          $imgFile = "/web/asset/img/profile/".$rename;
          $image = $imgFile;
          $filename->moveTo('..'.$imgFile);
          $sql_query = "UPDATE kc_tbl_student SET student_firstname = :fname, student_lastname = :lname, student_phone = :phone, student_email = :email, student_sex = :sex, student_address = :address,student_update_date = '$date',student_cover = :cover,student_birth = :birth WHERE student_id = :id";
          $stmt = $dbCon->prepare($sql_query);
          $stmt->bindParam("cover", $image);
        }
      }else {
        $sql_query = "UPDATE kc_tbl_student SET student_firstname = :fname, student_lastname = :lname, student_phone = :phone, student_email = :email, student_sex = :sex, student_address = :address,student_update_date = '$date',student_birth = :birth WHERE student_id = :id";
        $stmt = $dbCon->prepare($sql_query);
      }

    try {
        $stmt->bindParam("id", $id);
        $stmt->bindParam("fname",$fname);
        $stmt->bindParam("lname",$lname);
        $stmt->bindParam("phone",$phone);
        $stmt->bindParam("email",$email);
        $stmt->bindParam("sex",$sex);
        $stmt->bindParam("birth",$birth);
        $stmt->bindParam("address",$address);
        $stmt->execute();
        $dbCon = null;
        return $response->withJson('update',200);
    }
    catch(PDOException $e) {
        return $response->withJson('{"error": {"text":'. $e->getMessage() .'}}',400);
    }
});

$app->get('/student', function($request,$response) {
    $sql_query = "SELECT * FROM kc_tbl_student";
    $data = responseJSON( $sql_query );
    return $response->withJson($data,200);
});

$app->get('/student/{id}', function($request, $response, $args) {
    $id = $args['id'];
    $sql_query = "SELECT * FROM kc_tbl_student WHERE student_id = $id";
    $data = responseJSON_ID( $sql_query, $id);
    return $response->withJson($data,200);
});
$app->delete('/student/{id}', function($request, $response, $args) {
    $id=$args['id'];
    $sql_query = "DELETE FROM kc_tbl_student WHERE student_id = $id ";
    $data = responseJSON_ID( $sql_query, $id);
    return $response->withJson($data,200);
});
$app->post('/students/join',function($request,$response){
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);
  $date = date('Y-m-d H:i:s');
  try {
      $sql_query = "SELECT * FROM kc_tbl_student_history WHERE history_class_id = :classID and history_student_id = :studentID";
      $dbCon = getConnection();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("studentID", $request->studentID);
      $stmt->bindParam("classID", $request->classID);
      $stmt->execute();
      $results = $stmt->fetchAll(PDO::FETCH_OBJ);
      $dbCon = null;
      if(!empty($results)){
          return $response->withJson('0',200);
      }else {
        joinClass($request->studentID,$request->classID);
          return $response->withJson('1',200);
      }
  }
  catch(PDOException $e) {
      echo '{"error": {"text":'. $e->getMessage() .'}}';
  }
});
function joinClass($studentID,$classID){
  $date = date('Y-m-d H:i:s');
  try {
      $sql_query = "INSERT INTO kc_tbl_student_history (history_student_id,history_class_id,history_enroll_date)
       VALUES (:studentID, :classID,'$date')";
      $dbCon = getConnection();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("studentID", $studentID);
      $stmt->bindParam("classID", $classID);
      $stmt->execute();
      $dbCon = null;
  }
  catch(PDOException $e) {
      echo '{"error": {"text":'. $e->getMessage() .'}}';
  }
};
$app->get('/students/join/{id}',function($request,$response,$args){
    $studentID = $args['id'];
    $sql_query = "SELECT hs.history_id,hs.history_class_id,hs.history_enroll_date,cl.class_start_date,cl.class_course,
                  cl.class_turn,co.course_name,co.course_description,co.course_fee,co.course_cover FROM kc_tbl_student_history hs inner Join
                  kc_tbl_class cl on hs.history_class_id = cl.class_id inner join kc_tbl_course co on cl.class_course = co.course_id
                  WHERE hs.history_student_id = $studentID  ";

    $data = responseJSON( $sql_query );
    return $response->withJson($data,200);
});


$app->post('/auth/student',function($request,$response,$args){
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);
  try{
  $sql_query = "SELECT student_id FROM kc_tbl_student WHERE student_email = :email AND student_pass =:password  ";
  $dbCon = getConnection();
  $stmt = $dbCon->prepare($sql_query);
  $stmt->bindParam("email", $request->username);
  $stmt->bindParam("password", $request->password);
  $stmt->execute();
  $data  = $stmt->fetchObject();
  $dbCon = null;
  return $response->withJson($data,200);
}
catch(PDOException $e) {
  return $response->withJson('{"error": {"text":'. $e->getMessage() .'}}',400);
}

});
$app->post('/user/vertify',function($request,$response,$args){

  $postdata = file_get_contents("php://input");
  $requestData = json_decode($postdata);
  try {
    $sql_query = "INSERT INTO kc_tbl_vertify (student_id,email,comfirm) VALUES(:student_id,:email,0)";
    $dbCon = getConnection();
    $stmt = $dbCon->prepare($sql_query);
    $stmt->bindParam("student_id", $requestData->studentID);
    $stmt->bindParam("email", $requestData->email);

    $stmt->execute();
    $dbCon = null;
    $urlLink = explode('/api',$request->getUri()->getBaseUrl())[0].'/web/#!/comfirm/';
    vertifyEmail($requestData->email,$urlLink);
  } catch (PDOException $e) {
    echo '{"error": {"text":'. $e->getMessage() .'}}';
  }

});
$app->post('/vertified',function($request,$response,$args){
  $postdata = file_get_contents("php://input");
  $requestData = json_decode($postdata);
  try {
    $dbCon = getConnection();

    $sql_query = "SELECT email FROM kc_tbl_vertify WHERE email = :email";
    $stmt = $dbCon->prepare($sql_query);
    $stmt->bindParam("email", $requestData->email);
    $stmt->execute();
    $data  = $stmt->fetchObject();
    $dbCon = null;
  } catch (PDOException $e) {
    echo '{"error": {"text":'. $e->getMessage() .'}}';
  }
  if($data){
    try {
      $dbCon = getConnection();

      $sql_query = "UPDATE kc_tbl_vertify SET comfirm = '1' WHERE email = :email";
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("email", $requestData->email);
      $stmt->execute();
      $dbCon = null;
      return $response->withJson('true',200);
    } catch (PDOException $e) {
      echo '{"error": {"text":'. $e->getMessage() .'}}';
    }
  }
});

//___________facilitator___________

$app->get('/facilitator', function($request,$response) {
    $sql_query = "SELECT * FROM kc_tbl_facilitator";
    $data = responseJSON( $sql_query );
    return $response->withJson($data,200);
});

$app->get('/facilitator/{id}', function($request, $response, $args) {
    $id=$args['id'];
    $sql_query = "SELECT * FROM kc_tbl_facilitator WHERE facilitator_id = $id";
    $data = responseJSON_ID( $sql_query, $id);
    return $response->withJson($data,200);
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
    $data = responseJSON_ID( $sql_query, $id);
    return $response->withJson($data,200);
});
//category
$app->get('/category',function($request,$response){
  $sql_query = "SELECT * FROM kc_tbl_course_category";
  $data = responseJSON( $sql_query );
  return $response->withJson($data,200);
});

$app->get('/category/{id}',function($request, $response, $args){
  $id = $args['id'];
  $sql_query = "SELECT * FROM kc_tbl_course_category WHERE category_id = $id";
  $data = responseJSON_ID( $sql_query, $id);
  return $response->withJson($data,200);

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
$app->get('/schedule',function($request,$response){
  $sql_query = "SELECT * FROM kc_tbl_course_schedule";
  $data = responseJSON( $sql_query );
  return $response->withJson($data,200);
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
  $data = responseJSON_ID( $sql_query, $id);
  return $response->withJson($data,200);
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
  $data = responseJSON_ID( $sql_query, $id);
  return $response->withJson($data,200);
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
$app->get('/class',function($request,$response){
  $date = date('Y-m-d H:i:s');
  $sql_query = "SELECT cl.class_id,cl.class_start_date,cl.class_turn,cl.class_status,cl.create_date,
  cl.update_date,co.course_name,co.course_category,co.course_description,co.course_fee,co.course_duration,
  co.course_outline,co.course_cover,co.course_video,s.schedule_time,f.facilitator_firstname,f.facilitator_lastname
   FROM kc_tbl_class cl inner join kc_tbl_course co on cl.class_course= co.course_id
   inner join kc_tbl_course_schedule s on cl.class_schedule=s.schedule_id
   inner join kc_tbl_facilitator f on cl.class_facilitator=f.facilitator_id order by cl.update_date desc  ";
  $data = responseJSON( $sql_query );
  return $response->withJson($data,200);
});
$app->get('/class/user/{id}',function($request,$response,$args){
  $id = $args['id'];
  $sql_query = "SELECT cl.class_id,cl.class_start_date,cl.class_turn,cl.class_status,cl.create_date,
  cl.update_date,co.course_name,co.course_category,co.course_description,co.course_fee,
  co.course_duration,co.course_outline,
  co.course_cover,co.course_video,s.schedule_time,f.facilitator_firstname,f.facilitator_lastname
   FROM kc_tbl_class cl inner join kc_tbl_course co on cl.class_course= co.course_id
   inner join kc_tbl_course_schedule s on cl.class_schedule=s.schedule_id
   inner join kc_tbl_facilitator f on cl.class_facilitator=f.facilitator_id WHERE cl.class_id = $id ";
  $data = responseJSON_ID( $sql_query, $id);
  return $response->withJson($data,200);
});
$app->get('/class/{id}',function($request,$response,$args){
  $id = $args['id'];
  $sql_query = "SELECT * FROM kc_tbl_class WHERE class_id = $id ";
  $data = responseJSON_ID( $sql_query, $id);
  return $response->withJson($data,200);
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
$app->get('/class/category/{categoryId}',function($request,$response,$args){
  $categoryId = $args['categoryId'];
  $sql_query =" SELECT cl.class_id,cl.class_start_date,cl.class_turn,cl.class_status,cl.create_date,
    cl.update_date,co.course_name,co.course_description,co.course_fee,co.course_duration,co.course_outline,
    co.course_cover,co.course_video,co.course_category,s.schedule_time,f.facilitator_firstname,f.facilitator_lastname
     FROM kc_tbl_class cl inner join kc_tbl_course co on cl.class_course= co.course_id
     inner join kc_tbl_course_schedule s on cl.class_schedule=s.schedule_id
     inner join kc_tbl_facilitator f on cl.class_facilitator=f.facilitator_id WHERE co.course_category = $categoryId";
    $data = responseJSON( $sql_query );
      return $response->withJson($data,200);
});
$app->delete('/class/{id}',function($request,$response,$args){
  $id = $args['id'];
  $sql_query = "DELETE FROM kc_tbl_class WHERE class_id = $id ";
  $data = responseJSON_ID( $sql_query, $id);
  return $response->withJson($data,200);


});

$app->post('/user',function(){
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);
  $date = date('Y-m-d H:i:s');

  try {
      $sql_query = "INSERT INTO kc_tbl_user (user_name,user_email,
        user_phone,user_study_time,class_id,user_sex,create_date)
      VALUES (:user_name,:user_email,:user_phone,:user_study_time,:class_id,:user_sex,'$date')";
      $dbCon = getConnection();
      $stmt = $dbCon->prepare($sql_query);
      $stmt->bindParam("user_name", $request->name);
      $stmt->bindParam("user_sex", $request->sex);
      $stmt->bindParam("user_email", $request->email);
      $stmt->bindParam("user_phone", $request->phone);
      $stmt->bindParam("user_study_time", $request->studyTime);
      $stmt->bindParam("class_id", $request->classId);
      $stmt->execute();
      $dbCon = null;
  }
  catch(PDOException $e) {
      echo '{"error": {"text":'. $e->getMessage() .'}}';
  }
});
//users
$app->get('/popular/class',function($request,$response){
  $sql_query = "SELECT cl.class_id,cl.class_start_date,cl.class_turn,cl.class_status,cl.create_date,
    cl.update_date,co.course_name,co.course_category,co.course_description,
    co.course_fee,co.course_duration,co.course_outline,
    co.course_cover,co.course_video,s.schedule_time,f.facilitator_firstname,f.facilitator_lastname
    FROM kc_tbl_class cl inner join kc_tbl_course co on cl.class_course= co.course_id
    inner join  kc_tbl_course_schedule s on cl.class_schedule=s.schedule_id
    inner join  kc_tbl_facilitator f on cl.class_facilitator=f.facilitator_id
    inner join  kc_tbl_student_history h on cl.class_id = h.history_class_id
    group by h.history_class_id order by count(h.history_class_id) desc";
  $data = responseJSON( $sql_query );
  return $response->withJson($data,200);
});
$app->get('/recommend/course/{categoryId}',function($request,$response,$args){
  $categoryId = $args['categoryId'];
  $sql_query = "SELECT cl.class_id,cl.class_start_date,cl.class_turn,cl.class_status,cl.create_date,
    cl.update_date,co.course_name,co.course_description,co.course_fee,co.course_duration,co.course_outline,
    co.course_cover,co.course_video,s.schedule_time,f.facilitator_firstname,f.facilitator_lastname
    FROM kc_tbl_class cl inner join kc_tbl_course co on cl.class_course= co.course_id
    inner join  kc_tbl_course_schedule s on cl.class_schedule=s.schedule_id
    inner join  kc_tbl_facilitator f on cl.class_facilitator=f.facilitator_id
    where co.course_category = $categoryId order by cl.create_date desc";
    $data = responseJSON( $sql_query );
    return $response->withJson($data,200);
});
$app->post('/contact',function($request,$response){
  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);
  $date = date('Y-m-d H:i:s');
  try {
    $sql_query = "INSERT INTO kc_tbl_contact (name,email,phone,comment,create_date)
    VALUES (:name,:email,:phone,:comment,'$date')";
    $dbCon = getConnection();
    $stmt = $dbCon->prepare($sql_query);
    $stmt->bindParam("name", $request->name);
    $stmt->bindParam("email", $request->email);
    $stmt->bindParam("phone", $request->phone);
    $stmt->bindParam("comment", $request->comment);
    $stmt->execute();
    $dbCon = null;
    return $response->withJson('true',200);
  } catch (PDOException $e) {
      echo '{"error": {"text":'. $e->getMessage() .'}}';
  }

});
$app->run();


?>
