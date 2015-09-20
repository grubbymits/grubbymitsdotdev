function Tree(x, y, width, height) {
  var treeBase = new Point(x, y);
  var trunkCentre = new Point(treeBase);
  trunkCentre.y -= height / 3;
  var trunkBegin = new Point(trunkCentre);
  trunkBegin.x -= width / 6;
  trunkBegin.y -= height / 3;
  var trunkSize = new Size(width/3, 2*height/3);
  var trunk = new Path.Rectangle(trunkBegin, trunkSize);
  trunk.smooth();
  trunk.fillColor = woodBrown;
  var foliageCentre = new Point(trunkCentre);
  foliageCentre.y -= height/3;
  var foliage = new Path.Circle(foliageCentre, width/2);
  foliage.fillColor = '#6B8F00';
  
  
  this.origImg = new Group({
    children: [trunk, foliage]
  });
  this.drawImg = this.origImg.clone();
  this.origImg.visible = false;
};

Tree.prototype.scaleForResize = function(sx, sy) {
  this.drawImg.remove();
  this.drawImg = this.origImg.clone();
  this.drawImg.scale(sx, sy);
  this.drawImg.visible = true;
  this.drawImg.position.x *= sx;
  this.drawImg.position.y *= sy;
};

Tree.prototype.scale = function(sx, sy) {
  this.drawImg.remove();
  this.drawImg = this.origImg.clone();
  this.drawImg.scale(sx, sy);
  this.drawImg.visible = true;
}