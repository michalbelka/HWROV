#!/usr/bin/python

from Adafruit_PWM_Servo_Driver import PWM

# This script is making assumption that motors are connected as in Servo file

# Initialise the PWM device using the default address
pwm = PWM(0x40, debug=True)

pwm.setPWMFreq(60)                        # Set frequency to 60 Hz

pwm.setPWM(9, 0, 4000)
pwm.setPWM(10, 0, 0)

pwm.setPWM(13, 0, 0)
pwm.setPWM(14, 0, 4000)

pwm.setPWM(1, 0, 0)
pwm.setPWM(4, 0, 0)
pwm.setPWM(8, 0, 2000)
pwm.setPWM(12, 0, 2000)