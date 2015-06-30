var io = require("./io-promise");

io.read("functions.js").then(function (data) {
  var lines = data.split('\n');
  var commentChunk = [];
  var functions = [];
  var ci = 0;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.indexOf('// ') === 0) {
      commentChunk[ci++] = line.substr(3);
      if (ci === 3) {
        functions.push({
          name: commentChunk[0],
          description: commentChunk[1],
          example: commentChunk[2]});
        ci = 0;
      }
    }
  }
  if (ci !== 0) {
    console.log("WARNING: remaining lines");
    console.log(commentChunk);
  }
  return functions;
}).catch(function (err) {
  console.log("LOADING ERROR " + err);
}).then(function (functions) {
  var fctStr = "";
  functions.forEach(function (f) {
    fctStr += "\n<dt><code>" + f.name + "</code></dt>"
      + "\n<dd>"
      + "\n<p>" + f.description + "</p>"
      + "\n<pre class='example highlight'>" + f.example + "</pre>"
      + "\n</dd>";
  })
  return io.read("docs/doc-template.html").then(function (template) {
    var doc = template.replace("@@", fctStr);
    return io.save("docs/index.html", doc);
  });
}).catch(function (err) {
  console.log("ERROR " + err);
});
