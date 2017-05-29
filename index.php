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
<script src="js/svg.js"></script>
<script src="js/hextiles.js"></script>
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
	<h2 class="formtitle">Add/Edit</h2>
	<div class="message"></div>
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

<div id="occasion2" role="page" class="wholepage">
<h1 class="occasiontitle">Occasion</h1>
<div class="occasionmain">
<div class="occasionwhen">
</div>
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
<h2>How to get started</h2>
<p>Go to <a href="#/summary">the People page</a> and click on Add person. Add the name, and the birth date and time.
If you dont know the time then it will assume noon - the middle of the day - but obviously the less accurately you 
know the actual time of birth, the less accurate the actual measures of age will be.
</p>
<h2>About Celebration Time</h2>
<p>The idea was to make it easier to celebrate things that arent connected to the calendar, by giving you
a quick reference for how old you are in a variety of measures - in seconds, in the years of other planets, and 
relative to other people that you know.</p>
<h2>This site is nothing to do with astrology</h2>
<p>Note that the comments on this site are based on astronomical facts about the orbits of the planets, not about any astrological 
associations, which have no credible influence on the destinies of individual people.</p>
<h2>At what time was I born?</h2>
<p>A lot of people don't know. It isnt recorded on your birth certificate, unless you are one of a multiple birth - twins, 
triplets or whatever - because legally, it then becomes necessary to know who was the first born.
If you had your mum's womb to yourself, as most of us did, you will probably have to ask your parents when you were born. They
may not know that accurately, since most mums (and dads) are quite busy at the time of birth with other things.</p>
<p>Ironically, given my earlier assertion that this is nothing to do with astrology, those whose parents believe in astrology
are probably more likely to have made a note of the accurate time of their birth.</p>

</div>

<div id="personpage" role="page" class="wholepage">
<h1 class="pagetitle">Person PageX</h1>
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
<p>The only planet to be given a feminine persona, <strong>Venus</strong> shines white, clad in it’s white cloudy veil, 
both in the morning and evening as the morning and evening star, the brightest object in the heavens after the Sun and Moon.</p>
<p>Similar in size to the Earth, Venus is often called the Earth’s twin planet, but if so it is truly 
Earth’s evil twin. The alluring veil in which it is clad is actually a hellish hot atmosphere, hot enough to 
melt lead, with a pressure of 90 Earth atmospheres and laced with sulphuric acid.</p>
<p>Venus’s year is shorter than Earth’s, being closer to the Sun, so it gives you more opportunities to celebrate. 
You probably want to focus more on the mythological connections than the astronomical ones, if you are looking 
for a theme to your celebration. Venus is the goddess of love.</p>
</div>

<div id="earthdesc" class="templatedet">
<h2>Isn't this the same as my birthday?</h2>
<p>This is measuring exactly when the Earth has gone one more time around the Sun. Astronomically it is called a 
<em>sidereal year</em> - because you measure it by comparing the Sun's position with the distant stars. The length of a sidereal
year isn't a whole number of days, so it can occur on the day before or after your birthday, but it is most likely
to occur some time on your birthday. 
</p>
<p>The fact that a year isn't a whole number of days is the reason why we have leap years. The number of days in a year
isnt a simple fraction of a number of days either, so it was necessary to try to approximate it. It is close to 365&frac14; days,
which is why we have a leap year mostly every 4 years, but because it isnt exactly 365&frac14; days either, more adjustments
were made.</p>
<p>The rule is that we have a leap year every 4 years, <em>unless</em> it is also a century year - so 1900 was NOT
a leap year, <em>unless</em> it is a 4-century year. So 2000 WAS a leap year, 2100 will NOT be.
</p>
</div>

<div id="chrondesc" class="templatedet">
<h2>What is a chron?</h2>
<p>We needed a unit of time which is nothing to do with the Earth - as mankind leaps out to the stars,
the parochial orbital period of the third rock orbiting a G class star in the galactic suburbs will become less and less relevant.
We chose 100 million seconds. We needed a name for it. We chose <em>chron</em> (from the Greek word for time).</p>
<h2>What is a second?</h2>
<p>A second was at one time defined by a day - a day being 24 hours, each of 60 minutes, each of 60 seconds, a second
was therefore 1/86,400th of a day. The Earth is a massive, spinning top, keeping accurate time by its very size.
</p>
<p>However, the Earth is a physical system, and subject to physical laws. The relevant law is that the angular momentum of
an object will stay constant, if the object is not subject to any torque - any twisting force. The angular momentum is the angular velocity times
the moment of inertia. The angular velocity is just how fast the earth rotates, 360&deg; in 24 hours,
which is exactly what we want to be constant, but it will only be constant if the Earth's moment of inertia remains constant.
The moment of inertia is a measure of how the mass of the Earth is distributed, how far it is from the Earth's axis of 
rotation. Unfortunately it changes, slightly. Ocean tides raise bulges in the oceans, and as the Antarctic glaciers
(which are quite close to the rotation axis) melt, the water spreads out over the ocean, further from the axis. Some continental
areas are rising, some falling.
</p>
<p>The second is now defined by an atomic clock. The definition is in terms of cycles of radiation of specific atomic
transitions. It is the same anywhere in the universe (if gravity is the same). Our current atomic clocks are accurate to
a few seconds in the age of the universe.
</p>
<p>The conclusion of all of this is that the Earth changes, and the length of day changes, slightly. Our measurement of time
is now far more accurate than the rotation of the Earth, so much so that it is necessary to add leap seconds from time to time.
</p>
</div>
</body>
</html>
