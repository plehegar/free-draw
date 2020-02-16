function moveElsaUp() {
    jumpForward(2);
    show("knight");
}
when("keyboard", "ArrowUp", moveElsaUp);

function moveElsaDown() {
    jumpBackward(2);
    show("knight");
}
when("keyboard", "ArrowDown", moveElsaDown);

function moveElsaLeft() {
    turnLeft(90);
    jumpForward(2);
    turnRight(90);
    show("knight");
}
when("keyboard", "ArrowLeft", moveElsaLeft);

function moveElsaRight() {
    turnRight(90);
    jumpForward(2);
    turnLeft(90);
    show("knight");
}
when("keyboard", "ArrowRight", moveElsaRight);

function moveElsaCenter() {
    moveToCenter();
    show("knight");
}
when("keyboard", "c", moveElsaCenter);

function moveElsa(x, y) {
    jumpTo(x, y);
    show("knight");
}
when("mouse", moveElsa);

show("knight");
