/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	http = require('http'),
	path = require('path');

var app = express();

// all environments

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}



app.get('/', routes.index);


app.get('/users', function(req, res, next) {

	guards = [];

	var redis = require("redis"),
		client = redis.createClient();

	// if you'd like to select database 3, instead of 0 (default), call
	// client.select(3, function() { /* ... */ });

	client.on("error", function(err) {
		console.log("Error " + err);
	});

	// client.set("string key", "string val", redis.print);
	// client.hset("hash key", "hashtest 1", "some value", redis.print);
	// client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
	client.hkeys("guard_list", function(err, replies) {
		console.log(replies.length + " replies:");
		a = replies.forEach(function(reply, i) {

			client.hget("guard_list", reply, function(err, obj) {
				guards.push({
					'email': reply,
					'cp':  obj 
				});
				console.log("    " + guards.length + ": " + obj);

				if (i == (replies.length - 1)) {
					console.log("aaaaaaaa    " + guards.length + " aaaaaaa ");
					console.log("aaaaaaaa    " + i + " aaaaaaa ");

// var n = 1000;
// while (n--) {
//   pets.push({ name: 'Tobi', age: 2, species: 'ferret' });
//   pets.push({ name: 'Loki', age: 1, species: 'ferret' });
//   pets.push({ name: 'Jane', age: 6, species: 'ferret' });
// }


					  res.render('user',  { guards: guards });

				}
			});



		});



		client.quit();


	});



	// User.count(function(err, count){
	//   if (err) return next(err);
	//   User.all(function(err, users){
	//     if (err) return next(err);
	//     res.render('user', {
	//       title: 'Users',
	//       count: count,
	//       users: users.filter(ferrets)
	//     });
	//   })
	// })
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});