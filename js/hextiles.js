(function($){

  alpha = Math.sqrt(3)/2;	// vertical height of unit equilateral triangle

  window.hextiles = {

    init: function(optionset){
      this.options = optionset;
      var scale = this.options.cellsize;

      this.svgdoc = SVG(optionset.selector).size('100%','100%');
      this.defs = this.svgdoc.defs();
	  
	  var w = $("#"+optionset.selector).width();
	  var h = $("#"+optionset.selector).height(w);

      this.makeTiles();
	  
	  // store the set of eelements for subsequent mods
	  this.bits = {};
	  
	  // initial build
      this.doTile(w/scale,w/scale);
	  
    },
    doTile: function(w,h){
      var xy,prop;
      for (var u = -1; u<w; u++){
        for (var v = 0; v<h; v++){
			xy = this.coords(u,v);
			r0 = Math.floor(3*Math.random());
			r1 = Math.floor(3*Math.random());
			r0=1;
			r1=1;
			//console.log("random",r0,r1);
			prop = u+"-"+v+"-";
			this.bits[prop+"0"] = this.svgdoc.use(this.tiles0[r0]).move(xy[0],xy[1]); //.attr("id","svgimage-u-"+u+"-"+v);
			this.bits[prop+"1"] = this.svgdoc.use(this.tiles1[r1]).move(xy[0],xy[1]); //.attr("id","svgimage-d-"+u+"-"+v);
        }

      }
    },
	coords: function(u,v){
		var scale = this.options.cellsize;
        return [  x = (u+(v%2)/2)*scale , v*scale*alpha ];
		
	},
	// q, r and s are the midpoints of the cell. Would be more flexible to re-write as the vertices
    makeTiles: function(){
      var scale = this.options.cellsize;
      var q = [0,0];
      var r = [0.5*scale,0];
      var s = [scale/4, alpha*scale/2];
	  // todo could we do all 6 tiles by rotating a single one?
      // upward facing
      this.tiles0 = [];
      this.tiles0.push(this.makeTile(q,r,s,1));
      this.tiles0.push(this.makeTile(r,s,q,1));
      this.tiles0.push(this.makeTile(s,q,r,1));
      // downward
      this.tiles1 = [];
      this.tiles1.push(this.makeTile(q,r,s,-1));
      this.tiles1.push(this.makeTile(r,s,q,-1));
      this.tiles1.push(this.makeTile(s,q,r,-1));
    },
    makeTile: function(a,b,c,dir){
      var scale = this.options.cellsize;
      var qx = 0.75*scale; var qy = scale*alpha/2;
      var ra = [a[0]*dir+qx, a[1]*dir+qy];
      var rb = [b[0]*dir+qx, b[1]*dir+qy];
      var rc = [c[0]*dir+qx, c[1]*dir+qy];
      var group = this.defs.group();
      var col = '#fb6';
      this.tile2(group,ra,rb,rc,scale,col,col);
      return group;
    },
	// obsolete tile
    tile1: function(group,ra,rb,rc,scale,col1,col2){
      var path = "M"+ra[0]+" "+ra[1];
      path = path+"L"+rb[0]+" "+rb[1];  // line a-b
      path = path+"M"+((ra[0]+rb[0])/2)+" "+((ra[1]+rb[1])/2);  // move to midpoint ab
      path = path+"L"+rc[0]+" "+rc[1];  // line to c
      group.path(path).stroke({ color: col1, opacity: 0.6, width: 5 });

    },
	// a circular arc and a straight line meeting it.
    tile2: function(group,ra,rb,rc,scale,col1,col2){
      var rad = scale/2;
      var path = "M"+ra[0]+" "+ra[1];
      path = path+"A"+rad+" "+rad+" 0 0 0 "+rb[0]+" "+rb[1];  // line a-b
      path = path+"M"+((ra[0]+rb[0])/2)+" "+((ra[1]+rb[1])/2);  // move to midpoint ab
      path = path+"L"+rc[0]+" "+rc[1];  // line to c
      group.path(path).stroke({ color: col1, opacity: 0.6, width: 5 }).fill("transparent");

    },
    tile3: function(group,ra,rb,rc,scale,col1,col2){
      var rad = scale/3;
      var path = "M"+ra[0]+" "+ra[1];
      path = path+"A"+rad+" "+rad+" 0 0 0 "+rb[0]+" "+rb[1];  // line a-b
      path = path+"M"+((ra[0]+rb[0])/2)+" "+((ra[1]+rb[1])/2);  // move to midpoint ab
      path = path+"L"+rc[0]+" "+rc[1];  // line to c
      group.path(path).stroke({ color: col1, opacity: 0.6, width: 5 }).fill("transparent");

    },
	remove: function(u,v,down){
		var prop = u+"-"+v+"-"+down;
		if (this.bits.hasOwnProperty(prop)) this.bits[prop].remove();
	},
	replace: function(u,v,down,withwhat){
		var prop = u+"-"+v+"-"+down;
		//var newone = (down==1) ? this.tiles1[withwhat] : this.tiles0[withwhat];
		console.log("replacing "+prop);
		if (this.bits.hasOwnProperty(prop)) {
			var xy = this.coords(u,v);
			this.bits[prop].remove();
			if (down==0) this.bits[prop] = this.svgdoc.use(this.tiles0[withwhat]).move(xy[0],xy[1]);
			else 		 this.bits[prop] = this.svgdoc.use(this.tiles1[withwhat]).move(xy[0],xy[1]);
		}
	}
  };
  /*
  $(document).ready(function(){
    hextiles.init({
      selector: "totalback",
      cellsize: 100
    })

  });
  */


})(jQuery);
