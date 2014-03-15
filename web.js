// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();

process.env.PWD = process.cwd();

var status = [];

app.use(logfmt.requestLogger());

app.get('/services/:id/:status', function(req, res) {
	if(status[req.params.id]){
		res.send('replace ' + req.params.id + ' status ' + req.params.status);
	}else{
		res.send('new for ' + req.params.id + ' status ' + req.params.status);
	}
	status[req.params.id] = req.params.status;

});

app.get('/services/:id', function(req, res) {
	if(status[req.params.id]){
		res.send(status[req.params.id]);
	}else{
		res.send('UNKNOWN');
	}
});

app.configure(function(){
  app.use('/', express.static(process.env.PWD + '/public'));
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
