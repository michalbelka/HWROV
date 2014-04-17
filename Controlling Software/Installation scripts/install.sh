#!/bin/bash

#######################
# MJPG Streamer
#######################

mkdir ~/installation
cd ~/installation

# Install dev version of libjpeg
sudo apt-get install libjpeg62-dev

# Install cmake
sudo apt-get install cmake

# Download mjpg-streamer with raspicam plugin
git clone https://github.com/jacksonliam/mjpg-streamer.git ~/installation/mpjg

# Change directory
cd ~/installation/mpjg/mjpg-streamer-experimental

# Compile
make clean all

# Replace old mjpg-streamer
sudo mkdir /opt/mjpg-streamer
sudo mv ~/installation/mpjg/mjpg-streamer-experimental /opt/mjpg-streamer
sudo rm -rf ~/installation/mpjg

# To begin streaming
# LD_LIBRARY_PATH=/opt/mjpg-streamer/ /opt/mjpg-streamer/mjpg_streamer -i "input_raspicam.so -fps 15 -q 50 -x 640 -y 480" -o "output_http.so -p 9000 -w /opt/mjpg-streamer/www" &

#######################
# Node.js
#######################

sudo mkdir /opt/node
mkdir ~/installation/node
cd ~/installation/node

wget http://nodejs.org/dist/v0.10.24/node-v0.10.24-linux-arm-pi.tar.gz
tar xvzf node-v0.10.24-linux-arm-pi.tar.gz
sudo cp -r node-v0.10.24-linux-arm-pi/* /opt/node


