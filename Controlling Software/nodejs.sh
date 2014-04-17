#!/bin/bash

OUT=/home/pi/nodejs.log                 # Log file location
#APP=/home/pi/Node                      # Node application location
#NODE=/opt/node/bin             # Node server files location

case "$1" in

start)
        # Run node from proper folder
        cd /home/pi/Node
        sudo /opt/node/bin/node /home/pi/Node/server.js > $OUT 2> $OUT &
        ;;

stop)
        sudo killall node
        ;;

*)
        echo "usage: $0 (start|stop)"
esac

exit 0