<?php
	if($_POST){
	    echo post_to_url("http://localhost/PHP/kamcourse/api/course", $_POST);
	} else{
?>
	ADD RECORD.
	<form action="" method="post">
	<input type="text" name="name" placeholder="Name" /><br>
	<input type="text" name="email" placeholder="Email" /><br>
	<input type="hidden" name="_METHOD" value="POST" />
	<input type="submit" value="A D D" />
	</form>

<?php 
	}
?>