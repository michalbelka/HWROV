var server = io.connect('http://192.168.0.101:5000');    // Connecting to socket.io





server.on('messages', function (data) {
    console.log(data);
});

// When new motors values are recieved
server.on('motor_vertical_front', function(data) {
    console.log('Value of motor_vertical_front change to: '+data+'%');
    $('#motor_vertical_front').html(data+' %');
});

server.on('motor_vertical_rear', function(data) {
    console.log('Value of motor_vertical_rear change to: '+data+'%');
    $('#motor_vertical_rear').html(data+' %');
});

server.on('motor_right', function(data) {
    console.log('Value of motor_right change to: '+data+'%');
    $('#motor_right').html(data+' %');
});

server.on('motor_left', function(data) {
    console.log('Value of motor_left change to: '+data+'%');
    $('#motor_left').html(data+' %');
});

function stopMotors(){
    server.emit('motor_vertical_front',0);
    server.emit('motor_vertical_rear',0);
    server.emit('motor_right',0);
    server.emit('motor_left',0);
    $('#motor_vertical_front').html('0 %');
    $('#motor_vertical_rear').html('0 %');
    $('#motor_right').html('0 %');
    $('#motor_left').html('0 %');
}

function setMotors(m0, m1, m2, m3) {
    /*
     * This function is setting motors (i.e. emitting values) and substituting values
     *
     * m0 - Front
     * m1 - Rear
     * m2 - Left
     * m3 - Right
     */

    // Front
    server.emit('motor_vertical_front',m0);
    $('#motor_vertical_front').html(m0+' %');
    // Rear
    server.emit('motor_vertical_rear',m1);
    $('#motor_vertical_rear').html(m1+' %');
    // Left
    server.emit('motor_left',m2);
    $('#motor_left').html(m2+' %');
    // Right
    server.emit('motor_right',m3);
    $('#motor_right').html(m3+' %');

}

function stream() {
    $("#box3 img").attr('src','http://192.168.0.101:8080/?action=stream');
}

jQuery(function($) {


    // Turn on streaming after 1 sec to allow proper script to turn on
    setTimeout(stream, 1000);


    $('#box1').click(function(){ // Off button
        console.log('works');
        server.emit('turnoff');
    });

    $('#box3').click(function(){ // Emerge button
        console.log('Emerging...');
        server.emit('emerge');
    });

    $('#box').click(function() {
        server.emit('messages', 'Such click. Such wow. Such egg!\n' +
            "░░░░░░░░░▄░░░░░░░░░░░░░░▄░░░░\n"+
            "░░░░░░░░▌▒█░░░░░░░░░░░▄▀▒▌░░░\n"+
            "░░░░░░░░▌▒▒█░░░░░░░░▄▀▒▒▒▐░░░\n"+
            "░░░░░░░▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐░░░\n"+
            "░░░░░▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐░░░\n"+
            "░░░▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌░░░\n"+
            "░░▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌░░\n"+
            "░░▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐░░\n"+
            "░▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌░\n"+
            "░▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌░\n"+
            "▀▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒▐░\n"+
            "▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒▒░▒░▒░▒▒▒▒▌\n"+
            "▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒▒▒░▒░▒░▒▒▐░\n"+
            "░▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒░▒░▒░▒░▒▒▒▌░\n"+
            "░▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▄▒▒▐░░\n"+
            "░░▀▄▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▄▒▒▒▒▌░░\n"+
            "░░░░▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀░░░\n"+
            "░░░░░░▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀░░░░░\n"+
            "░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▀▀░░░░░░░░");
    });

    // Click on text to change value manually
    $('#motor_vertical_front').click(function() { // Vertical up
        console.log('motor_vertical_front clicked');
        do {
            var t2 = prompt('Give me new value in %');
        } while ($.isNumeric(t2) == false || t2 > 100 || t2 < -100);
        server.emit('motor_vertical_front', t2);
        $('#motor_vertical_front').html(t2 + " %");
        console.log('Value of motor_vertical_front changed to ' + t2 + "%");
    });

    $('#motor_vertical_rear').click(function() { // Vertical down
        console.log('motor_vertical_rear clicked');
        do {
            var t2 = prompt('Give me new value in %');
        } while ($.isNumeric(t2) == false || t2 > 100 || t2 < -100);
        server.emit('motor_vertical_rear', t2);
        $('#motor_vertical_rear').html(t2 + " %");
        console.log('Value of motor_vertical_rear changed to ' + t2 + "%");
    });

    $('#motor_left').click(function() { // Left
        console.log('motor_left clicked');
        do {
            var t2 = prompt('Give me new value in %');
        } while ($.isNumeric(t2) == false || t2 > 100 || t2 < -100);
        server.emit('motor_left', t2);
        $('#motor_left').html(t2 + " %");
        console.log('Value of motor_left changed to ' + t2 + "%");
    });

    $('#motor_right').click(function() { // Right
        console.log('motor_right clicked');
        do {
            var t2 = prompt('Give me new value in %');
        } while ($.isNumeric(t2) == false || t2 > 100 || t2 < -100);
        server.emit('motor_right', t2);
        $('#motor_right').html(t2 + " %");
        console.log('Value of motor_right changed to ' + t2 + "%");
    });
});