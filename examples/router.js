var fs = require('fs');
var express = require('express');
var router = express.Router();

var metadata = {};

var storage_path = __dirname;
var keys_file = 'keys.json';

// v8 doesn't support String.endsWith
function endsWith(subjectString, searchString) {
	var s = subjectString.toString();
	position = s.length - searchString.length;
	var lastIndex = s.indexOf(searchString, position);
	return lastIndex !== -1 && lastIndex === position;
}

function load() {
	function loadMeta(id) {
		var value;
		try {
			content = fs.readFileSync(storage_path + '/' + id + '.json',
									{options: "utf-8"});
			value = JSON.parse(content);
			value.id = id;
			metadata[id] = value;
		} catch (e) {
			console.log(e);
		}
	}

	fs.readdir(storage_path, function (err, files) {
		if (err) {
			console.log(err);
			return;
		}
		for (var i = files.length - 1; i >= 0; i--) {
			var file = files[i];
			if (endsWith(file, ".json")) {
				loadMeta(file.substring(0, file.length-5));
			}
		};
	});
}

function loadScript(id) {
	try {
		return fs.readFileSync(storage_path + '/' + id + '.js',
								{options: "utf-8"});
	} catch (e) {
		console.log(e);
		return null;
	}
}

load();

router.route('/')
 .get(function(req, res, next) {
 	var keys = [];
 	for (var el in metadata) {
 		var value = metadata[el];
 		keys.push({ key: el,
 		            title: value.title,
 		            description: value.description});
 	}
 	res.jsonp(keys);
 });

router.route('/:id')
 .get(function (req, res, next) {
 	var value = metadata[req.params.id];
 	if (value === undefined) {
 		return next();
 	}
 	var script = loadScript(req.params.id);
 	if (script === null) {
 		return next();
 	}
 	res.set('Content-Type', 'application/ecmascript');
 	res.send(script);
 });

module.exports = router;
