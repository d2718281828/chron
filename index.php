<?php
?>
<!DOCTYPE html>
<html>
<head>
<title>Chron</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js" type="text/javascript" ></script>
<script LANGUAGE="javascript" src="js/moment-with-locales.js"> </script>
<script LANGUAGE="javascript" src="js/router.js"> </script>
<script LANGUAGE="javascript" src="js/routes.js"> </script>
<script LANGUAGE="javascript" src="js/chron.js"> </script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
<link rel="stylesheet" type="text/css" href="css/style.css" >
</head>
<body class="dark">
<div id="header">Celebration Time</div>
<div id="nav"></div>

<div id="intro" role="page" class="wholepage">
<p>Need an excuse to celebrate? Next birthday too far away? Let us help you find some other excuses!
Enter your birthdate (and time, if you know it), and that of your friends, and we'll find a few significant events you
may not have thought of.</p>
<div class="if-no-people">
<h1>Getting Started</h1>
Click on "Ages" above and then click on Add to add your date and time of birth. You can add as many people as you wish.
</div>
<h1>The time now</h1>
<p>Counting the seconds</p>
<p>Time now: <span class="nowtime counter"></span></p>
<p>This is the time counting in seconds since 1st January 1970, which is the way all computers count time.</p>
</div>

<div id="summary" role="page" class="wholepage">
<h1>People</h1>
<div id="addperson" class="button" data-name="">Add person</div>
<div id="personedit" class="template personeditform">
	<p>Add/Edit</p>
	<div class="formfield">
		<label for="person_name">Name</label>
		<input type="text" name="person_name" id="person_name">
	</div>
	<div class="formfield">
		<label for="person_date">Date of birth</label>
		<input type="date" name="person_date" id="person_date">
	</div>
	<div class="formfield">
		<label for="person_date">Time of birth</label>
		<input type="time" name="person_time" id="person_time">
	</div>
	<div class="formfield">
		<label for="person_isme">Check if it is me</label>
		<input type="checkbox" name="person_isme" id="person_isme">
	</div>
	<div class="formfield">
		<div id="save" class="button">Save</div>
		<div id="delete" class="button">Delete</div>
		<div id="cancel" class="button">Cancel</div>
	</div>
</div>
<div class="allages">
</div>
</div>

<div id="schedule" role="page" class="wholepage">
<h1>The Schedule</h1>
<div class="alloccasions">
</div>
</div>

<div id="about" role="page" class="wholepage">
<h1>About Chron</h1>
<p>Counting the seconds</p>
<p>Time now: <span id="nowtime"></span>
</div>

<div id="personpage" role="page" class="wholepage">
<h1 class="pagetitle">Person Page</h1>
<p>Age now:
</p>
<div class="ageslist"></div>
<h2>Major events</h2>
<div class="personschedule"></div>
</div>

</body>
</html>
