var tree = {};
var fallenLog = {};
var rock = {};

var woodBrown = '#4C3D00';

fallenLog.create = function(x, y, width, height) {
  console.log("creating fallenlog");
  var logBegin = new Point(x - width / 2, y - height / 2);
  var logSize = new Size(width, height);
  var log = new Path.Rectangle(logBegin, logSize);
  log.smooth();
  log.fillColor = woodBrown;
  log.strokeColor = 'black';
  this.origImg = log;
  //this.origImg = new Group({
    //children: [log]
  //});
  this.drawImg = this.origImg.clone();
  this.origImg.visible = false;
}

fallenLog.scale = function(sx, sy) {
  this.drawImg.remove();
  this.drawImg = this.origImg.clone();
  this.drawImg.scale(sx, sy);
  this.drawImg.visible = true;
  this.drawImg.position.x *= sx;
  this.drawImg.position.y *= sy;
}

tree.create = function(x, y, width, height) {
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
}

tree.scale = function(sx, sy) {
  this.drawImg.remove();
  this.drawImg = this.origImg.clone();
  this.drawImg.scale(sx, sy);
  this.drawImg.visible = true;
  this.drawImg.position.x *= sx;
  this.drawImg.position.y *= sy;
}

