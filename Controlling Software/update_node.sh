#!/bin/bash

ssh pi@192.168.0.101 'cp -a ~/Node ~/Node_backup/Node_$(date +"%Y-%m-%d-%H-%M-%S")' # Copy old version to backup 
rsync -avz --delete -e ssh ./Node/ pi@192.168.0.101:~/Node # Install new version
