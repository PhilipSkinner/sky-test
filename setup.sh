#!/bin/sh

#should be run as sudo
if [ `id -u` -ne 0 ]; then
        echo "You need root privileges to run this script."
        exit 1
fi

#our dependencies
echo "Installing dependencies..."
npm install express q mysql body-parser jasmine request less karma karma-chrome-launcher karma-jasmine karma-cli

#lets make our DB
echo "Setting up database..."
mysqladmin create sky

#set up some privileges with our default values
mysql -e "GRANT all ON sky.* to sky@'localhost' identified by 'sky'"
mysql -e "FLUSH PRIVILEGES"
mysql sky < sky.sql

#compile our less to css
echo "Compiling less..."
lessc site/static/styles/main.less site/static/css/main.css