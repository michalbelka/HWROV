jQuery(function($){
    var gyroOn = 0;
    $('#gyro').click(function() {
        if (gyro == 1) {
            console.log('Stopping gyro...');
            gyro.stopTracking();
            gyroOn = 0;
        } else {
            console.log('Starting gyro...');
            turnOnGyro();
            gyroOn = 1;
        }
    });

    function turnOnGyro() {
        gyro.startTracking(function(o) {
            // Avaliable: o.x, o.y. o.x, o.alpha, o.beta, o.gamma
            // We will use just o.y and o.z from accelerometer
        });

        o = gyro.getOrientation();

        if((o.z === null) || (o.y === null)) {
            console.log('Functionality not detected');
            gyro.stopTracking();
        } else {
            //check value every second
            // TODO: may need to change interval as script may just not be able to execute instruction so fast
            setInterval(function() {
                // This is reading values of accelerometer and saving it in o object
                o = gyro.getOrientation();

                // For our needs rounded integer value like this would be better
                y = Math.round(o.y*10);
                z = Math.round(o.z*10);

                // Following code is responsible for setting motors

                /************* Going Up and Down ***************/
                // If z value is between -9 and -11, ROV goes up
                // Device is with screen up
                // Such range was used to avoid need for very precise device positioning

                if ((z <= -90) && (z >= -110)) {
                    speed_up_down = 100;
                    going_vertically = 1;
                }

                // If value of Z is between 9 and 11, ROV goes down
                // Device is with screen down

                else if ((z >= 90) && (z <= 110)){
                    speed_up_down = -100;
                    going_vertically = 1;
                }

                // If Z value is not within given range, front and rear motors should be off

                else {
                    speed_up_down = 0;
                    going_vertically = 0;
                }

                /************* Forward, backward ***************/

                // If Z value between -20 and 20 assume stable (i.e. no movement)

                if ((z >= -20) && (z <= 20)) {
                    // Please note that speed should be set using variable, as it will be used later, for turning
                    speed = 0;
                }

                // For values from -20 to -70, gradually speed up forward

                else if ((z < -20) && (z >= -70)) {
                    // Equation for getting speed; please refer to manual for detailed description
                    speed = Math.round((Math.abs(z)-10)*1.6);
                }

                // If Z value is between -70 and -90, set motors to maximum

                else if ((z < -70) && (z > -90)) {
                    speed = 100;
                }

                // For Z values between 20 and 50, gradually move backwards
                // Note that there is different range than previously
                // It is done, because rotating iPad to yourself is simply less comfortable

                else if ((z > 20) && (z <= 50)) {
                    // Again, for explanation of following equation, please refer to documentation
                    speed = -(Math.round((Math.abs(z)-10)*2.5));
                }

                // If Z value is between 50 and 90, set motors to -100

                else if ((z > 50) && (z < 90)) {
                    speed = -100;
                }

                // If not in any above, set to zero (turn off)

                else {
                    speed = 0;
                }

                // Set values for motors

                switch(currentMode) {
                    case 0:
                        speed_left = speed;
                        speed_right = speed;
                        break;

                    case 1:
                        speed_left = speed/2;
                        speed_right = speed/2;
                        break;

                    default:
                        speed_left = speed;
                        speed_right = speed;
                        break;
                }


                /************* Left and right ***************/

                // If value Y is in range -20 to 20, don't turn
                // If speed was previously set to 0 (i.e. no movement) turn with full speed
                // Otherwise, use values obtained

                if (y <= -20) { // Turn left
                    if (speed == 0) speed = 100;

                    switch(currentMode) {
                        case 0:
                            speed_left = 0;
                            speed_right = speed;
                            break;

                        case 1:
                            speed_left = -speed/2;
                            speed_right = speed/2;
                            break;

                        default:
                            speed_left = 0;
                            speed_right = speed;
                            break;
                    }
                }

                if (y >= 20) { // Turn right
                    if (speed == 0) speed = 100;

                    switch(currentMode) {
                        case 0:
                            speed_right = 0;
                            speed_left = speed;
                            break;

                        case 1:
                            speed_right = -speed/2;
                            speed_left = speed/2;
                            break;

                        default:
                            speed_right = 0;
                            speed_left = speed;
                            break;
                    }
                }

                console.log('Y = ' + y);
                console.log('Z = ' + z);

                console.log('Left: ' + speed_left);
                console.log('Right: ' + speed_right);
                console.log('Up: ' + speed_up_down+'\n');

                // setMotors(front, back, left, right)
                if (going_vertically == 1) {
                    setMotors(speed_up_down,speed_up_down,0,0);
                } else {
                    setMotors(0,0,speed_left, speed_right);
                }

            }, 1000);
        }
    }
});