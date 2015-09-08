function PaperBear(x, y, width, height) {
  var fColor = '#343434';
  var sColor = 'black';
  this.headRotation = 0;
  this.rightArmRotation = 0;
  this.leftArmRotation = 0;
  this.leftLegRotation = 0;
  this.rightLegRotation = 0;
	var centre = new Point(x, y);
	
	// Create leg
	var hipPoint = new Point(x, y + height / 4);
	var legWidth = width / 3;
	var legSize = new Size(legWidth, height / 3);
	var legBegin = new Point(x - legWidth/2, y + height / 4);
	
	var leftLeg = new Path.Rectangle(legBegin, legSize);
	leftLeg.pivot = hipPoint;
	leftLeg.strokeColor = sColor;
	leftLeg.fillColor = fColor;
	leftLeg.smooth();
	leftLeg.name = 'leftLeg';
	leftLeg.rotate(10);

  // Create arms
	var shoulderPoint = new Point(x, y - height / 4);
	var armWidth = width / 3;
	var armSize = new Size(armWidth, height / 2);
	var armBegin = new Point(x - armWidth/2, y - height / 4);
	
	var leftArm = new Path.Rectangle(armBegin, armSize);
	leftArm.pivot = shoulderPoint;
	leftArm.strokeColor = sColor;
	leftArm.fillColor = fColor;
	leftArm.smooth();
	leftArm.rotate(60);
  leftArm.name = 'leftArm';
	
	var rightArm = leftArm.clone();
  rightArm.name = 'rightArm';
  
  var bodyTopLeft = new Point(x - width / 2, y - height / 4);
	var body = new Path.Rectangle(bodyTopLeft, new Size(width, height/2));
	body.fillColor = fColor;
	body.strokeColor = sColor;
	body.smooth();
	body.name = 'body';
	
	var tailCentre = new Point(hipPoint.x + width / 2, hipPoint.y);
	var tail = new Path.Circle(tailCentre, width/6);
	tail.fillColor = fColor;
	tail.strokeColor = sColor;

  // Create head
	var headCentre = new Point(x, y - height / 2);
	var headRadius =  width;
	head = new Path.RegularPolygon(headCentre, 3, headRadius);
  head.name = 'head';
	head.fillColor = fColor;
	head.strokeColor = sColor;
	head.smooth();
	//head.rotate(120);
	
	var earCentre = new Point(headCentre.x, headCentre.y - headRadius);
	var ear = new Path.RegularPolygon(earCentre, 3, width/4);
	ear.smooth();
	ear.fillColor = fColor;
	ear.strokeColor = sColor;
	
	var musselCentre = new Point(headCentre.x, headCentre.y - headRadius + headRadius/6);
	var mussel = new Path.RegularPolygon(musselCentre, 3, width/2);
	mussel.smooth();
	mussel.rotate(240, headCentre);
	mussel.fillColor = '#7A5C00';
	mussel.strokeColor = sColor;
	
	var noseCentre = new Point(musselCentre);
	noseCentre.y += (width/8  - width/2);
	var nose = new Path.RegularPolygon(noseCentre, 3, width/8);
	nose.smooth();
	nose.rotate(250, headCentre);
	nose.fillColor = 'black';
	nose.strokeColor = sColor;
	
	var eyeCentre = new Point(headCentre.x, headCentre.y + width/6 - headRadius);
	var eye = new Path.Circle(eyeCentre, width/6);
	eye.fillColor = '#EBEBEB';
	eye.strokeColor = sColor;
	eye.rotate(-70, headCentre);
	var pupil = new Path.Circle(eyeCentre, width/12);
	pupil.position.y += width/12 - width/6 ;
	pupil.fillColor = 'black';
	pupil.rotate(-75, headCentre);
	
	var completeHead = new Group({
	  children: [head, ear, mussel, nose, eye, pupil]
	});
	
	completeHead.name = 'completeHead';
	completeHead.rotate(-5);

  this.origImg = new Group({
		children: [rightArm, body, leftLeg, leftArm, completeHead, tail]
	});
	this.origImg.rotate(-10);
  this.drawImg = this.origImg.clone();
  this.origImg.visible = false;
}

PaperBear.prototype.animate = function(event) {
  var baseRotation = Math.cos(event.time);
  var clockwiseRotation = baseRotation * 0.1;
  var anticlockwiseRotation = baseRotation * -0.1;
  this.headRotation += clockwiseRotation;
  
  this.rightArmRotation -= -anticlockwiseRotation;
  this.leftArmRotation += clockwiseRotation;
  
  this.drawImg.children.completeHead.rotate(clockwiseRotation);
	this.drawImg.children.leftArm.rotate(clockwiseRotation);
	this.drawImg.children.rightArm.rotate(anticlockwiseRotation);
	this.drawImg.children.leftLeg.rotate(clockwiseRotation);
};

PaperBear.prototype.scale = function(sx, sy) {
  this.drawImg.remove();
  this.drawImg = this.origImg.clone();
  this.drawImg.children.completeHead.rotate(this.headRotation);
  this.drawImg.children.leftArm.rotate(this.leftArmRotation);
  this.drawImg.children.rightArm.rotate(this.rightArmRotation);
  this.drawImg.children.leftLeg.rotate(this.leftLegRotation);
  this.drawImg.scale(sx, sy);
  this.drawImg.visible = true;
  this.drawImg.position.x *= sx;
  this.drawImg.position.y *= sy;
  
};