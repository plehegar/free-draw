function moveElsaUp() {
    jumpForward(2);
    show("knight");
}
when("keyboard", "up", moveElsaUp);

function moveElsaDown() {
    jumpBackward(2);
    show("knight");
}
when("keyboard", "down", moveElsaDown);

function moveElsaLeft() {
    turnLeft(90);
    jumpForward(2);
    turnRight(90);
    show("knight");
}
when("keyboard", "left", moveElsaLeft);

function moveElsaRight() {
    turnRight(90);
    jumpForward(2);
    turnLeft(90);
    show("knight");
}
when("keyboard", "right", moveElsaRight);

function moveElsaCenter() {
    resetToCenter();
    show("knight");
}
when("keyboard", "c", moveElsaCenter);

function moveElsa(x, y) {
    jumpTo(x, y);
    show("knight");
}
when("mouse", moveElsa);

show("knight");
