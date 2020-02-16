/* eslint-env browser */

"use strict";

function evaluator(__script__) {
  eval(__script__);
}

const $ = new (function () {
const world = function() {};

function createLayer() {
  const elC = document.createElement("canvas");
  elC.width = 800;
  elC.height = 800;
  return elC.getContext("2d");
}


// hello world
world.canvas =  createLayer();
world.composite = createLayer();
world.cscreen = document.getElementById("screen").getContext("2d");
world.width = world.canvas.canvas.width;
world.height = world.canvas.canvas.height;
world.cx = world.width / 2;
world.cy = world.height / 2;
world.x = 0;
world.y = 0;
world.angle = 0; // in degree

world.composite.fillStyle = "#fff";

world.canvas.translate(world.cx, world.cy);

world.runAnimation = false;
world.frames = 0;

const buttons = function() {};
buttons.run = document.getElementById('run');
buttons.stop = document.getElementById("stop");
buttons.clear = document.getElementById("clear");
buttons.repeat = document.getElementById('repeat');
buttons.load = document.getElementById('load');
buttons.save = document.getElementById('save');
buttons.examples = document.getElementById('examples');

function animateLoop () {
  if (world.runAnimation) {
    window.requestAnimationFrame(animateLoop);
    if ((world.frames % 2) === 0) {
      updateScreen();
    }
    world.frames++;
    if (world.frames == 60) world.frames = 0;
  } else {
    world.frames = 0;
  }
}

world.background = null;

function backgroundObject(imgEl) {
  this.el = imgEl;

  this.render = function(ctx) {
    ctx.drawImage(this.el, 0, 0);
  };
}

world.sprites = [];

world.effects = function () {};

function sprite(imgEl, angle, x, y, scale, effect) {
  this.el = imgEl;
  this.rad = (world.angle) * (Math.PI / 180);
  this.x = x + world.cx;
  this.y = y + world.cy;
  this.effect = effect;
  this.scale = scale;

  this.render = function(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.effect) ctx.scale(-1, 1);
    ctx.rotate(this.rad);
    ctx.drawImage(this.el,
     - (imgEl.width/(2*this.scale)) , - (imgEl.height/(2*this.scale)),
      (imgEl.width/this.scale), (imgEl.height/this.scale));
    ctx.restore();
  };
}

function updateScreen() {
  world.composite.fillRect(0, 0, world.width, world.height);
  if (world.background !== null) world.background.render(world.composite);
  world.composite.drawImage(world.canvas.canvas, 0, 0);
  for (const key in world.sprites) {
    world.sprites[key].render(world.composite);
  }
  world.cscreen.drawImage(world.composite.canvas, 0, 0);
}

world.canvas.lineCap = 'round';


function setColor(color) {
  if (color == "random") {
    color = "rgb(" + Math.round(235 * Math.random()) +
      ", " + Math.round(235 * Math.random()) +
      ", " + Math.round(235 * Math.random()) + ")";
  }
  world.canvas.strokeStyle = color;
  world.canvas.fillStyle = color;
}

this._setColor = function (color) {
  setColor(color);
};

this._lineWidth = function (width, cap) {
  world.canvas.lineWidth = width;
};

this._lineCap = function (cap) {
  world.canvas.lineCap = cap;
};

function resetToCenter() {
  world.x = 0;
  world.y = 0;
  world.angle=0;
}
this._resetToCenter = resetToCenter;

function _clear() {
  _clearCallbacks();
  world.runAnimation = false;
  world.background = null;
  world.canvas.clearRect(-(world.width/2), -(world.height/2), world.width, world.height);
  world.sprites = [];
  world.cscreen.clearRect(0, 0, world.width, world.height);
  resetToCenter();
  setColor('#000');
  world.canvas.lineWidth = 1;
  world.canvas.lineCap = 'round';
  const imgs = document.querySelectorAll("#characters img");
  for (let i = 0; i < imgs.length; i++) {
    imgs.item(i).style.visibility = "visible";
  }
}
this._clear = _clear;

function _drawLine(tx, ty) {
  world.canvas.beginPath();
  world.canvas.moveTo(world.x, world.y);
  world.canvas.lineTo(tx, ty);
  world.canvas.stroke();
  world.canvas.closePath();
}

function _drawRect(tx, ty, tw, th, fill) {
  if (fill !== undefined) {
    const savedStyle = world.canvas.fillStyle;
    world.canvas.fillStyle = fill;
    world.canvas.fillRect(tx, ty, tw, th);
    world.canvas.fillStyle = savedStyle;
  } else {
    world.canvas.strokeRect(tx, ty, tw, th);
  }
}

function _drawText(text, tx, ty, font) {
  world.canvas.font = font;
  world.canvas.fillText(text, tx, ty);
}

this._turn = function (degree) {
  world.angle = (world.angle + degree) % 360;
};

this._direction = function (degree) {
  world.angle = degree % 360;
};

this._move = function (distance, pen) {
  const rad = (world.angle-90) * (Math.PI / 180);
    const endX = world.x + Math.round(Math.cos(rad)*distance);
    const endY = world.y + Math.round(Math.sin(rad)*distance);
    if (pen) {
      _drawLine(endX, endY);
    }
  world.x = endX;
  world.y = endY;
};

this._moveTo = function (endX, endY, pen) {
  if (pen) {
    _drawLine(endX, endY);
  }
  world.x = endX;
  world.y = endY;
};

this._rect = function (width, height, fill) {
  _drawRect(world.x, world.y, width, height, fill);
};

this._text = function (text, font) {
  if (font === undefined) {
    font = "20px sans-serif";
  }
  _drawText(text, world.x, world.y, font);
};

this._getCurrentPosition = function () {
  return { "x": world.x, "y": world.y, "orientation": world.angle };
};

const callbacks = function () {};

callbacks.mouse_callbacks = [];
this._onmouse = function (callback) {
  const s = document.getElementById("screen");
  const c = function (e) {
      const rect = s.getBoundingClientRect();
      callback(e.clientX-rect.left-(world.width/2),
              -(e.clientY-rect.top-(world.height/2)));
      updateScreen();
    };
  s.addEventListener("click", c, true);
  callbacks.mouse_callbacks.push(c);
};
callbacks.keyboard_callbacks = [];
this._onkey = function (key, callback) {
  const c = function (e) {
    const nodeName = e.target.nodeName;
    if (nodeName !== "INPUT" && nodeName !== "TEXTAREA" && e.key) {
      const keydown = e.key.toLowerCase();
      if (keydown === key || key === "all") {
        e.preventDefault();
        callback(keydown);
        updateScreen();
      }
    }
  };
  document.addEventListener("keydown", c, true);
  callbacks.keyboard_callbacks.push(c);
};
callbacks.tick_callbacks = [];
callbacks.ticker = null;
function addTicker(callback) {
  function invoke(e) {
    e();
  }
  callbacks.tick_callbacks.push(callback);
  if (callbacks.ticker === null) {
    const t = callbacks.tick_callbacks;
    callbacks.ticker = window.setInterval(function () {
      t.forEach(invoke);
    }, 34);
  }
}
function removeTicker(callback) {
  const t = callbacks.tick_callbacks;
  const newArray = callbacks.tick_callbacks.filter(function (e) {
    if (callback === e) return false;
    return true;
  });
  callbacks.tick_callbacks = newArray;
}
this._ontick = function (callback) {
  try {
    callback();
    addTicker(callback);
  } catch (e) {
    console.log(e);
    popup.clear();
    world.error.querySelector("p").textContent = e.message;
    popup.cancel.hide();
    popup.content.set(world.error);
    popup.show();
  }
};
function _clearCallbacks() {
  const s = document.getElementById("screen");
  callbacks.mouse_callbacks.forEach(function (e) {
    s.removeEventListener("click", e, true);
  });
  callbacks.keyboard_callbacks.forEach(function (e) {
    document.removeEventListener("keydown", e, true);
  });
  if (callbacks.ticker !== null) {
    window.clearInterval(callbacks.ticker);
    callbacks.ticker = null;
  }
  callbacks.mouse_callbacks = [];
  callbacks.keyboard_callbacks = [];
  callbacks.tick_callbacks = [];
}

world.img_loaded = [];

(function() {
  const imgs = document.querySelectorAll("#characters img");
  for (let i = 0; i < imgs.length; i++) {
    const el = imgs.item(i);
    world.img_loaded[el.id] = el;
  }
})();

this._drawBackground = function (id) {
  const sid = "back-" + id;
  const element = world.img_loaded[sid];

  function onLoadImage() {
    world.img_loaded[sid] = element;
    world.background = new backgroundObject(element);
  }
  function onError() {
    element.parentNode.removeChild(element);
  }

  if (element === false) {
    return; /// abort
  } else if (element !== undefined) {
    onLoadImage();
  } else {
    world.img_loaded[sid] = false;
    const hidden_images = document.getElementById("hidden_images");
    element = document.createElement("img");
    element.id = sid;
    element.src = "backgrounds/" + id + ".png";
    hidden_images.appendChild(element);
    element.addEventListener("load", onLoadImage, false);
    element.addEventListener("error", onError, false);
  }
};

this._drawCharacter = function (id, scale, effect) {
  const sid = "character-" + id;
  const element = world.img_loaded[sid];
  const sx = world.x, sy = world.y, sangle = world.angle;

  function onLoadImage() {
    world.img_loaded[sid] = element;
    world.sprites[element.id] = new sprite(element, sangle, sx, sy, scale, effect);
  }
  function onError() {
    element.parentNode.removeChild(element);
  }
  if (element === false) {
    return; // abort, we failed to load in the past or we're loading
  } else if (element !== undefined) {
    element.style.visibility = "hidden";
    onLoadImage();
  } else {
    world.img_loaded[sid] = false;
    const hidden_characters = document.getElementById("hidden_characters");
    element = document.createElement("img");
    element.id = sid;
    element.src = "characters/" + id + ".png";
    hidden_characters.appendChild(element);
    element.addEventListener("load", onLoadImage, false);
    element.addEventListener("error", onError, false);
  }
};

var editor = function () {};

editor.aceEditor = ace.edit("editor");
editor.aceEditor.setTheme("ace/theme/cobalt"); //cobalt
editor.aceEditor.getSession().setMode("ace/mode/javascript");

editor.getValue = function () {
  return editor.aceEditor.getValue();
};
editor.setValue = function (value) {
  return editor.aceEditor.setValue(value);
};
editor.clear = function () {
  editor.aceEditor.setValue("");
};
editor.focus = function () {
  editor.aceEditor.focus();
};

world.error = document.getElementById('error');

world.env = null;

function createEnv() {
  const obj = {};
  const scripts = [];
  const pendingScripts = 0;
  const requireMatch = /require\(".*[^"]+".*\)/g;
  const stringMatch = /"([^"]+)"/;

  function __findRequire(script) {
    const external = script.match(requireMatch);
    if (external !== null) {
      for (let i = 0; i < external.length; i++) {
        external[i] = external[i].match(stringMatch)[1].trim();
      }
    }
    return external;
  }

  function __hasRequire(id) {
    for (let i = scripts.length - 1; i >= 0; i--) {
       if (scripts[i].id === id) {
        return true;
       }
    }
    return false;
  }

  obj.__require = async function (scriptId) {
    pendingScripts++;
    store.getValue(scriptId)
      .then(r => {
        if (r !== undefined) {
          obj.__evaluate(scriptId, r);
        }
        pendingScripts--;
      }).catch(console.error);
  };

  obj.__evaluate = function (id, script) {
    const requires = __findRequire(script);
    scripts.push({ id: id, script: script});
    if (requires !== null) {
      for (let i = requires.length - 1; i >= 0; i--) {
        const nid = requires[i];
        if (!__hasRequire(nid)) {
          obj.__require(nid);
        }
      }
    }
  };

  obj.execute = function (script) {
    obj.__evaluate("", script);
    run();
  };


  const tryRun = 0;

  function run() {
    if (pendingScripts !== 0) {
      if (tryRun < 10) {
        tryRun++;
        setTimeout(function () { run(); }, 300);
      }
    } else {
      let source = "";
      for (let i = scripts.length - 1; i >= 0; i--) {
        source += "\n" + scripts[i].script;
      }
      evaluator(source);
      if (!world.runAnimation) {
        world.runAnimation = true;
        requestAnimationFrame(animateLoop);
        if (callbacks.tick_callbacks.length === 0) {
          setTimeout(function () { world.runAnimation = false; }, 5000);
        }
      }
    }
  }

  return obj;
}

var _DOM_KEY_LOCATION_STANDARD = 0x00 // Default or unknown location
, _DOM_KEY_LOCATION_LEFT = 0x01 // e.g. Left Alt key
, _DOM_KEY_LOCATION_RIGHT = 0x02 // e.g. Right Alt key
, _DOM_KEY_LOCATION_NUMPAD = 0x03 // e.g. Numpad 0 or +
, _DOM_KEY_LOCATION_MOBILE = 0x04
, _DOM_KEY_LOCATION_JOYSTICK = 0x05;

world.KEY_MAP = {
3: 'Cancel', // char \x0018 ???
6: 'Help', // ???
8: 'Backspace',
9: 'Tab',
12: 'Clear', // NumPad Center
13: 'Enter',
16: 'Shift',
17: 'Control',
18: 'Alt',
19: 'Pause', // TODO:: not in [key-values-list], but usefull
20: 'CapsLock',
21: 'KanaMode', // IME
22: 'HangulMode', // IME
23: 'JunjaMode', // IME
24: 'FinalMode', // IME
25: 'HanjaMode', // IME
// 0x19: 'KanjiMode', keyLocation: _KeyboardEvent.DOM_KEY_LOCATION_STANDARD, // IME; duplicate on Windows
27: 'Esc',
28: 'Convert', // IME
29: 'Nonconvert', // IME
30: 'Accept', // IME
31: 'ModeChange', // IME
32: 'Spacebar',
33: 'PageUp',
34: 'PageDown',
35: 'End',
36: 'Home',
37: 'ArrowLeft',
38: 'ArrowUp',
39: 'ArrowRight',
40: 'ArrowDown',
41: 'Select',
//42: 'Print', // ??? not in [key-values-list]
43: 'Execute',
44: 'PrintScreen',
45: 'Insert',
46: 'Del',
47: 'Help', // ???
91: { _key: 'OS', _char: false, _location: _DOM_KEY_LOCATION_LEFT }, // Left Windows
92: { _key: 'OS', _char: false, _location: _DOM_KEY_LOCATION_RIGHT }, // Right Windows
93: 'Menu', // 'Context Menu' from [OLD key-values-list]
106: { _key: 'Multiply', _char: '*', _location: _DOM_KEY_LOCATION_NUMPAD }, // or 'Asterisk' ?
107: { _key: 'Add', _char: '+', _location: _DOM_KEY_LOCATION_NUMPAD },
108: { _key: 'Separator', _char: false, _location: _DOM_KEY_LOCATION_NUMPAD }, // ??? NumPad Enter ???
109: { _key: 'Subtract', _char: '-', _location: _DOM_KEY_LOCATION_NUMPAD },
110: { _key: 'Decimal', _char: '.', _location: _DOM_KEY_LOCATION_NUMPAD },
111: { _key: 'Divide', _char: '/'/* TODO:: or '\u00F7' */, _location: _DOM_KEY_LOCATION_NUMPAD },
144: { _key: 'NumLock', _char: false, _location: _DOM_KEY_LOCATION_NUMPAD },
145: 'ScrollLock',
180: 'LaunchMail',
181: 'SelectMedia',
182: 'LaunchApplication1',
183: 'LaunchApplication2',
224: 'Meta', // Apple Command key
229: 'Process', // IME
246: 'Attn',
247: 'Crsel',
248: 'Exsel',
249: 'EraseEof',
251: 'Zoom',
254: 'Clear',
186: ';'// 'ж', ';', ':'
, 187: '='
, 188: ','// 'б', ',', '<'
, 189: '-'
, 190: '.'// 'ю', '.', '>'
, 191: '/'// '.', '/', '?'
, 192: '`'// 'ё', '`', '~'
, 219: '['// 'х', '[', '{'
, 220: '\\'//'\', '\', '|'
, 221: ']'// 'ъ', '[', '{'
, 222: "'"// 'э', '"', '''
, 226: '\\'// '\', '|', '/'
};

function getKey(keyEvent) {
  return keyEvent.code;
}
/*
  if (keyEvent.key === undefined) {
    const value = world.KEY_MAP[keyEvent.keyCode];
    if (typeof value === "string") {
      keyEvent.key = value;
    } else if (value !== undefined) {
      keyEvent.key = value._key;
    } else if (keyEvent.keyCode >= 48 && keyEvent.keyCode <= 57) {
      keyEvent.key = "" + (keyEvent.keyCode - 48);
    } else if (keyEvent.keyCode >= 65 && keyEvent.keyCode <= 90) {
      keyEvent.key = editor.characters.charAt(keyEvent.keyCode - 65);
    } else {
      console.log("Unknown keyCode " + keyEvent.keyCode);
      keyEvent.key = "";
    }
  }
  return keyEvent.key;
}
*/

buttons.runHandler = function () {
  world.env = createEnv();
  _clear();
  try {
    world.env.execute(editor.getValue());
  } catch (e) {
    console.log(e);
    popup.clear();
    world.error.querySelector("p").textContent = e.message;
    popup.cancel.hide();
    popup.content.set(world.error);
    popup.show();
  }
};

buttons.run.addEventListener("click", buttons.runHandler, run);

buttons.stop.addEventListener("click", _clear, true);

buttons.clearHandler = function () {
  _clear();
  editor.clear();
  editor.focus();
};

buttons.clear.addEventListener("click", buttons.clearHandler, true);

editor.indexC = 0;
editor.characters = 'abcdefghijklmnopqrstuvwxyz';

editor.getChar = function () {
  if (editor.indexC == editor.characters.length) {
    editor.indexC = 0;
  }
  return editor.characters.charAt(editor.indexC++);
};

// really simple checker function for javascript language
editor.countCharacter = function (s, ref) {
  const text = s;
  const length = text.length;
  let count = 0;
  let c;

  for (let i = 0; i < length; i++) {
        c = text.charAt(i);
    if (c == ref) {
      count++;
    }
  }
  return count;
};

editor._INDENT = "                                                     ";

buttons.repeatHandler = function () {
  const l = editor.getChar();
  const pos = editor.aceEditor.getCursorPosition();
  editor.aceEditor.insert("\nfor (let "+ l + " = 1; " + l + " <= 2; "+l+"++) {\n\t\t\n}\n");
  editor.indent();
  editor.aceEditor.moveCursorTo(pos.row+2, pos.column);
  editor.focus();
};
buttons.repeat.addEventListener("click", buttons.repeatHandler, true);

// really simple beautifier function for javascript indentation
editor.indent = function () {
  const text = editor.getValue();
  const length = text.length;
  let value = "";
  let indentation = 0;
  let seenNewLine = true;
  let alreadyReduced = false;
  let c;

  for (let i = 0; i < length; i++) {
        c = text.charAt(i);
        if (seenNewLine) {
          while ((c == ' ' || c == '\t') && i < length) {
                i++; c = text.charAt(i); // eat spaces
          }
          if (c != '\n') {
                if (c == '}') {
                        indentation = indentation - 4;
                        alreadyReduced = true;
                }
                value += editor._INDENT.substring(0, indentation);
                seenNewLine = false;
          }
        } else {
        }
    value += c;
    if (c == '\n') {
          seenNewLine = true;
    } else if (c == '{') {
      indentation += 4;
    } else if (c == '}') {
      if (!alreadyReduced) indentation = indentation - 4;
      alreadyReduced = false;
    } else if (c == ' ') {
          while ((c == ' ' || c == '\t') && i < length) {
                i++;  c = text.charAt(i); // eat spaces
          }
          if (i < length) i--;
    }
  }
  editor.setValue(value);
  editor.aceEditor.clearSelection();
};

var popup = function () {};

popup.popupElement = document.getElementById("popup");

popup.hide = function () {
  popup.popupElement.style.display = "none";
  popup.popupElement.setAttribute("aria-disabled", "true");
};
popup.clear = function () {
  popup.content.clear();
  popup.ok.clear();
  popup.cancel.clear();
  popup.hide();
};

popup.show = function () {
  popup.popupElement.style.display = "block";
  popup.popupElement.setAttribute("aria-disabled", "false");
};

popup.content = { content: document.getElementById("popup-content") };
popup.content.clear = function () {
  popup.content.textContent = "";
};
popup.content.set = function (content) {
  if (typeof content === "string") {
    popup.content.content.textContent = content;
  } else {
    popup.content.content.textContent = "";
    popup.content.content.appendChild(content);
  }
};

popup.ok = { content: document.getElementById("popup-ok-button") };
popup.ok.clear = function () {
  popup.ok.show();
  popup.ok.setLabel("Ok");
  popup.ok.setHandler(popup.ok.defaultHandler);
};
popup.ok.show = function () {
  popup.ok.content.style.display = 'inline';
};
popup.ok.hide = function () {
  popup.ok.content.style.display = 'none';
};
popup.ok.setLabel = function (label) {
  popup.ok.content.textContent = label;
};
popup.ok.setHandler = function (handler) {
  if (popup.ok.handler !== undefined) {
    popup.ok.clearHandler();
  }
  popup.ok.handler = handler;
  popup.ok.content.addEventListener("click", handler, true);
};
popup.ok.clearHandler = function () {
  if (popup.ok.handler !== undefined) {
    popup.ok.content.removeEventListener("click", popup.ok.handler, true);
    popup.ok.handler = undefined;
  }
};
popup.ok.defaultHandler = function () {
  popup.clear();
};

popup.cancel = { content: document.getElementById("popup-cancel-button") };
popup.cancel.clear = function () {
  popup.cancel.show();
  popup.cancel.setLabel("Cancel");
  popup.cancel.setHandler(popup.cancel.defaultHandler);
};
popup.cancel.show = function () {
  popup.cancel.content.style.display = 'inline';
};
popup.cancel.hide = function () {
  popup.cancel.content.style.display = 'none';
};
popup.cancel.setLabel = function (label) {
  popup.cancel.content.textContent = label;
};
popup.cancel.setHandler = function (handler) {
  if (popup.cancel.handler !== undefined) {
    popup.cancel.clearHandler();
  }
  popup.cancel.handler = handler;
  popup.cancel.content.addEventListener("click", handler, true);
};
popup.cancel.clearHandler = function () {
  if (popup.cancel.handler !== undefined) {
    popup.cancel.content.removeEventListener("click", popup.cancel.handler, true);
    popup.cancel.handler = undefined;
  }
};
popup.cancel.defaultHandler = function () {
  popup.clear();
};

popup.clear();
popup.hide();

var HTTP = function () {};

HTTP.put = function(resource, body, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
        if (this.status !== 200) {
          callback();
        } else {
          callback({ message: "Status is " + this.status});
        }
    }
  };
  try {
    xhr.open("PUT", resource, true);
    xhr.send(body);
  } catch (e) {
    console.log(e);
  }
};

const userId = {
  name: "dummy"
};

const store = {
  keys: [],
  values: {}
};

store.path = '/store/' + userId.name;

store.load = async function (callback) {
  return fetch(store.path)
    .then(res => res.json())
    .then(data => {
      store.keys = data;
      if (callback !== undefined) {
        callback(store.keys);
      }
    }).catch(console.error);
};

store.hasKey = function (key) {
  for (let i = store.keys.length - 1; i >= 0; i--) {
    if (store.keys[i].key === key) return true;
  }
  return false;
};

store.addKey = function (key) {
  if (!store.hasKey(key.key)) {
    store.keys.push(key);
  }
};

store.getNewKey = function () {
  const key = "" + Math.round(10000 * Math.random());
  if (store.hasKey(key)) {
    return store.getNewKey();
  }
  return key;
};

store.getValue = async function (key) {
  if (store.values[key] !== undefined) {
    return callback(store.values[key]);
  }
  return fetch(store.path+ "/"+key)
    .then(res => res.text())
    .then(text => {
      store.values[key] = text;
      return text;
    });
};

store.addValue = async function (key, value) {
  store.addKey({ key: key, title: value.title, description: value.description });
  const obj = { title: value.title, description: value.description, script: value.script };
  return fetch(store.path + "/"+key, {
      method:"PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }).then(() => key);
};

store.load();

store.form = document.getElementById("save-form");
store.titleInput = store.form.querySelector("input");
store.descriptionInput = store.form.querySelector("textarea");

buttons.saveHandler = function () {
  const id = store.getNewKey();
  popup.clear();
  popup.content.set(store.form);
  popup.ok.setHandler(function() {
    const id = "" + Math.round(10000 * Math.random());
    const text = editor.getValue();
    const title = store.titleInput.value || id;
    const description = store.descriptionInput.value || "";
    const obj = {
      title: title.trim(),
      description: description.trim(),
      script: text
    };
    store.addValue(id, obj).then(k => {
      console.log("Stored " + k);
    }).catch(console.error);
    store.titleInput.value = "";
    store.descriptionInput.value = "";
    popup.clear();
  });
  popup.show();
};

buttons.save.addEventListener("click", buttons.saveHandler, true);

store.loadContainer = document.getElementById("keys");
buttons.loadHandler = function () {
  const selected = null;
  async function pick(e) {
      return store.getValue(e.target.getAttribute("data-key"))
        .then(r => {
          if (r !== undefined) {
            editor.setValue(r);
            editor.aceEditor.clearSelection();
          }
          popup.hide();
          editor.focus();
          return r;
        }).catch(console.error);
  }
  store.loadContainer.textContent = "";
  popup.clear();
  for (let i = store.keys.length - 1; i >= 0; i--) {
    const item = store.keys[i];
    const a = document.createElement("a");
    a.href = '#';
    a.setAttribute("class", "button");
    a.setAttribute("role", "button");
    a.setAttribute("style", "display: inline-block; margin: 1ex;");
    a.setAttribute("data-key", item.key);
    a.textContent = item.key + ":" + item.title;
    a.addEventListener('click', pick, true);
    store.loadContainer.appendChild(a);
  }
  popup.content.set(store.loadContainer);
  popup.ok.hide();
  popup.show();
};

buttons.load.addEventListener("click", buttons.loadHandler, true);

var examples = function () {};

examples.path = '/examples';
examples.keys = [];
examples.scripts = {};

examples.load = async function (callback) {
  return fetch(examples.path)
    .then(res => res.json())
    .then(data => {
      examples.keys = data;
      if (callback !== undefined) {
        callback(examples.keys);
      }
    })
    .catch(console.error);
};

examples.getScript = function (key, callback) {
  if (examples.scripts[key] !== undefined) {
    return callback(examples.scripts[key]);
  }
  return fetch(examples.path+ "/"+key)
    .then(res => res.text())
    .then(text => {
      examples.scripts[key] = text;
      if (callback !== undefined) {
        callback(text);
      }
    })
    .catch(console.error);
};

examples.load();

examples.loadContainer = document.getElementById("examples-form");
buttons.examplesHandler = function () {
  const selected = null;
  function pick(e) {
      examples.getScript(e.target.getAttribute("data-key"), function (r) {
        if (r !== undefined) {
          editor.setValue(r);
          editor.aceEditor.clearSelection();
        }
        popup.hide();
        editor.focus();
      });
  }
  examples.loadContainer.textContent = "";
  popup.clear();
  for (let i = examples.keys.length - 1; i >= 0; i--) {
    const item = examples.keys[i];
    const a = document.createElement("a");
    a.href = '#';
    a.setAttribute("class", "button");
    a.setAttribute("role", "button");
    a.setAttribute("style", "display: inline-block; margin: 1ex;");
    a.textContent = item.title;
    a.setAttribute("data-key", item.key);
    a.addEventListener('click', pick, true);
    examples.loadContainer.appendChild(a);
  }
  popup.content.set(examples.loadContainer);
  popup.ok.hide();
  popup.show();
};
buttons.examples.addEventListener("click", buttons.examplesHandler, true);


editor.focus();
}
)();

