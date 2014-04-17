#!/usr/bin/python

# Input argumnets:
#
# -m x
# Motor number, int, 0-3
#
# -v x
# motor speed, between 0 and 4095
#
# -d x
# motor direction, 1 for forward, 0 for backward, 2 no change


from Adafruit_PWM_Servo_Driver import PWM
import argparse

# ===========================================================================
# Argument parser
# ===========================================================================

parser = argparse.ArgumentParser(description='Set % value for motors')
parser.add_argument('-m', nargs=1, type=int, required=True, choices=range(0,4), help="Motor number, 0-3 (top, bottom, right, left respectively)")
parser.add_argument('-v', nargs=1, type=int, required=True, choices=range(0, 4096), help="motor speed % value, int, -100 - 100")
parser.add_argument('-d', nargs=1, type=int, required=True, choices=range(0,3), help="1 for forward, 0 for backward, 2 no change")

vars = parser.parse_args()


# ===========================================================================
# Assign motor argument to chanel
# ===========================================================================

if vars.m[0] == 0: # Front
  chan = 0
elif vars.m[0] == 1: # Rear
  chan = 4
elif vars.m[0] == 2: # Right
  chan = 8
elif vars.m[0] == 3: # Left
  chan = 12

# ===========================================================================
# Initialise the PWM device using the default address
# Set frequency to 60 Hz
# ===========================================================================
pwm = PWM(0x40, debug=True)
pwm.setPWMFreq(60)

# ===========================================================================
# Assign direction
# This may need to be changed!
# ===========================================================================

if(vars.d[0] == 0): # Forward
  pwm.setPWM(chan+1, 0, 4000)
  pwm.setPWM(chan+2, 0, 0)
elif(vars.d[0] == 1): # Backward
  pwm.setPWM(chan+1, 0, 0)
  pwm.setPWM(chan+2, 0, 4000)

# ===========================================================================
# Set speed
# ===========================================================================

pwm.setPWM(chan, 0, vars.v[0])


