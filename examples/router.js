const fs = require('fs');
const express = require('express');
const router = express.Router();

const metadata = {};

const storage_path = __dirname;
const keys_file = 'keys.json';

// v8 doesn't support String.endsWith
function endsWith(subjectString, searchString) {
	const s = subjectString.toString();
	position = s.length - searchString.length;
	const lastIndex = s.indexOf(searchString, position);
	return lastIndex !== -1 && lastIndex === position;
}

function load() {
	function loadMeta(id) {
		let value;
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
		for (let i = files.length - 1; i >= 0; i--) {
			const file = files[i];
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
 	const keys = [];
 	for (const [key, value] of Object.entries(metadata)) {
 		keys.push({ key: key,
 		            title: value.title,
 		            description: value.description});
 	}
 	res.jsonp(keys);
 });

router.route('/:id')
 .get(function (req, res, next) {
 	const value = metadata[req.params.id];
 	if (value === undefined) {
 		return next();
 	}
 	const script = loadScript(req.params.id);
 	if (script === null) {
 		return next();
 	}
 	res.set('Content-Type', 'application/ecmascript');
 	res.send(script);
 });

module.exports = router;
