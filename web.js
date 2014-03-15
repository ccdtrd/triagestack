// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();

var redis = require("redis"),
	client = redis.createClient('12695','pub-redis-12695.us-east-1-2.3.ec2.garantiadata.com');
client.auth('password', function(){});
client.on("error", function (err) {
    console.log("Error " + err);
});

process.env.PWD = process.cwd();

var status = [];

app.use(logfmt.requestLogger());

app.get('/services/:customer/:id/:status', function(req, res) {
	client.hset(req.params.customer,req.params.id, req.params.status, redis.print);
	res.send({error: false});
});

app.get('/services/:customer/:id', function(req, res) {
	var customer = req.params.customer;
	var id = req.params.id;

	client.hget(customer, id, function(err, reply){
		if(err){
			console.log(err);
			res.send({error: true});
		}else{
			if(reply){
				res.send({error: false, id: reply});
			}else{
				res.send({error: false, id: 'UNKNOWN'});
			}
		}
	});
});

app.get('/services/:customer', function(req, res) {
	var customer = req.params.customer;

	client.hgetall(customer, function(err, reply){
		if(err){
			console.log(err);
			res.send({error: true});
		}
		reply.error = false;
		res.send(reply);
	});
});

app.configure(function(){
  app.use('/', express.static(process.env.PWD + '/public'));
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
