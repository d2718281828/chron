<?php
?>
<!DOCTYPE html>
<html>
<head>
<title>Chron</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js" type="text/javascript" ></script>
<script LANGUAGE="javascript" src="js/moment-with-locales.js"> </script>
<script LANGUAGE="javascript" src="js/router.js"></script>
<script LANGUAGE="javascript" src="js/chron.js"></script>
<script LANGUAGE="javascript" src="js/routes.js"></script>
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

<div id="occasion" role="page" class="wholepage">
<h1 class="occasiontitle">Occasion</h1>
<div class="occasionmain">
<div class="occasionwhen">
</div>
</div>
<div class="current-age-wrap">
<span class="counter big current-age"></span>
</div>
<div class="countdown">
<p><span class="clocktimetogo"></span></p>
<p><span class="secondstogo"></span> seconds to go!</p>
</div>
<div class="description">
</div>
</div>

<div id="about" role="page" class="wholepage">
<h1>About Party Time</h1>
<h2>What is a chron</h2>
<p>We needed a unit of time which is nothing to do with the Earth - as mankind leaps out to the stars,
the parochial orbital period of the third rock orbiting a G class star in the galactic suburbs will become less and less relevant.
We chose 100 million seconds. We needed a name for it. We chose <em>chron</em> (from the Greek word for time).</p>
<p>Plus, it's kinda cool to see the numbers ratcheting up and all those zeroes appearing at once.</p>
<h2>This site is nothing to do with astrology</h2>
<p>Note that the comments on this site are based on astronomical facts about the orbits of the planets, not about any astrological 
associations, which have no credible influence on the destinies of individual people.</p>

</div>

<div id="personpage" role="page" class="wholepage">
<h1 class="pagetitle">Person Page</h1>
<p>Age now:
</p>
<div class="ageslist"></div>
<h2>Major events</h2>
<div class="personschedule"></div>
</div>

<div id="saturndesc" class="templatedet">
<p>Saturnian birthdays don’t come round that often, which makes this one is pretty special.</p>
<p>How should you celebrate? Saturn was a Roman god with quite a few responsibilities, including wealth, plenty, 
agriculture and renewal. He is the only Roman deity to have a day of the week named after him. 
His festival in Roman times, the Saturnalia, is widely assumed to have been taken over by the early Christians as 
the basis for the Christmas festivities.</p>
<p>There are a lot of mythological associations for Saturn which you can use to inspire your celebration. 
You can read more about the mythological associations of 
Saturn <a href="https://en.wikipedia.org/wiki/Saturn_(mythology)">on Wikipedia</a>.</p>
<p>Astronomically, of course, the planet Saturn has a spectacular set of rings: 
it isn't the only planet to have a ring system but it is by far the biggest and most spectacular.</p>
<p>We have taken information about the orbit of Saturn 
from <a href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html">NASA</a>.</p>
<p><strong>A note about accuracy</strong>: although, for fun, on this site we calculate your age in 
Saturn years to 9 decimal places, the figure we have for the length of the year is only accurate to one hundredth 
of a day (about quarter of an hour), 
so the figure for your age in Saturn years is only actually accurate to 6 decimal places.</p>
</div>

<div id="venusdesc" class="templatedet">
Veusy stuff
</div>

</body>
</html>
