// web.js
var express = require("express");
var logfmt = require("logfmt");
var app = express();

var _ = require("underscore");

var redis = require("redis"),
	client = redis.createClient('12695','pub-redis-12695.us-east-1-2.3.ec2.garantiadata.com');
client.auth('password', function(){});
client.on("error", function (err) {
    console.log("Error " + err);
});

process.env.PWD = process.cwd();

var status = [];

app.use(logfmt.requestLogger());

app.get('/services/:customer/_del', function(req, res) {
	var customer = req.params.customer;

	client.del(customer + ':_all');
	client.del(customer +':_components');
	res.send('ok');
});

app.get('/services/:customer/:component/:status', function(req, res) {
	var customer = req.params.customer;
	var component = req.params.component;
	var status = req.params.status;
	var time = new Date();

	var store = {};
	store[component+':name'] = component;
	store[component+':status'] = status;
	store[component+':last'] = time;

	client.sadd(customer + ':_all', component);
	client.hget(customer + ':_components', component+":status", function(err, reply){
		if(reply !== status){ store[component+':count'] = 0; }
		else{ client.hincrby(customer + ':_components', component+':count', 1); }
		client.hmset(customer +':_components', store, redis.print);
	});
	res.send('ok');

});

app.get('/services/:customer/_all', function(req, res) {
	var customer = req.params.customer;
	client.smembers(customer+':_all', function(err, reply){
		var names = [];
		_.each(reply,function(name){
			names.push(name+':name');
			names.push(name+':status');
			names.push(name+':last');
			names.push(name+':count');
		});
		client.hmget(customer+':_components', names, function(err, creply){
			var response = [];
			for(var i=0;i<creply.length;i+=4){
				var component = {
					name: creply[i],
					status: creply[i+1],
					last: creply[i+2],
					count: creply[i+3]
				};
				response.push(component); 
			}
			var enterprise = _.reduce(response, function(memo, component){
				if(memo < getIntFromStatus(component.status)){
					return getIntFromStatus(component.status);
				}else{
					return memo;
				}
			}, 0);
			response.push({
					name: '_all',
					status: getStatusFromInt(enterprise)
				});
			res.send(response);
		});
	});
});

function getIntFromStatus(status){
	if(/PASS/.test(status)){
        return 0;
    }else if(/WARN/.test(status)){
        return 1;
    }else if(/FAIL/.test(status)){
        return 2;
    }else if(/CRITICAL/.test(status)){
        return 3;
    }else if(/PAUSE/.test(status)){
        return 0;
    }
}

function getStatusFromInt(status){
	if(status === 0){
		return 'PASS';
	}else if(status === 1){
		return 'WARN';
	}else if(status === 2){
		return 'FAIL'
	}else if(status === 3){
		return 'CRITICAL'
	}
	return 'UNKNOWN';
}

app.configure(function(){
  app.use('/', express.static(process.env.PWD + '/app'));
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
