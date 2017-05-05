/**
* This is the app, effectively.
* /details/{eventid}
*/
(function(){

  //Router.add('/page/registration-successfull', '<div><h3>Registration was successfull</h3></div>');
  Router.add("/person/{personid}", '', function(data){
	  Chronicle.showTab('personpage');
  });
  Router.add("/{pagename}", '', function(data){
	  Chronicle.showTab(data.pagename);
  });
  Router.add("/", 'intro', function(data){
	  Chronicle.showTab('intro');
  });
  Router.add(null, '<div class="page-content">404 Page Not Found</div>', function(data){

  });

  Router.init();

})();
