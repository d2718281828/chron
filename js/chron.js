/* 
STATUS
routing in and most bugs ironed out.
TODO
*/
(function($){
	/**
	* Format an integer adding commas.
	*/
	function formatNum(n){
		return (""+n).replace(/(\d)(?=(\d{3})+$)/g, '$1,');
	}
	function formatDec(n,places){
		return n.toLocaleString("en-GB",{minimumFractionDigits: places});
	}
	function formatLink(tab,text){
		var html = '<span class="link"><a href="#/'+tab+'">'+text+'</a></span>';
		return html;
	}
	function formatDateDiff(d){
		var units = [" years, "," months, "," days, "," hours, "," minutes, "," seconds."];
		var unit = [" year, "," month, "," day, "," hour, "," minute, "," second."];
		var m="";
		var sig = false;
		for (var k=0; k<6; k++){
			if (d[k]>0) sig=true;
			if (sig) m=m+d[k]+(d[k]==1 ? unit[k] : units[k]);
		}
		return m;
	}
	/**
	* Gives an array of numbers of time from b to a.
	* @param a,b both Moment objects.
	*/
	function dateDiff(a,b){
		var borrow = [0,12,-1, 24,60,60];
		var aa = dateArray(a);
		var bb = dateArray(b);
		var ans = [0,0,0,0,0,0];
		
		var carry = 0;
		for (var k=5; k>=0; k--){
			var x = aa[k] - bb[k]-carry;
			if (x<0) {
				carry = 1;
				x = x + (k==2 ? daysInMonth(bb[0],bb[1]) : borrow[k]);
			} else carry = 0;
			ans[k] = x;
		}
		return ans;
	}
	/**
	* Month starts with 0
	*/
	function daysInMonth(year,month){
		var days = [31,28,31,30,31,30,31,31,30,31,30,31];
		if (month!=1) return days[month];
		return 28 + ((year%4 == 0) ? 1 : 0) - ((year%100 == 0) ? 1 : 0) + ((year%400 == 0) ? 1 : 0);
	}
	/**
	* Convert moment object to array of 6 numbers - years, months etc.
	*/
	function dateArray(a){
		return [a.year(), a.month(), a.date(), a.hours(), a.minutes(), a.seconds()];
	}
	/**
	* generate list of fractions (halves, thirds, quarters, tenths) between two numbers a and b (a<b)
	* @param a,b, real numbers > 0
	* @param extra boolean true if you wantt more fractions, like 6th and 12ths and 20ths
	* $return list of 4-ples [realnumber, magnitude, label, html], not sorted, but unique - same real number wont repeat
	* 		Magnitude indicator of how rare the number is. integers - 0, multiples of 10 - 2, multiples of 100 - 4
	*			halves, thirds, quarters - -1. tenths - -2.
	*       Label - URI friendly way of referring to the number. for tenths, just decimal e.g. 3.4; for 3 and a quarter: 13-4.
	*		HTML - html for the fraction symbol.
	*		
	* The returned list could be empty, e.g. fractList(3.44, 3.45).
	* The list includes a and b if they are themselves such fractions.
	*/
	function fractList(a,b,extra){
		var res = intList(a,b);
		res = res.concat(intFracList(a*2,b*2, 2, [1], -1));
		res = res.concat(intFracList(a*3,b*3, 3, [1,2], -1));
		res = res.concat(intFracList(a*4,b*4, 4, [1,3], -1));
		res = res.concat(intFracList(a*10,b*10, 10, [1,2,3,4,6,7,8,9], -2));
		if (extra){
			res = res.concat(intFracList(a*6,b*6, 6, [1,5], -1));
			res = res.concat(intFracList(a*8,b*8, 8, [1,3,5,7], -1));
			res = res.concat(intFracList(a*12,b*12, 12, [1,5,7,11], -2));
			res = res.concat(intFracList(a*20,b*20, 20, [1,3,7,9,11,13,17,19], -2));			
		}
		return res;
	}
	// integers
	function intList(a,b){
		var res = [];
		var mag;
		for (var k=Math.ceil(a); k<=b; k++) {
			mag = (k%10 == 0 ?2:0)+(k%100 == 0 ?2:0)+(k%1000 == 0 ?2:0)+(k%10000 == 0 ?2:0);
			res.push([k, mag, k+"", k+"" ]);
		}
		return res;
	}
	// fraction bits
	function intFracList(a,b,denum,mods,mag){
		var res = [];
		for (var k=Math.ceil(a); k<=b; k++) {
			if (mods.indexOf(k%denum)>=0){
				res.push([k/denum, mag, k+"-"+denum, fracHTML(k,denum) ]);
			}
		}
		return res;
	}
	function fracHTML(n,d){
		if (d==10 || d==20) return ''+n/d;
		var whole = Math.floor(n/d);
		if (whole==0) whole='';		// you dont say 0½
		// &fracts are only define for single digit denoms
		if (d>10){
			var st = ' style="font-size:60%;"';
			return whole + '<sup'+st+'>'+(n%d)+'</sup>&frasl;<sub'+st+'>'+d+'</sub>';
		}
		return whole+"&frac"+(n%d)+''+d+';';
	}
	// Classes ================================================================================
	// person Class
	function person(name,birthutc){
		this.update(name,birthutc);
	}
	person.prototype.update = function(name,birthutc){
		//TODO also translate non-alphameric - this needs to be a valid class name and url.
		this.id = name.toLowerCase();
		this.id = this.id.replace(/[^A-Za-z0-9]/, "_");
		this.name = name;
		this.birthutc = birthutc;
		this.birth = moment(birthutc);
		this.birthsec = this.birth.unix();
		console.log("IDS ",this.name, this.id);
	}
	person.prototype.setChronicle = function(c){
		this.chronicle = c;
		this.chronsize = c.chronsize;
		// this.setupSchedule();
	}
	person.prototype.url = function(){
		return "#/person/"+this.id;
	}
	person.prototype.setAge = function(nowtime){
		var age = nowtime-this.birthsec;
		
		var html = formatNum(age.toFixed(0));
		this.age_sec = age;
		this.age_sec_f = html;
		
		// does this really below here? - it is agespage specific
		// it belongs in the agespage tick.
		// this.f_age.html(html);
		
	}
	person.prototype.setupSchedule = function(){
		console.log("Setting up newfangled schedule for "+this.name);
		var that = this;
		var nowtime = Math.floor(new Date().getTime() / 1000);
		var age = nowtime-this.birthsec;
		var sched = [];
		this.chronicle.eventTypes.forEach(function(evtype){
			console.log("---- creating schedule for "+that.name,evtype);
			sched = sched.concat(evtype.makeSchedule(age,age+100000000,that));
		});
		this.schedule = sched.sort(function(a,b){
			return (a.occtime<b.occtime) ? -1 : (a.occtime>b.occtime ? 1 : 0);
		});
	}
	person.prototype.nextOccasion = function(){
		if (this.schedule.length==0) return "No schedule yet";
		return this.schedule[0].html();
	}
	person.prototype.getOccasion = function(eventid){
		for (var k=0; k<this.schedule.length; k++){
			var res = this.schedule[k];
			if (res.id()==eventid) return res;
		}
		return null;
	}
	person.prototype.toArray = function(){
		return ["person",this.name,this.birthutc];
	}
	// occasion (proto)types
	BaseOccasion = {
		occLabel: "thingy",
		occLabels: "thingies",
		
		ageHtml: function(agesec){
			return '<span class="counter '+this.code+'_f_age"></span> '+this.occLabels;
		},		
		label: function(willbe){
			return willbe+' '+this.occLabels;
		},
		ageUnits: function(agesec){
			return agesec/this.duration;
		},
		ageFormatted: function(agesec){
			return formatDec(this.ageUnits(agesec),this.decPlaces);
		},
		makeSchedule: function(agefrom,ageto,person){
			var that = this;
			var sched = [];
			var candidates = fractList(agefrom/this.duration, ageto/this.duration, false);
			candidates.forEach(function(candidate){
				var mag = candidate[1]+that.baseMag;
				if (mag>=0){
					var occ=new occasion(person.birthsec+candidate[0]*that.duration,person,candidate[3]);
					occ.magnitude = mag;
					occ.typeLabel = candidate[2];
					occ.type = that;
					sched.push(occ);
				}
			});
			return sched;
		},
		relevantTo: function(person){
			return true;
		},
		// For most types this is a null operation, it's only for the person ages
		showAgeElement: function(person){
			
		},
		personDependent: function(){
			return false;
		}
	}
	RelativeTime = $.extend({},BaseOccasion,{
		code:"rt",
		base: null,
		label: function(willbe){
			return (willbe)+' times the age of '+this.base.name;
		},
		timeformat: function(){
			return "dddd, MMMM Do YYYY, h:mm:ss a";
		},
		ageHtml: function(agesec){
			return '<span class="'+this.code+'_wrap_age"><span class="counter '+this.code+'_f_age"></span> '+this.occLabels+'</span>';
		},		
		ageUnits: function(agesec){
			return agesec/this.base.age_sec;
		},
		ageFormatted: function(agesec){
			var units = this.ageUnits(agesec);
			if (units>10) return formatDec(units,7);
			if (units>3) return formatDec(units,8);
			return formatDec(units,9);
		},
		setBase: function(pers){
			this.base = pers;
			this.code = "rt-"+pers.id;
			this.occLabels = "times the age of "+pers.name;
		},
		relevantTo: function(person){
			//console.log("relevant to", person,  person && (person.id!=this.base.id));
			return (person && (person.id!=this.base.id));
		},
		// Hide the age if relative to yourself
		showAgeElement: function(person){
			var $sect = $('.'+this.code+'_wrap_age');
			if (this.relevantTo(person)) $sect.show();
			else $sect.hide();
		},
		makeSchedule: function(agefrom,ageto,person){
			var that = this;
			var sched = [];
			var relfrom = agefrom/this.base.age_sec;		// current age relative to base person
			var relto = ageto/(this.base.age_sec+ageto-agefrom);	// advance base age by same amount
			if (relfrom>relto){		// swap so relfrom is lower
				var x = relfrom;
				relfrom = relto;
				relto = x;
			}
			var candidates = fractList(relfrom, relto,true);
			console.log("-----Relative time "+relfrom+" "+relto,candidates);
			candidates.forEach(function(candidate){
				// factor 4 means fractions are all ignored, facttor 2 means higher fractions are ignored
				var fractfactor = candidate[0]<2 ? 1 : (candidate[0]>4 ? 4 : 2);
				var mag = fractfactor*candidate[1]+that.baseMag;
				if (mag>=0){
					var when = (candidate[0]*that.base.birthsec - person.birthsec) / (candidate[0]-1);
					var occ=new occasion(when,person,candidate[3]);
					occ.magnitude = mag;
					occ.typeLabel = candidate[2];
					occ.type = that;
					sched.push(occ);
				}
			});
			return sched;
		},
		baseMag: 3,
		personDependent: function(){
			return true;
		}
	});
	SecondsTime = $.extend({},BaseOccasion,{
		code:"sc",
		occLabel: "second",
		occLabels: "seconds",
		
		label: function(willbe){
			return (willbe)+' chrons';
		},
		timeformat: function(){
			return "dddd, MMMM Do YYYY, h:mm:ss a";
		},
		ageUnits: function(agesec){
			return agesec;
		},
		ageFormatted: function(agesec){
			return formatNum(this.ageUnits(agesec).toFixed(0));
		},
		duration: 100000000,
		labelsize: 10000000,
		descid: 'chrondesc',
		baseMag: 2
	});
	DaysTime = $.extend({},BaseOccasion,{
		code:"dy",
		occLabel: "day",
		occLabels: "days",
		
		timeformat: function(){
			return "dddd, MMMM Do YYYY";
		},
		decPlaces: 5,
		duration: 86400,
		labelsize: 1,
		baseMag: -4
	});
	BasePlanet = $.extend({},BaseOccasion,{
		timeformat: function(){
			return "dddd, MMMM Do YYYY, h:mm:ss a";
		}
	});
	MercuryYears = $.extend({},BasePlanet,{
		code:"me",
		occLabel: "Mercurian year",
		occLabels: "Mercurian years",
		decPlaces: 7,
		duration: 87.969 * 86400,	// https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html
		labelsize: 1,
		baseMag: 0
	});
	VenusYears = $.extend({},BasePlanet,{
		code:"ve",
		occLabel: "Venusian year",
		occLabels: "Venusian years",
		decPlaces: 7,
		duration: 224.701 * 86400,	// https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html	
		labelsize: 1,
		descid: "venusdesc",
		baseMag: 0
	});
	EarthYears = $.extend({},BasePlanet,{
		code:"er",
		occLabel: "Earth year",
		occLabels: "Earth years",
		decPlaces: 7,
		duration: 365.25636 * 86400,	// https://en.wikipedia.org/wiki/Sidereal_year
		labelsize: 1,
		descid: "earthdesc",
		baseMag: 1
	});
	MarsYears = $.extend({},BasePlanet,{
		code:"ma",
		occLabel: "Martian year",
		occLabels: "Martian years",
		decPlaces: 7,
		duration: 686.980 * 86400,	// https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html
		labelsize: 1,
		baseMag: 1
	});
	JupiterYears = $.extend({},BasePlanet,{
		code:"ju",
		occLabel: "Jovian year",
		occLabels: "Jovian years",
		decPlaces: 8,
		duration: 4332.589 * 86400,	// https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html
		labelsize: 1,
		baseMag: 3
	});
	SaturnYears = $.extend({},BasePlanet,{
		code:"sa",
		occLabel: "Saturnian years",
		occLabels: "Saturnian years",
		decPlaces: 9,
		duration: 10759.22 * 86400,	// https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.htmlf
		labelsize: 1,
		descid: "saturndesc",
		baseMag: 4
	});
	// occasion
	function occasion(when,person,willbe){
		this.occtime = when;	// in epoch seconds
		this.occMoment = moment(when*1000);
		this.who = person;
		this.willbe = willbe;	// number of whatevers old the person will be (text?)
		this.type = SecondsTime;
		
		// is it special?
		this.special = false;
		
	}
	// reference to the occasion page
	occasion.prototype.html = function(){
		var m;
		m='<span class="occasiondate">'+this.when()+'</span>';
		m+= ' '+this.who.name;
		m+= ' '+this.label();
		var link = "#/event/"+this.id();
		return '<a href="'+link+'">'+m+'</a>';
	}
	occasion.prototype.when = function(){
		return this.occMoment.format(this.timeformat());
	}
	occasion.prototype.id = function(){
		//var lab = ("-"+this.willbe).replace(".","-");
		return this.who.id+"-"+this.type.code+"-"+this.typeLabel;
	}
	occasion.prototype.label = function(){
		return this.type.label(this.willbe);
	}
	// used on the occasion page
	occasion.prototype.title = function(){
		return "<a href='"+this.who.url()+"'>"+this.who.name+"</a> "+this.label();// +" "+this.magnitude;
	}
	occasion.prototype.timeformat = function(){
		//console.log("timeformat request",this.type);
		return this.type.timeformat();
	}
	occasion.prototype.ageFormatted = function(ageInSec){
		return this.type.ageFormatted(ageInSec);
	}
	// FRONT page
	function frontpage(id,chronicle){
		this.pageid = id;
		this.chronicle = chronicle;
		this.f_now = $(".nowtime");
		console.log("now element",this.f_now);
	}
	frontpage.prototype.linktext = function(){
		return formatLink(this.pageid,"Home");
	}
	frontpage.prototype.render = function(){
	}
	frontpage.prototype.tick = function(nowtime){
		this.f_now.html(formatNum(Math.floor(nowtime)));
	}
	frontpage.prototype.destroy = function(){
		
	}
	// ages summary page
	function agespage(id,chronicle){
		this.pageid = id;
		this.chronicle = chronicle;
		this.people = [];
	}
	agespage.prototype.linktext = function(){
		return formatLink(this.pageid,"People");
	}
	agespage.prototype.render = function(){
		var html = "";
		this.chronicle.dset.forEach(function(person){
			var personlink = '<a href="#/person/'+person.id+'">'+person.name+'</a>';
			html+= "<p class='person-name'>"+personlink;
			html+= "   <span class='small'>(Born "+person.birth.format("dddd, MMMM Do YYYY, h:mm:ss a")+")</span></p>";
			html+= "<p>Age: <span class='counter' id='age-"+person.id+"'></span></p>";
			html+= "<p>Next occasion "+person.nextOccasion()+"</p>";
			// TOTO add edit button here
			html+= '<p><div class="button editperson" data-name="'+person.id+'">Edit</div></p>';
		});
		$(".allages").html(html);
		/*
		this.chronicle.dset.forEach(function(person){
			person.setAgeElement('age-'+person.id);
		});
		*/
	}
	agespage.prototype.tick = function(nowtime){
		this.chronicle.dset.forEach(function(person){
			$("#age-"+person.id).html(person.age_sec_f);
		});
	}
	agespage.prototype.destroy = function(){
		
	}
	function displayPage(id,chronicle){
		this.pageid = id;
		this.chronicle = chronicle;
		this.occasion = null;
		this.count = 0;
		this.zzz = 2;
	}
	displayPage.prototype.bind = function(occasion){
		this.occasion = occasion;
		this.occasionid = occasion.id();
		this.render();
	}
	displayPage.prototype.render = function(){
		if (!this.occasion) return;
		$(".occasiontitle").html(this.occasion.title());
		$(".occasionwhen").html(this.occasion.when());
		hextiles.init({
			selector: "tableau",
			cellsize: 50
		});
	}
	//!!! remove not working at the moment
	// also try replace
	displayPage.prototype.tick = function(nowtime){
		this.count++;
		if (this.count>20){
			console.log("displayPage::tick "+this.zzz);
			hextiles.remove(this.zzz,this.zzz);
			this.count = 0;
			this.zzz++;
		}
	}
	// occasion page
	function occasionPage(id,chronicle){
		this.pageid = id;
		this.chronicle = chronicle;
		this.occasion = null;
	}
	occasionPage.prototype.bind = function(occasion){
		this.occasion = occasion;
		this.occasionid = occasion.id();
		this.render();
	}
	occasionPage.prototype.render = function(){
		if (!this.occasion) return;
		
		console.log("rendering event",this.occasion);
		$(".occasiontitle").html(this.occasion.title());
		$(".occasionwhen").html(this.occasion.when());
		this.f_age = $(".current-age");
		this.sec_to_go = $(".secondstogo");
		this.clock_to_go = $(".clocktimetogo");
		
		var $desc = $(".description");
		$desc.empty();
		if (this.occasion.type.hasOwnProperty("descid")){
			var descid = this.occasion.type.descid;
			var templ;
			if (templ=this.chronicle.getTemplate(descid)){
				var ntempl = templ.clone();
				$desc.append(ntempl);
			}
		}
	}
	occasionPage.prototype.tick = function(nowtime){
		if (!this.occasion) return;
		var ageInSec = this.occasion.who.age_sec;
		this.f_age.html(this.occasion.ageFormatted(ageInSec));
		
		this.sec_to_go.html(formatNum(Math.floor(this.occasion.occtime-nowtime)));
		
		var nowMoment = moment(nowtime*1000);
		//this.clock_to_go.html(this.occasion.occMoment.fromNow());
		this.clock_to_go.html(formatDateDiff(dateDiff(this.occasion.occMoment,nowMoment)));
	}
	// schedule page
	function schedulePage(id,chronicle){
		this.pageid = id;
		this.chronicle = chronicle;
		this.render();
	}
	schedulePage.prototype.linktext = function(){
		return formatLink(this.pageid,"Schedule");
	}
	schedulePage.prototype.renderxx = function(){
	}
	schedulePage.prototype.tick = function(nowtime){
	}
	schedulePage.prototype.render = function(){
		var occasions = [];
		// TODO get rid of [ev.occtime,ev]
		this.chronicle.dset.forEach(function(person){
			person.schedule.forEach(function(ev){
				occasions.push([ev.occtime,ev]);
			});			
		});
		occasions = occasions.sort(function(a,b){
			return (a[0]<b[0]) ? -1 : (a[0]>b[0] ? 1 : 0);
		});
		var html = "";
		occasions.forEach(function(occasion){
			var mag = " class='mag"+occasion[1].magnitude+"'";
			html+='<p'+mag+'>'+occasion[1].html()+'</p>';
		});
		$(".alloccasions").html(html);
	}
	schedulePage.prototype.destroy = function(){
		
	}
	//  static page
	function staticPage(id,chronicle,label){
		this.pageid = id;
		this.chronicle = chronicle;
		this.label = label;
	}
	staticPage.prototype.linktext = function(){
		return formatLink(this.pageid,this.label);
	}
	staticPage.prototype.render = function(){
	}
	staticPage.prototype.tick = function(nowtime){
	}
	//  personpage
	function personPage(chronicle,$pageinDom){
		this.chronicle = chronicle;
		this.domPage = $pageinDom;
		this.person = null;
		this.render();
	}
	personPage.prototype.bind = function(person){
		var that = this;
		this.person = person;
		this.pageid = person.name;
		console.log("Binding Person to page",person, this.pageid);
		this.domPage.find(".pagetitle").html(this.pageid);
		
		var sched = this.domPage.find(".personschedule");
		sched.empty();
		// only show ages relevant to that person
		this.chronicle.eventTypes.forEach(function(evtype){
			evtype.showAgeElement(that.person);
		});
		this.person.schedule.forEach(function(occ){
			var mag = " class='mag"+occ.magnitude+"'";
			var html = '<p'+mag+'>'+occ.html()+'</p>';
			sched.append(html);
		});
	}
	personPage.prototype.render = function(){
		this.makePage();
	}
	personPage.prototype.linktext = function(){
		return formatLink(this.pageid,this.pageid);
	}
	personPage.prototype.tick = function(nowtime){
		if (!this.person) return;
		var that = this;
		var ageInSec = this.person.age_sec;
		this.chronicle.eventTypes.forEach(function(evtype){
			evtype.showAgeElement(that.person);
			that.domPage.find("."+evtype.code+"_f_age").html(evtype.ageFormatted(ageInSec));
		});
	}
	personPage.prototype.makePage = function(){
		var that=this;
		
		var ages = this.domPage.find(".ageslist");
		ages.empty();
		this.chronicle.eventTypes.forEach(function(evtype){
			ages.append('<p>'+evtype.ageHtml()+'</p>');
		});
	}
	personPage.prototype.destroy = function(){
		this.domPage.remove();
	}
	
	DataSet = {
		
		all: [],
		index: {},
		
		init: function(chronicle){
			this.chronicle = chronicle;
			this.load();
		},
		save: function(){
			var m = [];
			this.all.forEach(function(person){
				m.push(person.toArray());
			});
			localStorage.chrondata = JSON.stringify(m);
		},
		load: function() {
			var that = this;
			if (typeof(Storage) !== "undefined") {
				if (localStorage.hasOwnProperty("chrondata")) var storedArray = JSON.parse(localStorage.chrondata);
				else var storedArray = [];
			} else {
				var storedArray=[];		// get from cookie??? Do i want to support such old browsers?
			}
						
			storedArray.forEach(function(val){
				var newObj = null;
				if (val[0]=="person") {
					newObj = new person(val[1],val[2]);
					that.add(newObj);
				}	
			});
		},
		hasPeople: function(){
			return this.all.length>0;
		},
		get: function(personName){
			if (this.index.hasOwnProperty(personName)) return this.index[personName];
			return null;
		},
		getOccasion: function(eventid){
			for (var k=0; k<this.all.length; k++){
				var res = this.all[k].getOccasion(eventid);
				if (res) return res;
			}
			return null;
		},
		update: function(person){
			this.makeIndex();	// in case the key changed
			this.save();
		},
		add: function(person){
			person.setChronicle(this.chronicle);
			var key = person.id;
			if (this.get(key)){
				console.log("Rejecting duplicate insert of "+key);
				return "This person already exists, you cant add them again";
			}
			this.all.push(person);
			this.index[key] = person;
			this.save();
			return "";
		},
		delete: function(personId){
			if (!this.get(personId)) {
				console.log("WARNING - unable to delete person "+personId);
				return;
			}
			console.log("Deleting from data layer "+personId);
			this.index[personId] = null;		// cant actually remove it, i think
			
			// find the index
			var found = -1;
			for (var k=0; k<this.all.length; k++) {
				if (this.all[k].id == personId) found = k;
			}
			console.log("--Removing entry "+found, this.all);
			if (found>=0) this.all.splice(found,1);
			this.save();
		},
		makeIndex: function(){
			var newIx = {};
			this.forEach(function(person){
				newIx[person.id] = person;
			});
			this.index = newIx;
		},
		forEach: function(cb){
			for (var k=0; k<this.all.length; k++){
				var ob = this.all[k];
				cb.call(ob,ob);		// the person will be this.
			}
		}
	}
	
	EventEditForm = {
		template: null,
		ctl: null,
		isOpen: false,
		
		init: function init(templ,controller){
			this.template = templ;
			this.template.hide();
			
			this.ctl = controller;
			this.setup();
		},
		setup: function(){
			var that = this;
			
			$("#save").click(function(ev){
				that.save();
			});
			$("#cancel").click(function(ev){
				that.cancel();
			});
			$("#delete").click(function(ev){
				that.delete();
			});
			
		},
		// this is binding to a person if there is one
		show: function(ev){
			var $targ = $(ev.target);
			this.personName = $targ.data("name");
			console.log("Opening edit form for "+this.personName);
			var $form = this.template;
			
			if (this.personName){
				var pers = this.ctl.getPerson(this.personName);
				$form.find("#person_name").val(pers.name);
				var dt = pers.birthutc.split("T");
				$form.find("#person_date").val(dt[0]);
				$form.find("#person_time").val(dt[1]);
				this.personObject = pers;
				$(".formtitle").html("Edit "+pers.name);
				$("#save").html("Update");
				$("#delete").show();
			} else {
				this.personObject = null;
				$(".formtitle").html("Add New");
				$("#save").html("Save");
				$("#delete").hide();
			}
			this.isOpen = true;
			this.template.show();
			// reposition it
			console.log("window scrolltop "+$(window).scrollTop());
			var y = $(window).scrollTop();
			this.template.offset({left:10, top: y+10});
		},
		save: function(){
			var $form = this.template;
			var name = $form.find("#person_name").val();
			var bdate = $form.find("#person_date").val();
			var btime = $form.find("#person_time").val();
			var isme = $form.find("#person_isme").is(':checked');
			var bdatetime = bdate + "T" + ((typeof btime == "undefined" || btime=="") ? "12:00:00" : btime);
			
			var msg;
			if (this.personObject){
				msg = this.ctl.updatePerson(this.personObject,name,bdatetime);
			} else {
				console.log("new item",bdatetime,btime);
			
				var newpeep = new person(name,bdatetime);
				newpeep.setChronicle(this.ctl);
			
				msg = this.ctl.addPerson(newpeep);
			}
			if (msg) $(".message").html(msg);
			else this.cancel();		// clear and hide
		},
		cancel: function(){
			var $form = this.template;
			var name = $form.find("#person_name").val("");
			var bdate = $form.find("#person_date").val("");
			var btime = $form.find("#person_time").val("");
			$form.find(".message").html("");
			this.isOpen = false;
			$form.hide();
		},
		delete: function(){
			console.log("deleting person "+this.personName);
			var msg = this.ctl.deletePerson(this.personName);
			if (msg) $(".message").html(msg);
			else this.cancel();		// clear and hide
		}
		
	}
	
	Chronicle = {
		
		people: [],
		
		pages: [],
		
		templates: {},
		
		chronsize: 100000000,
		
		/**
		* The data storage object
		*/
		dset: null,
		
		/**
		* The event edit form object
		*/
		evedit: null,
		
		init: function(dset,eventeditform){
			this.dset = dset;
			this.evedit = eventeditform;
			
			var that = this;			
			// this.getPeople();
			this.getTemplates();
			
			this.updatePeople();	// sets this.now and sets person ages for the first time - needed by reSchedule
			
			this.setupRelTimes();
			
			this.reSchedule();
			
			this.setupPages();
			
			this.setupActions();
			
			//this.setupLinks();
			
			this.clock = setInterval(function(){
				that.doTicking();
			},200);
			
		},
		eventTypes: [
			SecondsTime,DaysTime,MercuryYears,VenusYears,EarthYears,MarsYears,JupiterYears,SaturnYears
		],
		/**
		* add the Event types for relative ages
		* Must be redo-able, so delete existing ones first
		*/
		setupRelTimes: function(){
			var that = this;
			var newEvents = [];
			this.eventTypes.forEach(function(et){
				if (!et.personDependent()) newEvents.push(et);
			});
			this.dset.forEach(function(person){
				var rel = $.extend({},RelativeTime);
				rel.setBase(person);
				newEvents.push(rel);
			});
			this.eventTypes = newEvents;
		},
		reSchedule: function(){
			this.dset.forEach(function(person){
				person.setupSchedule();
			});			
		},
		/**
		* Needed if event types now change when the people change because of relative ages.
		*/
		updateEventTypes: function(){
			
		},
		saveTemplate: function(el,detach){
			var $el = $(el);
			var id = $el.attr("id");
			console.log("Found template "+id);
			if (detach) $el.detach();
			$el.removeAttr("id");
			this.templates[id] = $el;
		},
		getTemplates: function(){
			var that = this;
			$(".template").each(function(ix,el){
				that.saveTemplate(el,false);
			});
			$(".templatedet").each(function(ix,el){
				that.saveTemplate(el,true);
			});
			console.log("read all templates",that.templates);
			
			this.evedit.init(this.templates.personedit,this);

			//this.templates.personpage.detach();
		},
		setupActions: function(){
			var that = this;
			$(".editperson").click(function(ev){
				console.log("person edit button clicked");
				that.evedit.show(ev);
			});
			$("#addperson").click(function(ev){
				that.evedit.show(ev);
			});
			if (this.dset.hasPeople()) $(".if-no-people").hide(); 
		},
		setupPages: function(){
			var that = this;
			
			// this.personTemplate = $("#personpage").detach();
			
			this.now = new Date().getTime() / 1000;
			this.pages.push(new frontpage("intro",this));
			
			var ages = new agespage("summary",this);
			ages.render();
			this.pages.push(ages);
			
			var sched = new schedulePage("schedule",this);
			this.pages.push(sched);
			
			var about = new staticPage("about",this,"About");
			this.pages.push(about);

			this.tabify();
			
			// pages after this point will not be in the navigation
			this.personPage = new personPage(that,$("#personpage"));
			this.pages.push(this.personPage);
			
			this.occasionPage = new occasionPage("occasion",that);
			this.pages.push(this.occasionPage);
			
			this.displayPage = new displayPage("occasion2",that);
			this.pages.push(this.displayPage);
			
		},
		reRender: function(){
			this.pages.forEach(function(page){page.render()});
			this.setupActions();		// TODO i'm not confident about this, should split them up by page.
		},
		bindPerson: function(personid){
			var person = this.dset.get(personid);
			if (!person) console.log("WARNING - could not find person "+personid);
			this.personPage.bind(person);
		},
		bindOccasion: function(eventid){
			var occasion = this.dset.getOccasion(eventid);
			if (!occasion) console.log("WARNING - could not find event "+eventid);
			this.occasionPage.bind(occasion);
		},
		bindOccasion2: function(eventid){
			var occasion = this.dset.getOccasion(eventid);
			if (!occasion) console.log("WARNING - could not find event "+eventid);
			this.displayPage.bind(occasion);
		},
		getPerson: function(peepname){
			return this.dset.get(peepname);
		},
		getTemplate: function(tempname){
			if (this.templates.hasOwnProperty(tempname)) return this.templates[tempname];
			return null;
		},
		addPerson: function(newpeep){
			var msg = this.dset.add(newpeep);
			if (msg) return msg;
			newpeep.setAge(this.now);
			this.changePeople();
			return "";
		},
		updatePerson: function(person,name,bdatetime){
			person.update(name,bdatetime);
			this.dset.update(person);
			person.setAge(this.now);	// must reset the age before making a schedule.
			this.changePeople();
			return "";
		},
		deletePerson: function(peepname){
			this.dset.delete(peepname);
			this.updateEventTypes();
			this.removePageFor(peepname);
			//this.tabify();
			//this.reRender();
			this.changePeople();
			return "";
		},
		/**
		* If the list of people changes, then regenerate the person specific event types, and regenerate schedules and ages
		*/
		changePeople: function(){
			this.setupRelTimes();
			this.reSchedule();
			this.reRender();
		},
		setupLinks: function(){
			var that = this;
			$(".linkit").click(function(ev){
				var newtab = $(ev.target).data("tab");
				that.showTab(newtab);
			});
		},
		removePageFor: function(peepname){
			var ix = -1;
			for (var k=0; k<this.pages.length; k++){
				if (this.pages[k].pageid==peepname) ix=k;
			}
			if (ix>=0) {
				this.pages[ix].destroy();
				this.pages.splice(ix,1);
			}
		},
		showTab: function(tabname){
			console.log("================showTab "+tabname);
			$(".wholepage").hide();
			$("#"+tabname).show();
		},
		tabify: function(){
			var tabs = "<ul>";
			this.pages.forEach(function(page){
				console.log("tabbing "+page.pageid);
				tabs+= '<li>'+page.linktext()+'</li>';
			});
			tabs+= "</ul>";
			$("#nav").html(tabs);
			this.setupLinks();
		},
		
		updatePeople: function(){
			var that = this;
			that.now = new Date().getTime() / 1000;
			
			// update each person
			this.dset.forEach(function(person){
				person.setAge(that.now);
			});
		},
		
		doTicking: function(){
			this.updatePeople();	// also sets this.now
			
			var that = this;			
			// update each page
			this.pages.forEach(function(page){
				page.tick(that.now);
			});
		}
		
		
	};
	
	

})(jQuery);

