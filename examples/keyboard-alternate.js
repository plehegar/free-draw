let elsaX = 0;
let elsaY = 0;

function moveElsa(dx, dy) {
    elsaX = elsaX + dx;
    elsaY = elsaY + dy;
    jumpTo(elsaX, elsaY);
    show("knight");
}

function moveElsaUp() {
    moveElsa(0, 2);
}
when("keyboard", "ArrowUp", moveElsaUp);

function moveElsaDown() {
    moveElsa(0, -2);
}
when("keyboard", "ArrowDown", moveElsaDown);

function moveElsaLeft() {
    moveElsa(-2, 0);
}
when("keyboard", "ArrowLeft", moveElsaLeft);

function moveElsaRight() {
    moveElsa(2, 0);
}
when("keyboard", "ArrowRight", moveElsaRight);

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
