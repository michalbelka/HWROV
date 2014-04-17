var express = require('express')
    , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.set('log level', 2);

var motors = [0,0,100,100]; // Vertical up (t2), Vertical down(t3), left(t5), right(t4)

var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

app.use(express.static('public'));

io.sockets.on('connection', function(client) {
    console.log('Client connected…');

    client.emit('text2', motors[0]);
    client.emit('text3', motors[1]);
    client.emit('text5', motors[2]);
    client.emit('text4', motors[3]);
    console.log(motors);

    client.on('text2', function(data){
        client.broadcast.emit('text2', data);
        console.log('Value of text2 change to: '+data+'%');
        motors[0]=data;
        //exec("ls -la", puts);
    });

    client.on('text3', function(data){
        client.broadcast.emit('text3', data);
        console.log('Value of text3 change to: '+data+'%');
        motors[1]=data;
        //exec("ls -la", puts);
    });

    client.on('text4', function(data){
        client.broadcast.emit('text4', data);
        console.log('Value of text4 change to: '+data+'%');
        motors[3]=data;
        //exec("ls -la", puts);
    });

    client.on('text5', function(data){
        client.broadcast.emit('text5', data);
        console.log('Value of text5 change to: '+data+'%');
        motors[2]=data;
        //exec("ls -la", puts);
    });

    client.on('messages', function(data) {
        client.broadcast.emit('messages', data);
        console.log(data);
        //exec("ls -la", puts);
    });
});

app.get('/', function(request, response) {
    response.sendfile(__dirname + "/index.html");
});

var port = Number(process.env.PORT || 5000);
server.listen(port, function() {
    console.log("Listening on " + port);
});