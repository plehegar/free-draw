for (var i = 0; i < 12; i++) {
	setColor("random");
	for (var j = 0; j < 2; j++) {
		moveForward(100);
		turnRight(60);
		moveForward(100);
		turnRight(120);
	}
	turnLeft(30);
}
