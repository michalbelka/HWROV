#!/usr/bin/python

import RPi.GPIO as GPIO, time
from Adafruit_PWM_Servo_Driver import PWM

# This script is making assumption that motors are connected as in Servo file

CHECK_FREQ = 10

GPIO.setmode(GPIO.BCM)
GPIO.setup(23, GPIO.IN)

while True:
  print(GPIO.input(23))
  if (GPIO.input(23) == False)
    # Initialise the PWM device using the default address
    pwm = PWM(0x40, debug=True)
    pwm.setPWMFreq(60) # Set frequency to 60 Hz

    pwm.setPWM(1, 0, 4000)
    pwm.setPWM(2, 0, 0)

    pwm.setPWM(5, 0, 4000)
    pwm.setPWM(6, 0, 0)

    pwm.setPWM(0, 0, 4000)
    pwm.setPWM(4, 0, 4000)
  time.sleep(CHECK_FREQ)