/*****************************************
 *
 * Author:      Michał Belka
 * Email:       mb303@hw.ac.uk
 * Last mod:    05/03/2014
 *
 * Description:
 *
 * Controlling server for underwater ROV.
 *
 */


var express = require('express')
    , http = require('http');

/***
 * Setting up application, including libraries etc
 */
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
app.use(express.static('public'));

/***
 * Use sys module for executing system commands
 */
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

/***
 *  Setting logging level to 2, so that we don't see tons of useless information
 */
io.set('log level', 2);


/***
 * Current motor values
 *
 * Should start from 0, if no client connected.
 * Order:
 *   Vertical front
 *   Vertical rear
 *   Left
 *   Right
 */
var motors = [0,0,0,0]; // Vertical front (t2), Vertical rear (t3), left(t5), right(t4)
var clients = 0;


io.sockets.on('connection', function(client) {
    client.on('disconnect', function(){
        clients -= 1;
        console.log('Client disconnected\nActive: '+clients);
        if (clients == 0) { // When last client disconnects
            console.log('Stopping video streming...');
            exec("sudo killall mjpg_streamer", puts);
            console.log("Turning off motors...");
            exec("sudo python ./pwm/Servo_Example.py -m 0 -v 0 -d 0", puts);
            exec("sudo python ./pwm/Servo_Example.py -m 1 -v 0 -d 0", puts);
            exec("sudo python ./pwm/Servo_Example.py -m 2 -v 0 -d 0", puts);
            exec("sudo python ./pwm/Servo_Example.py -m 3 -v 0 -d 0", puts);

            // Uncomment below for testing emerging
            /*
            setTimeout(function() {
                if (clients == 0) { // If still no clients connected, emerge
                    exec("sudo python ./pwm/emerge.py", puts);
                    setTimeout(function(){ // Stop motors after 30 s of emerging
                        exec("sudo python ./pwm/stop.py", puts);
                    }, 30000);
                }
            }, 60000); // After 1 minute
            */
        }
    });

    client.on('turnoff', function() {
        console.log('Turning off Pi...');
        exec("sudo halt", puts);
    });

    client.on('emerge', function(){
        console.log("Emerging...");
        exec("sudo python ./pwm/emerge.py", puts);
    });

    console.log('Client connected…');
    clients += 1;
    console.log('Active: '+clients);

    if (clients == 1){
        console.log('Starting video streming...');
        exec('LD_LIBRARY_PATH=/usr/src/mjpg-experimental/mjpg-streamer-experimental /usr/src/mjpg-experimental/mjpg-streamer-experimental/mjpg_streamer -i "input_raspicam.so -fps 15 -q 50 -x 640 -y 360" -o "output_http.so -p 8080 -w $MJPG/www"', puts);
    }

    client.emit('motor_vertical_front', motors[0]);
    client.emit('motor_vertical_rear', motors[1]);
    client.emit('motor_left', motors[2]);
    client.emit('motor_right', motors[3]);
    console.log(motors);

    client.on('motor_vertical_front', function(data){
        var dir = 1;
        if (data < 0) dir = 0;
        client.broadcast.emit('motor_vertical_front', data);
        motors[0]=data;
	    data = Math.abs(data)*40;  // Done for simplicity
        console.log('\nValue of motor_vertical_front change to: '+data+' in direction: '+dir);
        exec("sudo python ./pwm/Servo_Example.py -m 0 -v " + data + "-d " + dir, puts);
    });

    client.on('motor_vertical_rear', function(data){
        var dir = 1;
        if (data < 0) dir = 0;
        client.broadcast.emit('motor_vertical_rear', data);
        motors[1]=data;
	    data = Math.abs(data)*40;
        console.log('Value of motor_vertical_rear change to: '+data+' in direction: '+dir);
        exec("sudo python ./pwm/Servo_Example.py -m 1 -v " + data + "-d " + dir, puts);
    });

    client.on('motor_left', function(data){
        var dir = 1;
        if (data < 0) dir = 0;
        client.broadcast.emit('motor_left', data);
        motors[2]=data;
        data = Math.abs(data)*40;
        console.log('Value of motor_left change to: '+data+' in direction: '+dir);
        exec("sudo python ./pwm/Servo_Example.py -m 2 -v " + data + "-d " + dir, puts);
    });

    client.on('motor_right', function(data){
        var dir = 1;
        if (data < 0) dir = 0;
        client.broadcast.emit('motor_right', data);
        motors[3]=data;
	    data = Math.abs(data)*40;
        console.log('Value of motor_right change to: '+data+' in direction: '+dir);
        exec("sudo python ./pwm/Servo_Example.py -m 3 -v " + data + "-d " + dir, puts);
    });

    client.on('messages', function(data) {
        client.broadcast.emit('messages', data);
        console.log(data);
        
    });
});



app.get('/', function(request, response) {
    response.sendfile(__dirname + "/index.html");
});

var port = Number(process.env.PORT || 5000);
server.listen(port, function() {
    console.log("Listening on " + port);
});
