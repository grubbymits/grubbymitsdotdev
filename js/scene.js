var fallenLog = {};
var grass = {};
var rock = [];
var trees = [];

fallenLog.create = function(x, y, width, height) {
  console.log("creating fallenlog");
  var logBegin = new Point(x - width / 2, y - height / 2);
  var logSize = new Size(width, height);
  var wood = new Path.Rectangle(logBegin, logSize);
  wood.smooth();
  wood.fillColor = woodBrown;
  wood.strokeColor = 'black';
  this.origImg = wood;
  //this.origImg = new Group({
    //children: [log]
  //});
  this.drawImg = this.origImg.clone();
  this.origImg.visible = false;
};

fallenLog.scale = function(sx, sy) {
  this.drawImg.remove();
  this.drawImg = this.origImg.clone();
  this.drawImg.scale(sx, sy);
  this.drawImg.visible = true;
  this.drawImg.position.x *= sx;
  this.drawImg.position.y *= sy;
};

grass.create = function(canvasWidth, canvasHeight) {
  this.origImg = new Path.Rectangle(new Point(0, canvasHeight/3),
                             canvasWidth, 2*canvasHeight/3);
  this.origImg.fillColor = '#405600';
};

grass.scale = function(canvasWidth, canvasHeight) {
  this.drawImg.remove();
  this.drawImg = this.origImg.clone();
  this.drawImg.scale(sx*0.8, sy);
  this.drawImg.visible = true;
}

createTrees = function(canvasWidth, canvasHeight) {
  var nearTree = new Tree(4*canvasWidth/6,
	                        canvasHeight - canvasHeight/3,
	                        canvasWidth/6,
	                        canvasHeight/2);
	trees.push(nearTree);
	
	var farTree = new Tree((4*canvasWidth/6) * 0.75,
	                       (canvasHeight - canvasHeight/3) * 0.75,
	                       canvasWidth/6 * 0.75,
	                       canvasHeight/2 * 0.75);
	trees.push(farTree);
};
