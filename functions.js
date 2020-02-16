/* eslint-env browser */

"use strict";

// setScene(scene)
// set the background scene
// setScene("park");
function setScene(id) {
  $._drawBackground(id);
}

// penColor(color)
// change the color of the pencil (use "random" for a random color)
// penColor("blue");
function penColor(color) {
  $._setColor(color);
}

// randomColor()
// return a random color
// randomColor();
function randomColor() {
  return "rgb(" + random(0, 235) +
    ", " + random(0, 235) +
    ", " + random(0, 235) + ")";
}

// random(min, max)
// return a random number between min and max
// random(1, 10);
function random(min, max) {
  if (min > max) {
    const c = min;
    min = max;
    max = c;
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//# aliases for studio.code.org
const math_random_int = random;
const color_random = randomColor;
const penColour = penColor;
const colour_random = color_random;

// penWidth(width)
// set the width of the pen
// penWidth(10);
function penWidth(width) {
  $._lineWidth(width);
}

// penCap(cap)
// set the cap of the pen. cap is one of "butt", "round", "square"
// penCap("square");
function penCap(cap) {
  $._lineCap(cap);
}

// direction(degree)
// set the direction to a certain number of degree
// direction(90);
function direction(degree) {
  $._direction(degree);
}

// turnRight(degree)
// turn clockwise given a certain number of degree
// turnRight(90);
function turnRight(degree) {
  if (degree === undefined) degree = 90;
  $._turn(degree);
}

// turnLeft(degree)
// turn counter-clockwise given a certain number of degree
// turnLeft(45);
function turnLeft(degree) {
  if (degree === undefined) degree = 90;
  $._turn(0-degree);
}

// moveTo(x, y)
// move forward to a certain point
// moveTo(10, 10);
function moveTo(x, y, pen) {
  let withPen = true;
  if (pen !== undefined) {
    withPen = pen;
  }
  $._moveTo(x, -y, withPen);
}

// moveForward(distance)
// move forward given a certain distance
// moveForward(100);
function moveForward(distance) {
  if (distance === undefined) distance = 50;
  $._move(distance, true);
}

// moveBackward(distance)
// move backward given a certain distance
// moveBackward(50);
function moveBackward(distance) {
  if (distance === undefined) distance = 50;
  $._move(0-distance, true);
}

// jumpTo(x, y)
// jump forward to a certain point
// jumpTo(10, 10);
function jumpTo(x, y) {
  $._moveTo(x, -y, false);
}

// jumpForward(distance)
// jump forward given a certain distance
// jumpForward(50);
function jumpForward(distance) {
  $._move(distance, false);
}

// jumpBackward(distance)
// jump backward given a certain distance
// jumpBackward(50);
function jumpBackward(distance) {
  $._move(0-distance, false);
}

// rect(width, height, [fill])
// draw a rectangle
// rect(20, 10, "red");
function rect(width, height, fill) {
  $._rect(width, -height, fill);
}

// text(text, [fontStyle])
// write a text
// text("Hello"); text("Hello", "20px sans-serif");
function text(text, fontStyle) {
  $._text(text, fontStyle);
}

// getCurrentPosition()
// return the current position as an object with x, y, and orientation
// getCurrentPosition();
function getCurrentPosition() {
  return $._getCurrentPosition();
}

// moveToCenter()
// back to the center, ready to move up
// moveToCenter();
function moveToCenter() {
  $._resetToCenter();
}

// clear()
// clear the drawing and move back to center
// clear();
function clear() {
  $._clear();
}

// show(character, [effect])
// display a character with an optional effect ("mirror", "big", etc.)
// show("knight"); show("princess", "small");
function show(character, e) {
  let scale = 1;
  let effect = false;
  if (e !== undefined && typeof e === "string") {
    const effects = e.split(',');
    for (let i = effects.length - 1; i >= 0; i--) {
      switch(effects[i]) {
      case "mirror":
        effect = true;
        break;
      case "big":
      case "double":
      case "2":
        scale = scale * 0.5;
        break;
      case "small":
      case "half":
      case "1/2":
        scale = scale * 2;
        break;
      case "third":
      case "1/3":
        scale = scale * 3;
        break;
      case "quarter":
      case "1/4":
        scale = scale * 4;
        break;
      }
    }
  }
  $._drawCharacter(character.toLowerCase(), scale, effect);
}

// when(eventName, [keyboard], function)
// react to events "mouse", "keyboard", and "tick"
// when("mouse", fct); when("key", "a", fct); when("tick", fct);
function when(event, arg1, arg2) {
  switch (event.toLowerCase()) {
    case "mouse":
      if (typeof arg1 !== "function") {
        throw { message: 'when("mouse", fct) needs a function' };
      }
      $._onmouse(arg1);
      break;
    case "tick":
      if (typeof arg1 !== "function") {
        throw { message: 'when("tick", fct) needs a function' };
      }
      $._ontick(arg1);
      break;
    case "keyboard":
      if (typeof arg1 !== "string") {
        throw { message: 'when("keyboard", string, fct) needs a string for the key' };
      }
      if (typeof arg2 !== "function") {
        throw { message: 'when("keyboard", string, fct) needs a function' };
      }
      $._onkey(arg1.toLowerCase(), arg2);
      break;
  }
}

// require(script)
// require a script library
// require("myOwnFigure");
function require(scriptId) {
  //# ignored since we evaluate require differently
}
