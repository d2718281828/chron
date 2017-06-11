(function($){

	alpha = Math.sqrt(3)/2;	// vertical height of unit equilateral triangle

	window.tileset = {
	  
		parent: null,
		svgdoc: null,
		theTiles: [],
	  
		// the owning hextiles object
		setParent: function(ht){
		  this.parent = ht;
		  this.svgdoc = ht.svgdoc;
		  this.init();
		},
		// anything that needs to be done initially
		init: function(){
			this.redBerry = this.svgdoc.gradient('radial', function(stop) {
				stop.at(0, '#ffa');
				stop.at(1, '#a00');
			});
			this.greenBerry = this.svgdoc.gradient('radial', function(stop) {
				stop.at(0, '#afa');
				stop.at(1, '#0a0');
			});
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
			result.push(this.makeTile(svgdefs, col, this.path2(va,vb,vc,scale)));
			result.push(this.makeBerry(svgdefs, col, this.path1(va,vb,vc,scale),this.redBerry));
			result.push(this.makeBerry(svgdefs, col, this.path1(va,vb,vc,scale),this.greenBerry));
			this.theTiles = result;
			this.theDistribution = this.distribution([10,7,10, 1,6]);
			return result;
		},
		// relative frequency of the different tiles
		distribution: function(relative){
			var k;
			var tot=0;
			for  (k=0; k<relative.length; k++){
				tot+=relative[k];
			}
			var ans = [];
			var cum = 0;
			for  (k=0; k<relative.length; k++){
				cum += relative[k]/tot;
				ans.push(cum);
			}
			return ans;
		},
		get: function(ix){
			if (ix>=0 && ix<this.theTiles.length) return this.theTiles[ix];
			// make a random one
			var rr = Math.random();
			//console.log("getting random tile "+rr,this.theDistribution);
			for  (var k=0; k<this.theDistribution.length; k++){
				if (this.theDistribution[k]>rr) return this.theTiles[k];
			}
			return this.theTiles[0];
		},
		makeTile: function(svgdefs,colour,path){
			var group = svgdefs.group();
			group.path(path).stroke({ color: colour, opacity: 1.0, width: 2 }).fill("transparent");
			return group;
		},
		makeBerry: function(svgdefs,colour,path,gradient){
			var group = svgdefs.group();
			group.path(path).stroke({ color: colour, opacity: 1.0, width: 2 }).fill("transparent");
			group.circle(20).stroke({ color: "#f00", opacity: 1.0, width: 0 }).fill(gradient);
			return group;
		},
		berry: function(){
			var path = "M"+rab[0]+" "+rab[1];
			return path;
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
		// one branch terminates
		path2: function(va,vb,vc,scale){
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
			rad = rad * 2;
			path = path+"M"+rca[0]+" "+rca[1];
			path = path+"A"+rad+" "+rad+" 0 0 0 "+rba[0]+" "+rba[1];  // arc ca to ba
			rad = scale/6;
			path = path+"M"+rcb[0]+" "+rcb[1];
			path = path+"A"+rad+" "+rad+" 0 0 1 "+rbc[0]+" "+rbc[1];  // arc cb to bc
			return path;
		},
	};

})(jQuery);
