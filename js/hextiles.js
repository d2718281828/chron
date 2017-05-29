(function($){

  alpha = Math.sqrt(3)/2;

  window.hextiles = {

    init: function(optionset){
      this.options = optionset;
      this.svgdoc = SVG(optionset.selector).size('100%','100%');
      this.defs = this.svgdoc.defs();
      this.makeTiles();

      this.doTile(14,10);
    },
    doTile: function(w,h){
      var x,y;
      var scale = this.options.cellsize;
      for (var u = -1; u<w; u++){
        for (var v = 0; v<h; v++){
          x = (u+(v%2)/2)*scale;
          y = v*scale*alpha;
          r0 = Math.floor(3*Math.random());
          r1 = Math.floor(3*Math.random());
          console.log("random",r0,r1);
          this.svgdoc.use(this.tiles0[r0]).move(x,y);
          this.svgdoc.use(this.tiles1[r1]).move(x,y);
        }

      }
    },
    makeTiles: function(){
      var scale = this.options.cellsize;
      var q = [0,0];
      var r = [0.5*scale,0];
      var s = [scale/4, alpha*scale/2];
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
      var col = '#f06';
      this.tile2(group,ra,rb,rc,scale,col,col);
      return group;
    },
    tile1: function(group,ra,rb,rc,scale,col1,col2){
      var path = "M"+ra[0]+" "+ra[1];
      path = path+"L"+rb[0]+" "+rb[1];  // line a-b
      path = path+"M"+((ra[0]+rb[0])/2)+" "+((ra[1]+rb[1])/2);  // move to midpoint ab
      path = path+"L"+rc[0]+" "+rc[1];  // line to c
      group.path(path).stroke({ color: col1, opacity: 0.6, width: 5 });

    },
    tile2: function(group,ra,rb,rc,scale,col1,col2){
      var rad = scale/2;
      var path = "M"+ra[0]+" "+ra[1];
      path = path+"A"+rad+" "+rad+" 0 0 0 "+rb[0]+" "+rb[1];  // line a-b
      path = path+"M"+((ra[0]+rb[0])/2)+" "+((ra[1]+rb[1])/2);  // move to midpoint ab
      path = path+"L"+rc[0]+" "+rc[1];  // line to c
      group.path(path).stroke({ color: col1, opacity: 0.6, width: 5 }).fill("transparent");

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
