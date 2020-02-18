/* eslint-env browser */

"use strict";

function evaluator(__script__) {
  eval(__script__);
}

const $ = new (function () {

  const world = {};

  function createLayer() {
    const elC = document.createElement("canvas");
    elC.width = 800;
    elC.height = 800;
    return elC.getContext("2d");
  }


  // hello world
  world.canvas = createLayer();
  world.composite = createLayer();
  world.cscreen = document.getElementById("screen").getContext("2d");
  world.width = world.canvas.canvas.width;
  world.height = world.canvas.canvas.height;
  world.cx = world.width / 2;
  world.cy = world.height / 2;
  world.x = 0;
  world.y = 0;
  world.angle = 0; // in degree
  world.beginAt = 0;

  world.composite.fillStyle = "#fff";

  world.canvas.translate(world.cx, world.cy);

  const buttons = {};
  buttons.run = document.getElementById('run');
  buttons.stop = document.getElementById("stop");
  buttons.clear = document.getElementById("clear");
  buttons.repeat = document.getElementById('repeat');
  buttons.load = document.getElementById('load');
  buttons.save = document.getElementById('save');
  buttons.examples = document.getElementById('examples');

  world.runAnimation = false;

  function animateLoop() {
    if (world.runAnimation) {
      window.requestAnimationFrame(animateLoop);
      updateScreen();
    }
  }

  world.background = null;

  function backgroundObject(imgEl) {
    this.el = imgEl;

    this.render = function (ctx) {
      ctx.drawImage(this.el, 0, 0);
    };
  }

  world.sprites = [];

  world.effects = function () { };

  class Sprite {
    constructor(imgEl, angle, x, y, scale, effect) {
      this.img = imgEl;
      this.rad = angle * (Math.PI / 180);
      this.x = x + world.cx;
      this.y = y + world.cy;
      this.effect = effect;
      this.scale = scale;
    }
    render(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rad);
      if (this.effect) ctx.scale(-1, 1);
      ctx.drawImage(this.img,
        - (this.img.width / (2 * this.scale)), - (this.img.height / (2 * this.scale)),
        (this.img.width / this.scale), (this.img.height / this.scale));
      ctx.restore();
    }
  }

  function updateScreen() {
    world.composite.fillRect(0, 0, world.width, world.height);
    if (world.background !== null) world.background.render(world.composite);
    world.composite.drawImage(world.canvas.canvas, 0, 0);
    for (const value of Object.values(world.sprites)) {
      value.render(world.composite);
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
    world.angle = 0;
  }
  this._resetToCenter = resetToCenter;

  function _clearPaint() {
    world.runAnimation = false;
    world.background = null;
    world.canvas.clearRect(-(world.width / 2), -(world.height / 2), world.width, world.height);
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
  this._clearPaint = _clearPaint;

  function _clearEvents() {
    world.runAnimation = false;
    _clearCallbacks();
  }
  this._clearEvents = _clearEvents;

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
      world.canvas.save();
      world.canvas.fillStyle = fill;
      world.canvas.translate(tx, ty);
      world.canvas.rotate((world.angle) * (Math.PI / 180));
      world.canvas.fillRect(0, 0, tw, th);
      world.canvas.restore();
      world.canvas.fillStyle = savedStyle;
    } else {
      world.canvas.strokeRect(tx, ty, tw, th);
    }
  }

  function _drawText(text, tx, ty, font) {
    world.canvas.save();
    world.canvas.font = font;
    world.canvas.rotate((world.angle) * (Math.PI / 180));
    world.canvas.translate(tx, ty);
    world.canvas.fillText(text, 0, 0);
    world.canvas.restore();
  }

  this._turn = function (degree) {
    world.angle = (world.angle + degree) % 360;
  };

  this._direction = function (degree) {
    world.angle = degree % 360;
  };

  this._move = function (distance, pen) {
    const rad = (world.angle - 90) * (Math.PI / 180);
    const endX = world.x + Math.round(Math.cos(rad) * distance);
    const endY = world.y + Math.round(Math.sin(rad) * distance);
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

  const callbacks = function () { };

  callbacks.mouse_callbacks = [];
  this._onmouse = function (callback) {
    const s = document.getElementById("screen");
    const c = function (e) {
      const rect = s.getBoundingClientRect();
      callback(e.clientX - rect.left - (world.width / 2),
        -(e.clientY - rect.top - (world.height / 2)));
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
          callback(e.key);
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
      e((Date.now() - world.beginAt) / 1000);
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
    callbacks.tick_callbacks =
      callbacks.tick_callbacks.filter(e => (callback !== e));
  }
  this._ontick = function (callback) {
    try {
      callback((Date.now() - world.beginAt) / 1000);
      addTicker(callback);
    } catch (e) {
      popup.clear();
      world.error.querySelector("p").textContent = e.message;
      popup.cancel.hide();
      popup.content.set(world.error);
      popup.show();
    }
  };
  function _clearCallbacks() {
    const s = document.getElementById("screen");
    callbacks.mouse_callbacks.forEach(e =>
      s.removeEventListener("click", e, true)
    );
    callbacks.keyboard_callbacks.forEach(e =>
      document.removeEventListener("keydown", e, true)
    );
    if (callbacks.ticker !== null) {
      window.clearInterval(callbacks.ticker);
      callbacks.ticker = null;
    }
    callbacks.mouse_callbacks = [];
    callbacks.keyboard_callbacks = [];
    callbacks.tick_callbacks = [];
  }

  world.img_loaded = [];

  (function () {
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
      element.src = "backgrounds/" + id + ".png";
      hidden_images.appendChild(element);
      element.addEventListener("load", onLoadImage, false);
      element.addEventListener("error", onError, false);
    }
  };

  this._drawCharacter = function (id, scale, effect) {
    const sid = "character-" + id;
    let element = world.img_loaded[sid];
    const sx = world.x, sy = world.y, sangle = world.angle;

    function onLoadImage() {
      world.img_loaded[sid] = element;
      world.sprites[sid] = new Sprite(element, sangle, sx, sy, scale, effect);
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
      // element.id = sid;
      element.src = "characters/" + id + ".png";
      hidden_characters.appendChild(element);
      element.addEventListener("load", onLoadImage, false);
      element.addEventListener("error", onError, false);
    }
  };

  var editor = function () { };

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
    let pendingScripts = 0;
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
      scripts.push({ id: id, script: script });
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
      world.beginAt = Date.now();
      obj.__evaluate("", script);
      run();
    };


    let tryRun = 0;

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
          window.requestAnimationFrame(animateLoop);
          if (callbacks.tick_callbacks.length === 0) {
            setTimeout(function () { world.runAnimation = false; }, 5000);
          }
        }
      }
    }

    return obj;
  }

  function getKey(keyEvent) {
    return keyEvent.code;
  }

  buttons.runHandler = function () {
    world.env = createEnv();
    stop();
    try {
      world.env.execute(editor.getValue());
    } catch (e) {
      popup.clear();
      world.error.querySelector("p").textContent = e.message;
      popup.cancel.hide();
      popup.content.set(world.error);
      popup.show();
    }
  };

  buttons.run.addEventListener("click", buttons.runHandler, run);

  function stop() {
    _clearEvents();
    _clearPaint();
  }
  buttons.stop.addEventListener("click", stop, true);

  buttons.clearHandler = function () {
    stop();
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
    editor.aceEditor.insert("\nfor (let " + l + " = 1; " + l + " <= 2; " + l + "++) {\n\t\t\n}\n");
    editor.indent();
    editor.aceEditor.moveCursorTo(pos.row + 2, pos.column);
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
          i++; c = text.charAt(i); // eat spaces
        }
        if (i < length) i--;
      }
    }
    editor.setValue(value);
    editor.aceEditor.clearSelection();
  };

  var popup = function () { };

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

  const userId = {
    name: "dummy"
  };

  const store = {
    keys: [],
    values: {}
  };

  store.path = '/store/' + userId.name;

  store.load = async function () {
    return fetch(store.path)
      .then(res => res.json())
      .then(data => {
        store.keys = data;
        return store.keys;
      });
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
      return store.values[key];
    }
    return fetch(store.path + "/" + key)
      .then(res => res.text())
      .then(text => {
        store.values[key] = text;
        return text;
      });
  };

  store.addValue = async function (key, value) {
    store.addKey({ key: key, title: value.title, description: value.description });
    const obj = { title: value.title, description: value.description, script: value.script };
    return fetch(store.path + "/" + key, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj)
    }).then(() => key);
  };

  store.load().catch(console.error);

  store.form = document.getElementById("save-form");
  store.titleInput = store.form.querySelector("input");
  store.descriptionInput = store.form.querySelector("textarea");

  buttons.saveHandler = function () {
    const id = store.getNewKey();
    popup.clear();
    popup.content.set(store.form);
    popup.ok.setHandler(function () {
      const id = "" + Math.round(10000 * Math.random());
      const text = editor.getValue();
      const title = store.titleInput.value || id;
      const description = store.descriptionInput.value || "";
      const obj = {
        title: title.trim(),
        description: description.trim(),
        script: text
      };
      store.addValue(id, obj).catch(console.error);
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

  var examples = function () { };

  examples.path = '/examples';
  examples.keys = [];
  examples.scripts = {};

  examples.load = async function () {
    return fetch(examples.path)
      .then(res => res.json())
      .then(data => {
        examples.keys = data;
        return examples.keys
      });
  };

  examples.getScript = async function (key) {
    if (examples.scripts[key] !== undefined) {
      return examples.scripts[key];
    }
    return fetch(examples.path + "/" + key)
      .then(res => res.text())
      .then(text => {
        examples.scripts[key] = text;
        return text;
      });
  };

  examples.load().catch(console.error);

  examples.loadContainer = document.getElementById("examples-form");
  buttons.examplesHandler = function () {
    const selected = null;
    function pick(e) {
      examples.getScript(e.target.getAttribute("data-key"))
        .then(r => {
          if (r !== undefined) {
            editor.setValue(r);
            editor.aceEditor.clearSelection();
          }
          popup.hide();
          editor.focus();
        }).catch(console.error);
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

