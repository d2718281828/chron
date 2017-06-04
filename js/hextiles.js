(function($){

  alpha = Math.sqrt(3)/2;	// vertical height of unit equilateral triangle

  window.hextiles = {
	  
	bits: {},
	initialised: false,
	options: null,

	/** initialise the hextiles - this will initiate a drawing 
	*
	*/
    init: function(optionset){
      this.options = optionset;
      var scale = this.options.cellsize;
	  
      this.svgdoc = SVG(optionset.selector).size('100%','100%');

	  this.tileMaker = optionset.tiles;
	  this.tileMaker.setParent(this);
	  
      this.defs = this.svgdoc.defs();
	  // make the tiles
	  this.tiles = this.tileMaker.make(this.defs);
	  
	  var w = $("#"+optionset.selector).width();
	  var h = $("#"+optionset.selector).height(w);

	  // store the set of elements for subsequent mods
	  this.bits = {};
	  
	  // initial build
      this.doTile(w/scale,w/scale);
	  
	  this.initialised = true;
	  
    },
	scale: function(){
		return this.options.cellsize;
	},
	numTiles: function(){
		return this.tiles.length;
	},
    doTile: function(w,h){
	  this.tilingSize = [w,h];
      var xy,prop;
	  var rot = 0;
      for (var u = 0; u<w; u++){
        for (var v = 0; v<h; v++){
			for (var up = 0; up<2; up++){
				xy = this.coords(u,v,up);
				orient = Math.floor(3*Math.random());
				orient=rot%3;
				prop = u+"-"+v+"-"+up;
				var angle = (orient*120+60*up)%360;
				this.bits[prop] = this.svgdoc.use(this.tileMaker.get(up)).rotate(angle,xy[0],xy[1]).move(xy[0],xy[1]);
				rot++;
			}
        }
      }
    },
	/**
	* Convert the parallogrammed co-ords u,v to x,y.
	* An extra co-ord is needed  because each parallelogram contains two triangles. The first is downward, and is up=0.
	* The second us upward pointing and is up=1.
	* The calculated co-ords are the centre of the triangle, to allow for rotations
	* @return array with two elements, x, y.
	* y is measured downwards.
	* Shapes to fit in should be defined as downward pointing. Downward cells have an even number of 60 degree
	* rotations, upward cells should have an odd number.
	*/
	coords: function(u,v,up){
		var scale = this.options.cellsize;
        return [  (u+((v%2)+up)/2)*scale , (v+(1+up)/3)*scale*alpha ];
	},
	remove: function(u,v,up){
		var prop = u+"-"+v+"-"+up;
		if (this.bits.hasOwnProperty(prop)) this.bits[prop].remove();
	},
	replace: function(u,v,up,tile,orient){
		var prop = u+"-"+v+"-"+up;
		//var newone = (down==1) ? this.tiles1[withwhat] : this.tiles0[withwhat];
		//console.log("replacing "+prop);
		if (this.bits.hasOwnProperty(prop)) {
			var xy = this.coords(u,v,up);
			this.bits[prop].remove();
			var angle = (orient*120+60*up)%360;
			this.bits[prop] = this.svgdoc.use(this.tileMaker.get(tile)).rotate(angle,xy[0],xy[1]).move(xy[0],xy[1]);
		}
	}
  };

})(jQuery);
