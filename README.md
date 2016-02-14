# Sky-test

I made a mistake reading the specs and instead of creating stubs I created working functions/methods/endpoints etc.

## Requirements

* node.js
* a local MySQL database
* chome (for karma testing)

## Setup

First, ensure you have a local mysqld instance running and then run:

sudo ./setup.sh

This should install the node.js dependencies, setup the local database for you to use, next up:

You may want to setup the mysql database automatically, the current default settings are:

hostname : localhost
database : sky
username : sky
password : sky

; you can insert the sky.sql file to create all of the test data etc:

mysql -usky -psky sky < sky.sql

## Testing

To test, run:

sudo ./test.sh

## To run

To run, use:

sudo ./run.sh

; then open your web browser and point it to http://localhost:8080

## Outro

This was fun, there is still alot to do as I did not write 100% coverage with the tests, but you get the general idea of what needs to go where I think.

This was my first time using Karma, its quite nice, alot better than trying to mess around with selenium and doing native JS calls.

I hope everything is in the right please, if there are any questions please let me know.