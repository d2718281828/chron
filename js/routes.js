/**
* This is the app, effectively.
* /details/{eventid}
*/
(function(){

  Router.add("/person/{personid}", 'personpage', function(data){
	  console.log("Routes - person - "+data.personid);
	  Chronicle.bindPerson(data.personid);
  });
  Router.add("/event/{eventid}", 'occasion', function(data){
	  console.log("Routes - occasion - "+data.eventid);
	  Chronicle.bindOccasion(data.eventid);
  });
  Router.add("/event2/{eventid}", 'occasion2', function(data){
	  console.log("Routes - occasion 2 - "+data.eventid);
	  Chronicle.bindOccasion2(data.eventid);
  });
  Router.add("/{pagename}", '', function(data){
	  console.log("Routes - pagename");
	  Chronicle.showTab(data.pagename);
  });
  Router.add("/", 'intro', function(data){
	  console.log("Routes - root");
	  Chronicle.showTab('intro');
  });
  Router.add(null, 'intro', function(data){
	  console.log("Routes - null");
	  Chronicle.showTab('intro');

  });

	$(document).ready(function() {
		DataSet.init(Chronicle);
		Chronicle.init(DataSet,EventEditForm); 
		Router.init(function(pageid){
			Chronicle.showTab(pageid);
		});
	} );

})();
