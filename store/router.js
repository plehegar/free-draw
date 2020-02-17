var fs = require('fs');
var express = require('express');
var router = express.Router();

var metadata = {};

var storage_path = __dirname;
var keys_file = 'keys.json';

function load(user) {
  if (metadata[user] === undefined) {
    metadata[user] = {};
  }
  function loadMeta(id) {
    var value;
    try {
      content = fs.readFileSync(storage_path + '/' + user + '/' + id + '.json',
                  {options: "utf-8"});
      value = JSON.parse(content);
      value.id = id;
      value.user = user;
      metadata[user][id] = value;
    } catch (e) {
      console.log(e);
    }
  }

  fs.readdir(storage_path + '/' + user, function (err, files) {
    if (err) {
      console.log(err);
      return;
    }
    for (var i = files.length - 1; i >= 0; i--) {
      var file = files[i];
      if (file.endsWith(".json")) {
        loadMeta(file.substring(0, file.length-5));
      }
    }
  });
}

function loadScript(user, id) {
  try {
    return fs.readFileSync(storage_path + '/' + user + '/' + id + '.js',
                {options: "utf-8"});
  } catch (e) {
    console.log(e);
    return null;
  }
}

function save(user, id, script) {
	var value = metadata[user][id];
	fs.writeFile(storage_path + '/' + user + '/' + id + '.json', JSON.stringify(value),
		{options: "utf-8"}, function (err) {
			if (err) console.log(err);
		});
	fs.writeFile(storage_path + '/' + user + '/' + id + '.js', script,
		{options: "utf-8"}, function (err) {
			if (err) console.log(err);
		});
}

load("dummy");

router.route('/')
 .get(function(req, res, next) {
   var keys = [];
   for (var el in metadata) {
     keys.push(el);
   }
   res.jsonp(keys);
 });

router.route('/:user')
 .get(function(req, res, next) {
   var data = metadata[req.params.user];
   if (data === undefined) return next();
   var keys = [];
   for (var el in data) {
     var value = data[el];
     keys.push({ key: el,
                 user : req.params.user,
                 title: value.title,
                 description: value.description});
   }
   res.jsonp(keys);
 });

router.route('/:user/:id')
 .get(function (req, res, next) {
   var data = metadata[req.params.user];
   if (data === undefined) {
     return next();
   }
   var value = data[req.params.id];
   if (value === undefined) {
     return next();
   }
   var script = loadScript(req.params.user, req.params.id);
   if (script === null) {
     return next();
   }
   res.set('Content-Type', 'application/ecmascript');
   res.send(script);
 })
 .put(function (req, res, next) {
   var buffer = "";
   var data = metadata[req.params.user];
   if (data === undefined) {
     return next();
   }
   req.on('data', function (chunk) {
     buffer += chunk;
   });
   req.on('end', function (chunk) {
     var obj = JSON.parse(buffer);
     data[req.params.id] = { title: obj.title, description: obj.description };
     save(req.params.user, req.params.id, obj.script);
     res.send("Saved");
   });
 });
module.exports = router;
