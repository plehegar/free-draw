function dessin(color) {
    penColor(color);
    for (var i = 1; i <= 12; i++) {
        for (var j = 1; j <= 2; j++) {
            moveForward(100);
            turnRight(60);
            moveForward(100);
            turnRight(120);
        }
        turnLeft(30);
    }
}

function ticker() {
    dessin("yellow");
    turnRight(14);
    dessin("lightblue");
}
when("tick", ticker);
