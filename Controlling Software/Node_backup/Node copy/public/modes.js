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

    $('#mode-fast').click(function() {
        $('.selected-mode').toggleClass('selected-mode');
        $(this).toggleClass('selected-mode');
        currentMode = 0;
    });

    $('#mode-agile').click(function() {
        $('.selected-mode').toggleClass('selected-mode');
        $(this).toggleClass('selected-mode');
        currentMode = 1;
    });

    $(window).keydown(function(event){
        if(arrowPressed == 0){
            switch(event.which) {
                case 37: // Left
                    event.preventDefault();
                    // Different modes, different behaviours
                    switch(currentMode) {
                        case 0:
                            setMotors(0,0,0,100);
                            break;

                        case 1:
                            setMotors(0,0,-50,50);
                            break;

                        default:
                            setMotors(0,0,0,100);
                            break;
                    }
                    arrowPressed = 1;      // This will prevent unwanted execution when arrow pressed
                    break;
                case 38: // Up
                    event.preventDefault();
                    // Different modes, different behaviours
                    switch(currentMode) {
                        case 0:
                            setMotors(0,0,100,100);
                            break;

                        case 1:
                            setMotors(0,0,50,50);
                            break;

                        default:
                            setMotors(0,0,100,100);
                            break;
                    }
                    arrowPressed = 1;
                    break;
                case 39: // Right
                    event.preventDefault();
                    // Different modes, different behaviours
                    switch(currentMode) {
                        case 0:
                            setMotors(0,0,100,0);
                            break;

                        case 1:
                            setMotors(0,0,50,-50);
                            break;

                        default:
                            setMotors(0,0,100,0);
                            break;
                    }
                    arrowPressed = 1;
                    break;
                case 40: // Down
                    event.preventDefault();
                    // Different modes, different behaviours
                    switch(currentMode) {
                        case 0:
                            setMotors(0,0,-100,-100);
                            break;

                        case 1:
                            setMotors(0,0,-50,-50);
                            break;

                        default:
                            setMotors(0,0,-100,-100);
                            break;
                    }
                    arrowPressed = 1;
                    break;
                case 68: // d
                    event.preventDefault();
                    // Different modes, different behaviours
                    switch(currentMode) {
                        case 0:
                            setMotors(-100,-100,0,0);
                            break;

                        case 1:
                            setMotors(-50,-50,0,0);
                            break;

                        default:
                            setMotors(-100,-100,0,0);
                            break;
                    }
                    arrowPressed = 1;
                    break;
                case 69: // e
                    event.preventDefault();
                    switch(currentMode) {
                        case 0:
                            setMotors(100,100,0,0);
                            break;

                        case 1:
                            setMotors(50,50,0,0);
                            break;

                        default:
                            setMotors(100,100,0,0);
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