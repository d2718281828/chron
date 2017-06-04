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
			var col = '#6fb';
			result.push(this.makeTile(svgdefs, col, this.path1(va,vb,vc,scale)));
			return result;
		},
		makeTile: function(svgdefs,colour,path){
			var group = svgdefs.group();
			group.path(path).stroke({ color: colour, opacity: 1.0, width: 2 }).fill("transparent");
			return group;
		},
		// meeting points at thirds
		path1: function(va,vb,vc,scale){
			// calculate 1/3 midpoints
			rab = [(2*va[0]+vb[0])/3, (2*va[1]+vb[1])/3 ];
			rac = [(2*va[0]+vc[0])/3, (2*va[1]+vc[1])/3 ];
			rba = [(2*vb[0]+va[0])/3, (2*vb[1]+va[1])/3 ];
			rbc = [(2*vb[0]+vc[0])/3, (2*vb[1]+vc[1])/3 ];
			rca = [(2*vc[0]+va[0])/3, (2*vc[1]+va[1])/3 ];
			rcb = [(2*vc[0]+vb[0])/3, (2*vc[1]+vb[1])/3 ];
			// draw
			var rad = scale/3;
			var path = "M"+rab[0]+" "+rab[1];
			path = path+"A"+rad+" "+rad+" 0 0 1 "+rac[0]+" "+rac[1];  // arc ab-ac
			path = path+"M"+rca[0]+" "+rca[1];
			path = path+"A"+rad+" "+rad+" 0 0 1 "+rcb[0]+" "+rcb[1];  // arc ca to cb
			rad = rad * 2;
			path = path+"M"+rca[0]+" "+rca[1];
			path = path+"A"+rad+" "+rad+" 0 0 0 "+rba[0]+" "+rba[1];  // arc ca to ba
			path = path+"M"+rac[0]+" "+rac[1];
			path = path+"A"+rad+" "+rad+" 0 0 1 "+rbc[0]+" "+rbc[1];  // arc ac to bc
			return path;
		},
	};

})(jQuery);
