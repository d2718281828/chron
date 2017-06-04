(function($){

	alpha = Math.sqrt(3)/2;	// vertical height of unit equilateral triangle

	window.tileset = {
	  
		parent: null,
	  
		// the owning hextiles object
		setParent: function(ht){
		  this.parent = ht;
		},
		make: function(svgdefs){
			var result = [];
			var scale = this.parent.scale();
			// three vertices, a and b are the top ones. origin at the centre of the triangle
			var va = [-scale/2, -scale*alpha/3];
			var vb = [scale/2, -scale*alpha/3];
			var vc = [0, 2*scale*alpha/3];
			var col = '#fb6';
			result.push(this.makeTile(svgdefs, col, this.path1(va,vb,vc,scale)));
			return result;
		},
		makeTile: function(svgdefs,colour,path){
			var group = svgdefs.group();
			group.path(path).stroke({ color: colour, opacity: 1.0, width: 4 }).fill("transparent");
			return group;
		},
		// a circular arc and a straight line meeting it.
		path1: function(va,vb,vc,scale){
			var rad = scale/2;
			// calculate midpoints
			ra = [(va[0]+vb[0])/2, (va[1]+vb[1])/2 ];
			rb = [(vb[0]+vc[0])/2, (vb[1]+vc[1])/2 ];
			rc = [(vc[0]+va[0])/2, (vc[1]+va[1])/2 ];
			// draw
			var path = "M"+ra[0]+" "+ra[1];
			path = path+"A"+rad+" "+rad+" 0 0 0 "+rb[0]+" "+rb[1];  // line a-b
			path = path+"M"+((ra[0]+rb[0])/2)+" "+((ra[1]+rb[1])/2);  // move to midpoint ab
			path = path+"L"+rc[0]+" "+rc[1];  // line to c
			return path;
		},
	};

})(jQuery);
