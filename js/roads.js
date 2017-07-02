(function($){

	var alpha = Math.sqrt(3)/2;	// vertical height of unit equilateral triangle
	// weights for the intersection of the 2/3 arcs
	var w_apex = Math.sqrt(7/27);	
	var w_base = (1-w_apex)/2;
	// point q which is 1/2 from a and 2/3 from c
	// i did this on a piece of paper, draw right angle triangles to the desired point with hyps 1/2, 2/3, adj .5+x and .5-x
	var x = -7/72;		// distance from middle of ac to the perp foot.
	var y = Math.sqrt(1/12 - (29*29)/(72*72*3)); // y/root 3
	var w_q_a = 0.5 - x -y;
	var w_q_b = 2 * y;
	var w_q_c = 0.5 + x -y;

	window.roads = $.extend({}, stdset,{
	  
		id: "roads",
		colours: {"fore1": 	'#fff',
				"fore2":	'#380',
				"back1":	'#777',
				"back2":	'#380',
		},
		
		// anything that needs to be done initially
		init: function(){
		},
		// TODO? va,vb,vc should be arguments?
		make: function(svgdefs){
			var result = [];
			var scale = this.parent.scale();
			// three vertices, a and b are the top ones. origin at the centre of the triangle
			var va = [-scale/2, -scale*alpha/3];
			var vb = [scale/2, -scale*alpha/3];
			var vc = [0, 2*scale*alpha/3];
			result.push(this.junction(svgdefs, va,vb,vc,scale,true));
			result.push(this.junction(svgdefs, va,vc,vb,scale,false));
			this.theTiles = result;
			this.theDistribution = this.distribution([10,10]);
			return result;
		},
		// composite tile with multiple colours
		junction: function(svgdefs,va,vb,vc,scale,inwards){
			var group = svgdefs.group();
			var rl = this.thirds(va,vb,vc);	// leftwards
			var rr = this.thirds(vb,va,vc);	// rightwards
			this.addIntersections(rl,scale,va,vb,vc);
			this.addMidpoints(rl,scale,va,vb,vc);
			this.addHalf2Thirds(rl,scale,va,vb,vc);

			group.path(this.tarmac(rl,scale,!inwards)).fill(this.colours.back1);
			group.path(this.tarmac(rr,scale,inwards)).fill(this.colours.back1);
			group.path(this.verges(rl,scale,!inwards)).stroke({ color: this.colours.fore2, opacity: 1.0, width: 4 }).fill("transparent");
			group.path(this.giveways(rl,scale,!inwards)).stroke({ color: this.colours.fore1, opacity: 1.0, width: 2, dasharray: "3 3" }).fill("transparent");
			group.path(this.midlines(rl,scale,!inwards)).stroke({ color: this.colours.fore1, opacity: 1.0, width: 1.5, dasharray: "8 3" }).fill("transparent");
			return group;
		},
		// add points abx, bcx etc. abx is where the 2/3 radius arcs about a and b intersect
		addIntersections: function(r,scale,va,vb,vc){
			r.abx = [w_apex*vc[0]+w_base*va[0]+w_base*vb[0], w_apex*vc[1]+w_base*va[1]+w_base*vb[1]];
			r.bcx = [w_apex*va[0]+w_base*vb[0]+w_base*vc[0], w_apex*va[1]+w_base*vb[1]+w_base*vc[1]];
			r.cax = [w_apex*vb[0]+w_base*vc[0]+w_base*va[0], w_apex*vb[1]+w_base*vc[1]+w_base*va[1]];
		},
		// add points ab, . abm is halfway between a and b
		addMidpoints: function(r,scale,va,vb,vc){
			r.abm = [(va[0]+vb[0])/2, (va[1]+vb[1])/2];
			r.bcm = [(vb[0]+vc[0])/2, (vb[1]+vc[1])/2];
			r.cam = [(vc[0]+va[0])/2, (vc[1]+va[1])/2];
		},
		// add points half from one vertex and 2/3 from another ht_acb is half from a and 2/3 from c
		addHalf2Thirds: function(r,scale,va,vb,vc){
			r.ht_acb = [w_q_a*va[0]+w_q_c*vc[0]+w_q_b*vb[0], w_q_a*va[1]+w_q_c*vc[1]+w_q_b*vb[1]];
			r.ht_cab = [w_q_a*vc[0]+w_q_c*va[0]+w_q_b*vb[0], w_q_a*vc[1]+w_q_c*va[1]+w_q_b*vb[1]];
			r.ht_bca = [w_q_a*vb[0]+w_q_c*vc[0]+w_q_b*va[0], w_q_a*vb[1]+w_q_c*vc[1]+w_q_b*va[1]];
			r.ht_cba = [w_q_a*vc[0]+w_q_c*vb[0]+w_q_b*va[0], w_q_a*vc[1]+w_q_c*vb[1]+w_q_b*va[1]];
			r.ht_abc = [w_q_a*va[0]+w_q_c*vb[0]+w_q_b*vc[0], w_q_a*va[1]+w_q_c*vb[1]+w_q_b*vc[1]];
			r.ht_bac = [w_q_a*vb[0]+w_q_c*va[0]+w_q_b*vc[0], w_q_a*vb[1]+w_q_c*va[1]+w_q_b*vc[1]];
		},
		// paint out the road surface, the arc about va
		tarmac: function(r,scale,inwards){
			var rad = scale/3;
			var rad2 = 2*rad;
			var path = "M"+r.ab[0]+" "+r.ab[1];
			path = path+"A"+rad+" "+rad+" 0 0 "+(inwards?"0":"1")+" "+r.ac[0]+" "+r.ac[1];  // arc ab-ac
			path = path+"L"+r.ca[0]+" "+r.ca[1];							// line to ca
			path = path+"A"+rad2+" "+rad2+" 0 0 "+(!inwards?"0":"1")+" "+r.ba[0]+" "+r.ba[1];  // arc ca to ba
			path = path+"Z";											//close
			return path;
		},
		// draw the verges, arc about a and b
		verges: function(r,scale,inwards){
			var rad = scale/3;
			var rad2 = 2*rad;
			var path = "M"+r.ab[0]+" "+r.ab[1];
			path = path+"A"+rad+" "+rad+" 0 0 "+(inwards?"0":"1")+" "+r.ac[0]+" "+r.ac[1];  // arc ab-ac
			path = path+"M"+r.ca[0]+" "+r.ca[1];
			path = path+"A"+rad2+" "+rad2+" 0 0 "+(!inwards?"0":"1")+" "+r.abx[0]+" "+r.abx[1];  // arc ca to abx
			
			path = path+"M"+r.ba[0]+" "+r.ba[1];
			path = path+"A"+rad+" "+rad+" 0 0 "+(!inwards?"0":"1")+" "+r.bc[0]+" "+r.bc[1];  // arc ba - bc
			path = path+"M"+r.abx[0]+" "+r.abx[1];							
			path = path+"A"+rad2+" "+rad2+" 0 0 "+(!inwards?"0":"1")+" "+r.cb[0]+" "+r.cb[1];  // arc abx to cb
			return path;
		},
		giveways: function(r,scale,inwards){
			var rad = scale/3;
			var rad2 = 2*rad;
			var path = "";
			path = path+"M"+r.abx[0]+" "+r.abx[1];						
			path = path+"A"+rad2+" "+rad2+" 0 0 "+(inwards?"0":"1")+" "+r.ab[0]+" "+r.ab[1];  // arc abx to ab
			return path;
		},
		midlines: function(r,scale,inwards){
			var rad = scale/2;
			var path = "";
			path = path+"M"+r.abm[0]+" "+r.abm[1];						
			path = path+"A"+rad+" "+rad+" 0 0 "+(!inwards?"0":"1")+" "+r.bcm[0]+" "+r.bcm[1];  // arc abm to bcm
			path = path+"M"+r.cam[0]+" "+r.cam[1];						
			path = path+"A"+rad+" "+rad+" 0 0 "+(!inwards?"0":"1")+" "+r.ht_abc[0]+" "+r.ht_abc[1];  // arc acm to ht_abc
			return path;
		},
	});

})(jQuery);
