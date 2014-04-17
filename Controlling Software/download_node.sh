#!/bin/bash

cp -a ./Node ./Node_backup/Node_$(date +"%Y-%m-%d-%H-%M-%S") # Copy old version to backup 
rsync -avz --delete -e ssh pi@192.168.0.101:~/Node/ ./Node # Install new version