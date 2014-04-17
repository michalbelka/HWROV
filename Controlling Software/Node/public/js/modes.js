jQuery(function($) {
// Arrows
var arrowPressed = 0;
/**
 * this is current mode, you can add your very easily, just add proper stuff into case below
 *
 * 0 - default, fast will use 100% speed for turn etc
 * 1 - agile, slower, will use 50% speed and -50% for opposite motor
 */
currentMode = 0;

    $('#fast-mode').click(function() {
        $('.active').removeClass('active');
        $(this).toggleClass('active');
        currentMode = 0;
    });

    $('#agile-mode').click(function() {
        $('.active').removeClass('active');
        $(this).toggleClass('active');
        currentMode = 1;
    });


    // Following code describes behaviour when keyboard keys are pressed
    $(window).keydown(function(event){
        if(arrowPressed == 0){
            switch(event.which) {
                case 37: // Left
                    event.preventDefault();
                    // Different modes, different behaviours
                    switch(currentMode) {
                        case 0:
                            server.emit('left');
                            break;

                        case 1:
                            server.emit('left_agile');
                            break;

                        default:
                            server.emit('left');
                            break;
                    }
                    arrowPressed = 1;      // This will prevent unwanted execution when arrow pressed
                    break;
                case 38: // Up
                    event.preventDefault();
                    // Different modes, different behaviours
                    switch(currentMode) {
                        case 0:
                            server.emit('forward');
                            break;

                        case 1:
                            server.emit('forward_agile');
                            break;

                        default:
                            server.emit('forward');
                            break;
                    }
                    arrowPressed = 1;
                    break;
                case 39: // Right
                    event.preventDefault();
                    // Different modes, different behaviours
                    switch(currentMode) {
                        case 0:
                            server.emit('right');
                            break;

                        case 1:
                            server.emit('right_agile');
                            break;

                        default:
                            server.emit('right');
                            break;
                    }
                    arrowPressed = 1;
                    break;
                case 40: // Down
                    event.preventDefault();
                    // Different modes, different behaviours
                    switch(currentMode) {
                        case 0:
                            server.emit('backward');
                            break;

                        case 1:
                            server.emit('backward_agile');
                            break;

                        default:
                            server.emit('backward');
                            break;
                    }
                    arrowPressed = 1;
                    break;
                case 68: // d
                    event.preventDefault();
                    // Different modes, different behaviours
                    switch(currentMode) {
                        case 0:
                            server.emit('down');
                            break;

                        case 1:
                            server.emit('down');
                            break;

                        default:
                            server.emit('down');
                            break;
                    }
                    arrowPressed = 1;
                    break;
                case 69: // e
                    event.preventDefault();
                    switch(currentMode) {
                        case 0:
                            server.emit('emerge');
                            break;

                        case 1:
                            server.emit('emerge');
                            break;

                        default:
                            server.emit('emerge');
                            break;
                    }
                    arrowPressed = 1;
                    break;
            }
        }
    });

    // When one of arrows is released
    $(window).keyup(function(event) {
        var key = event.which;
        if((arrowPressed == 1) && (key == 37 || key == 38 || key == 39 || key == 40 || key == 69 || key == 68)) {
            event.preventDefault();
            stopMotors();
            arrowPressed = 0;
        }
    });
});