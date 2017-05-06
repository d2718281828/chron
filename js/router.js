/**
* Object to do really really simple routing
*/
(function(){
  window.Router = {
    routes: [],
    payload: null,
    props: {},

    /**
    * Analyse the payload and set the page accordingly
    */
    init: function(cb){
	  if (window.location.hasOwnProperty("hash")){
		  var payload = window.location.hash.substring(1);
	  } else {
		  var payload = window.location.pathname;
	  }
	  this.payload = payload;
		
      for (var k=0; k<this.routes.length;k++){
        if (this.matches(this.routes[k],payload)) {
          console.log("Got a match to route "+k);
		  if (this.props.content) cb.call(this,this.props.content);
		  this.props.callback.call(this,this.props);
          return;
        }
      }
    },
    add: function(pat, maindiv, initfunction){
      this.routes.push([pat,maindiv,initfunction]);
    },
    get: function(prop,deflt){
      if (this.props.hasOwnProperty(prop)) return this.props[prop];
      return deflt;
    },
    /**
    * Match the route against the supplied URL and if it matches, set content of the main div on the page.
    * set property exec to be the matching callback function so that it can be called at the right time
    */
    matches: function(route,url){
      if (route[0]==null) {
        this.props.content = route[1];
        this.props.callback = route[2];
        return true;  // this is the default catchall value
      }

      var pat = this.makepattern(route[0]);
      var rg = new RegExp(pat,"g");
      var res = rg.exec(url);
      if (res==null) return false;
      //console.log("---have a match ",res);
      this.assignNames2(route[0],res);
      this.props.content = route[1];
      this.props.callback = route[2];
      return true;
    },
    makepattern: function(routematch){
      var patt = routematch.replace(/{.*?}/g , "(.*)");
      //console.log("changed "+routematch+" into "+patt);
      return '^'+patt+'/?$';
    },
    assignNames2: function(pattern,matchval){
      var p=0;
      var q,r,prop,ix=0;
      console.log("Assignnames2 "+pattern);

      while((q = pattern.indexOf("{",p))>=0){
        r = pattern.indexOf("}",q+1);
        if (r<0) return;
        prop = pattern.substring(q+1,r);
        ix++;
        console.log("Assignnames2 Found tag "+prop+"="+matchval[ix]);
        this.props[prop] = matchval[ix];
        p=r+1;
      }
    },
    assignNames: function(pattern,matchval){
      var getnames = new RegExp(/{(.*?)}/,"g"); // this line doesnt work in safari
      //var getnames = new RegExp(/{(.*?)}/);
      var nm,prop,val;
      var ix = 0;
      while (nm=getnames.exec(pattern)){
        prop = nm[1];
        ix++;
        val = matchval[ix];
        //console.log("---have a name "+prop+"="+val);
        this.props[prop] = val;
      }
      // this.props["remainder"] = matchval[ix+1];
    },
    /** execute the callback function defined in the matching route, if it exists
    */
    do: function(){
      var cb = this.get("callback",null);
      if (cb) cb(this.props);
    }

  };
})();
