var server = io.connect('http://192.168.0.101:5000');    // Connecting to socket.io
// Use below for home testing, above for production
//var server = io.connect('http://localhost:5000');    // Connecting to socket.io




server.on('messages', function (data) {
    console.log(data);
});

// When new motors values are relieved

server.on('motors_values', function(data){
    console.log('Motrs values recieved: '+data);
    $('.mfront').html(data[0]+' %');
    $('.mrear').html(data[1]+' %');
    $('.mleft').html(data[2]+' %');
    $('.mright').html(data[3]+' %');
});

function stopMotors(){
    server.emit('stop');
    $('.mfront').html('0 %');
    $('.mrear').html('0 %');
    $('.mright').html('0 %');
    $('.mleft').html('0 %');
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
    $('.mfront').html(m0+' %');
    // Rear
    server.emit('motor_vertical_rear',m1);
    $('.mrear').html(m1+' %');
    // Left
    server.emit('motor_left',m2);
    $('.mleft').html(m2+' %');
    // Right
    server.emit('motor_right',m3);
    $('.mright').html(m3+' %');

}

// Turn on streaming after 1 second to ensure that it is up and running
function stream() {
    $(".video").attr('src','http://192.168.0.101:8080/?action=stream');
}


jQuery(function($) {

    $('.guide').click(function(){
        // start tutorial
        introJs().start();
    });


    // Turn on streaming after 1 sec to allow proper script to turn on
    setTimeout(stream, 1000);


    $('img.off').click(function(){ // Off button
        console.log('works');
        server.emit('turnoff');
    });

    $('img.emerge').click(function(){ // Emerge button
        console.log('Emerging...');
        server.emit('emerge');
    });

    $('.upper-menu').click(function() {
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
    $('.mfront').click(function() { // Vertical up
        console.log('motor_vertical_front clicked');
        do {
            var t2 = prompt('Give me new value in %');
        } while ($.isNumeric(t2) == false || t2 > 100 || t2 < -100); // Valudation
        server.emit('motor_vertical_front', t2);
        $('.mfront').html(t2 + " %");
        console.log('Value of motor_vertical_front changed to ' + t2 + "%");
    });

    $('.mrear').click(function() { // Vertical down
        console.log('motor_vertical_rear clicked');
        do {
            var t2 = prompt('Give me new value in %');
        } while ($.isNumeric(t2) == false || t2 > 100 || t2 < -100);
        server.emit('motor_vertical_rear', t2);
        $('.mrear').html(t2 + " %");
        console.log('Value of motor_vertical_rear changed to ' + t2 + "%");
    });

    $('.mleft').click(function() { // Left
        console.log('motor_left clicked');
        do {
            var t2 = prompt('Give me new value in %');
        } while ($.isNumeric(t2) == false || t2 > 100 || t2 < -100);
        server.emit('motor_left', t2);
        $('.mleft').html(t2 + " %");
        console.log('Value of motor_left changed to ' + t2 + "%");
    });

    $('.mright').click(function() { // Right
        console.log('motor_right clicked');
        do {
            var t2 = prompt('Give me new value in %');
        } while ($.isNumeric(t2) == false || t2 > 100 || t2 < -100);
        server.emit('motor_right', t2);
        $('.mright').html(t2 + " %");
        console.log('Value of motor_right changed to ' + t2 + "%");
    });
});
