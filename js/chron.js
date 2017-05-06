/* TODO
add routing
decimal formatting
validation on add - dont allow duplicate names. Also add an id for the person which is alphanumeric
add relative ages - ideally this would have multiple instances in event type.
add birth timezone to the form
add isme to the person record. or not, have a separate me variable
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
	function formatLink_undo(tab,text){
		var html = '<span class="linkit" data-tab="'+tab+'">'+text+'</span>';
		return html;
	}
	// person
	function person(name,birthutc){
		//TODO also translate non-alphameric - this needs to be a valid class name and url.
		this.id = name.toLowerCase();
		this.name = name;
		this.birthutc = birthutc;
		this.birth = moment(birthutc);
		this.birthsec = this.birth.unix();
	}
	person.prototype.setChronicle = function(c){
		this.chronicle = c;
		this.chronsize = c.chronsize;
		this.setupSchedule();
	}
	person.prototype.setAgeElement = function(id){
		this.f_age = $("#"+id);
	}
	person.prototype.setNextElement = function(id){
		this.f_next = $("#"+id);
	}
	person.prototype.setAge = function(nowtime){
		var age = nowtime-this.birthsec;
		
		var html = formatNum(age.toFixed(0));
		this.f_age.html(html);
		this.age_sec = age;
		this.age_sec_f = html;
		this.age_days = Math.floor(age/86400);
	}
	person.prototype.setupSchedule = function(){
		console.log("Setting up schedule for "+this.name);
		var that = this;
		var nowtime = Math.floor(new Date().getTime() / 1000);
		var age = nowtime-this.birthsec;
		var lastone = nowtime + 90000000;

		var sched = [];
		var newOcc;
		
		this.chronicle.eventTypes.forEach(function(evtype){
			
			// next
			var interval = evtype.duration;
			var numIntervals = Math.ceil(age/interval);
			var next = interval * numIntervals;
			var nextwhen = next + that.birthsec;

			var label = numIntervals * evtype.labelsize
			
			for (; nextwhen<lastone; nextwhen+=interval ){
				newOcc = new occasion(nextwhen,that,label);
				newOcc.type = evtype;
				sched.push(newOcc);
				label+=evtype.labelsize;
			}	
		});
		
		this.schedule = sched.sort(function(a,b){
			return (a.occtime<b.occtime) ? -1 : (a.occtime>b.occtime ? 1 : 0);
		});
	}
	person.prototype.nextOccasion = function(){
		if (this.schedule.length==0) return "No schedule yet";
		return this.schedule[0].html();
	}
	person.prototype.toArray = function(){
		return ["person",this.name,this.birthutc];
	}
	// occasion (proto)types
	SecondsTime = {
		code:"sc",
		label: function(willbe){
			return (willbe/100000000)+' chrons';
		},
		timeformat: function(){
			return "dddd, MMMM Do YYYY, h:mm:ss a";
		},
		ageHtml: function(agesec){
			return '<span class="counter '+this.code+'_f_age"></span> seconds';
		},
		ageUnits: function(agesec){
			return agesec;
		},
		ageFormatted: function(agesec){
			return formatNum(this.ageUnits(agesec).toFixed(0));
		},
		duration: 10000000,
		labelsize: 10000000
	};
	DaysTime = {
		code:"dy",
		label: function(willbe){
			return willbe+' days';
		},
		timeformat: function(){
			return "dddd, MMMM Do YYYY";
		},
		ageHtml: function(agesec){
			return '<span class="counter '+this.code+'_f_age"></span> days';
		},
		ageUnits: function(agesec){
			return agesec/86400;
		},
		ageFormatted: function(agesec){
			return formatNum(Math.floor(this.ageUnits(agesec)));
		},
		duration: 8640000,
		labelsize: 100
	};
	MercuryYears = {
		code:"me",
		label: function(willbe){
			return willbe+' Mercurian years';
		},
		timeformat: function(){
			return "dddd, MMMM Do YYYY, h:mm:ss a";
		},
		ageHtml: function(agesec){
			return '<span class="counter '+this.code+'_f_age"></span> Mercurian Years';
		},
		ageUnits: function(agesec){
			return agesec/this.duration;
		},
		ageFormatted: function(agesec){
			return formatDec(this.ageUnits(agesec),7);
		},
		duration: 87.969 * 86400,	// https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html
		labelsize: 1
	};
	VenusYears = {
		code:"ve",
		label: function(willbe){
			return willbe+' Venusian years';
		},
		timeformat: function(){
			return "dddd, MMMM Do YYYY, h:mm:ss a";
		},
		ageHtml: function(agesec){
			return '<span class="counter '+this.code+'_f_age"></span> Venusian years';
		},
		ageUnits: function(agesec){
			return agesec/this.duration;
		},
		ageFormatted: function(agesec){
			return formatDec(this.ageUnits(agesec),7);
		},
		duration: 224.701 * 86400,	// https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html	
		labelsize: 1
	};
	MarsYears = {
		code:"ma",
		label: function(willbe){
			return willbe+' Martian years';
		},
		timeformat: function(){
			return "dddd, MMMM Do YYYY, h:mm:ss a";
		},
		ageHtml: function(agesec){
			return '<span class="counter '+this.code+'_f_age"></span> Martian years';
		},
		ageUnits: function(agesec){
			return agesec/this.duration;
		},
		ageFormatted: function(agesec){
			return formatDec(this.ageUnits(agesec),7);
		},
		duration: 686.980 * 86400,	// https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html
		labelsize: 1
	};
	JupiterYears = {
		code:"ju",
		label: function(willbe){
			return willbe+' Jovian years';
		},
		timeformat: function(){
			return "dddd, MMMM Do YYYY, h:mm:ss a";
		},
		ageHtml: function(agesec){
			return '<span class="counter '+this.code+'_f_age"></span> Jovian years';
		},
		ageUnits: function(agesec){
			return agesec/this.duration;
		},
		ageFormatted: function(agesec){
			return formatDec(this.ageUnits(agesec),8);
		},
		duration: 4332.589 * 86400,	// https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html
		labelsize: 1
	};
	SaturnYears = {
		code:"sa",
		label: function(willbe){
			return willbe+' Saturnian years';
		},
		timeformat: function(){
			return "dddd, MMMM Do YYYY, h:mm:ss a";
		},
		ageHtml: function(agesec){
			return '<span class="counter '+this.code+'_f_age"></span> Saturnian Years';
		},
		ageUnits: function(agesec){
			return agesec/this.duration;
		},
		ageFormatted: function(agesec){
			return formatDec(this.ageUnits(agesec),9);
		},
		duration: 10759.22 * 86400,	// https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.htmlf
		labelsize: 1
	};
	// occasion
	function occasion(when,person,willbe){
		this.occtime = when;	// in epoch seconds
		this.occMoment = moment(when*1000);
		this.who = person;
		this.willbe = willbe;	// number of whatevers old the person will be
		this.type = SecondsTime;
		
		// is it special?
		this.special = (willbe%Chronicle.chronsize) == 0;
		
	}
	occasion.prototype.html = function(){
		var m;
		m='<span class="occasiondate'+(this.special ? " special-occasion":"")+'">'+this.occMoment.format(this.timeformat())+'</span>';
		m+= ' '+this.who.name;
		//m+= ' '+formatNum(this.willbe);
		m+= ' '+this.label();
		return m;
	}
	occasion.prototype.label = function(){
		return this.type.label(this.willbe);
	}
	occasion.prototype.timeformat = function(){
		return this.type.timeformat();
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
		console.log("_____________________Ages page is rendering");
		var html = "";
		this.chronicle.dset.forEach(function(person){
			var personlink = '<a href="#/person/'+person.id+'">'+person.name+'</a>';
			html+= "<p class='person-name'>"+personlink;
			html+= "   <span class='small'>(Born "+person.birth.format("dddd, MMMM Do YYYY, h:mm:ss a")+")</span></p>";
			html+= "<p>Age: <span class='counter' id='age-"+person.id+"'></span></p>";
			html+= "<p>Next occasion "+person.nextOccasion()+"</p>";
			// TOTO add edit button here
			html+= '<p><div class="button editperson" data-name="'+person.name+'">Edit</div></p>';
		});
		$(".allages").html(html);
		this.chronicle.dset.forEach(function(person){
			person.setAgeElement('age-'+person.id);
		});
	}
	agespage.prototype.tick = function(nowtime){
		this.chronicle.dset.forEach(function(person){
			person.setAge(nowtime);
		});
	}
	agespage.prototype.destroy = function(){
		
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
			html+='<p>'+occasion[1].html()+'</p>';
		});
		$(".alloccasions").html(html);
	}
	schedulePage.prototype.destroy = function(){
		
	}
	//  personpage
	function personPage(chronicle,$pageinDom){
		this.chronicle = chronicle;
		this.domPage = $pageinDom;
	}
	personPage.prototype.bindPerson = function(person){
		this.person = person;
		this.pageid = person.name;
		this.makePage();
	}
	personPage.prototype.render = function(){
	}
	personPage.prototype.linktext = function(){
		return formatLink(this.pageid,this.pageid);
	}
	personPage.prototype.tick = function(nowtime){
		var that = this;
		//this.f_age.html(this.person.age_sec_f);
		//this.f_days.html(formatNum(this.person.age_days));
		var ageInSec = this.person.age_sec;
		//console.log("retrieved age of "+this.person.name+" = "+ageInSec+", "+this.person.age_sec_f);
		this.chronicle.eventTypes.forEach(function(evtype){
			that.domPage.find("."+evtype.code+"_f_age").html(evtype.ageFormatted(ageInSec));
		});
	}
	personPage.prototype.makePage = function(){
		//this.domPage.attr("id",this.pageid);
		//$("body").append(this.domPage);
		//this.domPage.hide();
		
		this.domPage.find(".pagetitle").html(this.pageid);
		//this.f_age = this.domPage.find(".ageseconds");
		//this.f_days = this.domPage.find(".agedays");
		
		var ages = this.domPage.find(".ageslist");
		this.chronicle.eventTypes.forEach(function(evtype){
			ages.append('<p>'+evtype.ageHtml()+'</p>');
		});
		var sched = this.domPage.find(".personschedule");
		this.person.schedule.forEach(function(occ){
			sched.append('<p>'+occ.html()+'</p>');
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
		add: function(person){
			person.setChronicle(this.chronicle);
			var key = person.id;
			this.all.push(person);
			this.index[key] = person;
			this.save();
		},
		delete: function(personName){
			if (!this.index.hasOwnProperty(personName)) return;
			this.index[personName] = null;		// cant actually remove it, i think
			
			// find the index
			var found = -1;
			for (var k=0; k<this.all.length; k++) {
				if (this.all[k].name == personName) found = k;
			}
			if (found>=0) this.all.splice(found,1);
			this.save();
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
				$("#delete").show();
			} else {
				this.personObject = null;
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
			console.log("new item",bdatetime,btime);
			
			var newpeep = new person(name,bdatetime);
			newpeep.setChronicle(this.ctl);
			
			this.ctl.addPerson(newpeep);
			
			// clear and hide
			this.cancel();			
		},
		cancel: function(){
			var $form = this.template;
			var name = $form.find("#person_name").val("");
			var bdate = $form.find("#person_date").val("");
			var btime = $form.find("#person_time").val("");
			this.isOpen = false;
			$form.hide();
		},
		delete: function(){
			this.ctl.deletePerson(this.personName);
			this.cancel();
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
			
			this.setupPages();
			
			this.setupActions();
			
			//this.setupLinks();
			
			this.clock = setInterval(function(){
				that.doTicking();
			},250);
			
		},
		eventTypes: [
			SecondsTime,DaysTime,MercuryYears,VenusYears,MarsYears,JupiterYears,SaturnYears
		],
		/**
		* Needed if event types now change when the people change because of relative ages.
		*/
		updateEventTypes: function(){
			
		},
		getTemplates: function(){
			var that = this;
			$(".template").each(function(ix,el){
				var $el = $(el);
				var id = $el.attr("id");
				// $el.detach();
				$el.removeAttr("id");
				that.templates[id] = $el;
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

			this.tabify();
			/*
			this.dset.forEach(function(person){
				console.log("person page",person);
				that.pages.push(new personPage(person,that));
			});
			*/
			// pages after this point will not be in the navigation
			this.personPage = new personPage(that,$("#personpage"));
			this.pages.push(this.personPage);
			
			//if (this.dset.hasPeople()) this.showTab("summary");
			//else this.showTab("intro");
		},
		reRender: function(){
			this.pages.forEach(function(page){page.render()});
			this.setupActions();		// TODO i'm not confident about this, should split them up by page.
		},
		bindPerson: function(personid){
			var person = this.dset.get(personid);
			if (!person) console.log("WARNING - could not find person "+personid);
			this.personPage.bindPerson(person);
		},
		getPerson: function(peepname){
			return this.dset.get(peepname);
		},
		addPerson: function(newpeep){
			this.dset.add(newpeep);
			this.updateEventTypes();
			this.pages.push(new personPage(newpeep,this));
			this.tabify();
			this.reRender();
		},
		deletePerson: function(peepname){
			this.dset.delete(peepname);
			this.updateEventTypes();
			this.removePageFor(peepname);
			this.tabify();
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
			$(".wholepage").hide();
			$("#"+tabname).show();
		},
		tabify: function(){
			var tabs = "<ul>";
			this.pages.forEach(function(page){
				tabs+= '<li>'+page.linktext()+'</li>';
			});
			tabs+= "</ul>";
			$("#nav").html(tabs);
			this.setupLinks();
		},
		
		doTicking: function(){
			var that = this;
			that.now = new Date().getTime() / 1000;
			
			this.pages.forEach(function(page){
				page.tick(that.now);
			});
		}
		
		
	};
	
	

})(jQuery);

