let count = 0;

function ticker() {
    count = count + 1;
    if (count < 100) {
        jumpForward(1);
    } else {
        jumpBackward(1);
    }
    show("knight");
    if (count > 200) {
        count = 0;
    }
}
when("tick", ticker);
