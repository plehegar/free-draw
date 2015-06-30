var t0 = Date.now();

var express = require("express");
var app = express();
var router = express.Router();
var store = require('./store/router');
var examples = require('./examples/router');

router.use(function(req, res, next) {
	console.log(req.method, req.url);
	next();
});

app.use('/', router);

app.use('/store', store);
app.use('/examples', examples);

app.use(express.static(__dirname));

var port = process.env.PORT || 5000;
var server = app.listen(port, function () {
  console.log("Server started in", (Date.now() - t0) + "ms.\n");
  console.log("Go to http://localhost:%d/index.html",
    server.address().port);
  console.log("For documentation, see http://localhost:%d/docs/index.html",
    server.address().port);
  console.log("\nStarting logs...");

});
