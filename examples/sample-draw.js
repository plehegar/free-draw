for (let i = 1; i <= 12; i++) {
    penColor(color_random());
    for (let j = 1; j <= 2; j++) {
        moveForward(100);
        turnRight(60);
        moveForward(100);
        turnRight(120);
    }
    turnLeft(30);
}

