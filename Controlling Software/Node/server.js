/*****************************************
 *
 * Author:      Michał Belka
 * Email:       mb303@hw.ac.uk
 * Last mod:    14/04/2014
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
//var sys = require('sys')
var exec = require('child_process').exec;

//function puts(error, stdout, stderr) { sys.puts(stdout) }
function puts(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
}


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
var motors = [0,0,0,0]; // front, rear, left, right
var motorsDir = [2, 2, 2, 2]; // order as above, 0 - back, 1 - forward, 2 - init
var clients = 0;


io.sockets.on('connection', function(client) {

    /***** Init new client ****/

    console.log('Client connected…');
    clients += 1;
    console.log('Active: '+clients);

    // If first client, turn on streaming

    if (clients == 1){
        console.log('Starting video streming...');
        exec('LD_LIBRARY_PATH=/opt/mjpg-streamer/mjpg-streamer-experimental /opt/mjpg-streamer/mjpg-streamer-experimental/mjpg_streamer -i "input_raspicam.so -fps 15 -q 50 -x 640 -y 360" -o "output_http.so -p 8080 -w $MJPG/www"', puts);
    }

    /*
    client.emit('motor_vertical_front', motors[0]);
    client.emit('motor_vertical_rear', motors[1]);
    client.emit('motor_left', motors[2]);
    client.emit('motor_right', motors[3]);
    */

    client.emit('motors_values', motors);

    /***** client disconnected ****/

    client.on('disconnect', function(){
        clients -= 1;
        console.log('Client disconnected\nActive: '+clients);
        if (clients == 0) { // When last client disconnects
            console.log('Stopping video streaming...');
            exec("sudo killall mjpg_streamer", puts);
            console.log("Turning off motors...");
            exec("sudo python ./pwm/stop.py", puts);

            // Function is responsible for
            // emergency emerge if no client
            // is connected for 1 minute

            // Comment below for testing as it can be annoying
            /*
            setTimeout(function() {
                if (clients == 0) { // If still no clients connected, emerge
                    exec("sudo python ./pwm/emerge.py", puts);
                    setTimeout(function(){ // Stop motors after 30 s of emerging
                        exec("sudo python ./pwm/stop.py", puts);
                    }, 60000);
                }
            }, 60000); // After 1 minute
            */
        }
    });

    client.on('turnoff', function() {
        console.log('Turning off Pi...');
        exec("sudo halt", puts);
    });

    /***************** Functions responsible for dedicated scripts ******************/


    // Basic functions

    client.on('stop', function(){
        if (motors == [0, 0, 0, 0]) {
            console.log('Alredy stopped');
        } else {
            console.log("Stopping...");
            exec("sudo python ./pwm/stop.py", puts);
            motors = [0, 0, 0, 0];
            client.broadcast.emit('motors_values', motors);
            client.emit('motors_values', motors);
        }
    });

    client.on('emerge', function(){
        if (motors[0] == -100 && motors[1] == -100) {
            console.log('Already emerging...');
        } else {
            console.log("Emerging...");
            exec("sudo python ./pwm/emerge.py",puts);
            motors=[-100, -100, 0, 0];
            client.broadcast.emit('motors_values', motors);
            client.emit('motors_values', motors);
        }
    });

    client.on('down', function(){
        if (motors[0] == 100 && motors[1] == 100) {
            console.log('Already going down...');
        } else {
            console.log("Going down...");
            exec("sudo python ./pwm/down.py",puts);
            motors=[100, 100, 0, 0];
            client.broadcast.emit('motors_values', motors);
            client.emit('motors_values', motors);
        }
    });

    // Fast mode functions

    client.on('forward', function(){
        if (motors[2] == 100 && motors[3] == 100) {
            console.log('Already going forward...');
        } else {
            console.log("Going forward...");
            exec("sudo python ./pwm/forward.py",puts);
            motors=[0, 0, 100, 100];
            client.broadcast.emit('motors_values', motors);
            client.emit('motors_values', motors);
        }
    });

    client.on('backward', function(){
        if (motors[2] == -100 && motors[3] == -100) {
            console.log('Already going backgwards...');
        } else {
            console.log("Goin backward...");
            exec("sudo python ./pwm/backward.py",puts);
            motors=[0, 0, -100, -100];
            client.broadcast.emit('motors_values', motors);
            client.emit('motors_values', motors);
        }
    });

    client.on('left', function(){
        if (motors[2] == 0 && motors[3] == 100) {
            console.log('Already turning left...');
        } else {
            console.log("Turning left...");
            exec("sudo python ./pwm/left.py",puts);
            motors=[0, 0, 0, 100];
            client.broadcast.emit('motors_values', motors);
            client.emit('motors_values', motors);
        }
    });

    client.on('right', function(){
        if (motors[2] == 100 && motors[3] == 0) {
            console.log('Already turning right...');
        } else {
            console.log("Turning right...");
            exec("sudo python ./pwm/right.py",puts);
            motors=[0, 0, 100, 0];
            client.broadcast.emit('motors_values', motors);
            client.emit('motors_values', motors);
        }
    });

    // Agile mode functions

    client.on('forward_agile', function(){
        if (motors[2] == 50 && motors[3] == 50) {
            console.log('Already going forward...');
        } else {
            console.log("Going forward...");
            exec("sudo python ./pwm/forward_agile.py",puts);
            motors=[0, 0, 50, 50];
            client.broadcast.emit('motors_values', motors);
            client.emit('motors_values', motors);
        }
    });

    client.on('backward_agile', function(){
        if (motors[2] == -50 && motors[3] == -50) {
            console.log('Already going backgwards...');
        } else {
            console.log("Goin backward...");
            exec("sudo python ./pwm/backward_agile.py",puts);
            motors=[0, 0, -50, -50];
            client.broadcast.emit('motors_values', motors);
            client.emit('motors_values', motors);
        }
    });

    client.on('left_agile', function(){
        if (motors[2] == -50 && motors[3] == 50) {
            console.log('Already turning left...');
        } else {
            console.log("Turning left...");
            exec("sudo python ./pwm/left_agile.py",puts);
            motors=[0, 0, -50, 50];
            client.broadcast.emit('motors_values', motors);
            client.emit('motors_values', motors);
        }
    });

    client.on('right_agile', function(){
        if (motors[2] == 50 && motors[3] == -50) {
            console.log('Already turning right...');
        } else {
            console.log("Turning right...");
            exec("sudo python ./pwm/right_agile.py",puts);
            motors=[0, 0, 50, -50];
            client.broadcast.emit('motors_values', motors);
            client.emit('motors_values', motors);
        }
    });

    /****** General motor setting *****/

    function setMotorSpeed(motor, data) {
        if (motors[motor] != data) {
            var dir = 1;
            if (data < 0) dir = 0;
            //if (dir == motorsDir[motor]) dir_o = 2;
            else dir_o = dir;
            motorsDir[motor] = dir;

            motors[motor]=data;
            client.broadcast.emit('motors_values', motors);
            data = Math.abs(data)*40;  // Done for simplicity
            console.log('\nValue of motor '+motor+' change to: '+data+' in direction: '+dir_o);
            console.log(motorsDir);
            exec("sudo python /home/pi/Node/pwm/Servo_Example.py -m "+motor+" -v " + data + " -d " + dir_o, puts);
        }
    }

    client.on('motor_vertical_front', function(data){
        setMotorSpeed(0, data)
    });

    client.on('motor_vertical_rear', function(data){
        setMotorSpeed(1, data)
    });

    client.on('motor_left', function(data){
        setMotorSpeed(2, data)
    });

    client.on('motor_right', function(data){
        setMotorSpeed(3, data)
    });

    client.on('messages', function(data) {
        client.broadcast.emit('messages', data);
        console.log(data);
    });
});



app.get('/', function(request, response) {
    response.sendfile(__dirname + "/index.html");
});

var port = 5000;
server.listen(port, function() {
    console.log("Listening on " + port);
});
