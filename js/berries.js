(function($){

	alpha = Math.sqrt(3)/2;	// vertical height of unit equilateral triangle

	window.berries = $.extend({}, stdset,{
	  
		id; "berries",
		
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
		makeBerry: function(svgdefs,colour,path,gradient){
			var group = svgdefs.group();
			group.path(path).stroke({ color: colour, opacity: 1.0, width: 2 }).fill("transparent");
			group.circle(20).stroke({ color: "#f00", opacity: 1.0, width: 0 }).fill(gradient);
			return group;
		},
		berry_obs: function(){
			var path = "M"+rab[0]+" "+rab[1];
			return path;
		},
	});

})(jQuery);
