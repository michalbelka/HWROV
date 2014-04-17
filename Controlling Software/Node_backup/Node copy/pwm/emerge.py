#!/usr/bin/python

from Adafruit_PWM_Servo_Driver import PWM

# This script is making assumption that motors are connected as in Servo file

# Initialise the PWM device using the default address
pwm = PWM(0x40, debug=True)

pwm.setPWMFreq(60)                        # Set frequency to 60 Hz

pwm.setPWM(1, 0, 4000)
pwm.setPWM(2, 0, 0)

pwm.setPWM(5, 0, 4000)
pwm.setPWM(6, 0, 0)

pwm.setPWM(0, 0, 4000)
pwm.setPWM(4, 0, 4000)

