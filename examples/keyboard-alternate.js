var elsaX = 0;
var elsaY = 0;

function moveElsa(dx, dy) {
    elsaX = elsaX + dx;
    elsaY = elsaY + dy;
    jumpTo(elsaX, elsaY);
    show("knight");
}

function moveElsaUp() {
    moveElsa(0, 2);
}
when("keyboard", "up", moveElsaUp);

function moveElsaDown() {
    moveElsa(0, -2);
}
when("keyboard", "down", moveElsaDown);

function moveElsaLeft() {
    moveElsa(-2, 0);
}
when("keyboard", "left", moveElsaLeft);

function moveElsaRight() {
    moveElsa(2, 0);
}
when("keyboard", "right", moveElsaRight);

function moveElsaCenter() {
    elsaX = 0;
    elsaY = 0;
    moveElsa(0, 0);
}
when("keyboard", "c", moveElsaCenter);

function jumpElsa(x, y) {
    elsaX = x;
    elsaY = y;
    moveElsa(0, 0);
}
when("mouse", jumpElsa);

show("knight");
