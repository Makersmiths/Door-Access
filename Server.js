"use strict";
var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var path1 = require('path');
var http = require('http');
var config = require('config');
/*var GPIO = require('onoff').Gpio,
	doorPinWrite = new GPIO(17, 'out');
*/
var fs = require('fs');
var twilio = require('twilio');
var bodyParser = require('body-parser');


var randomNumber;
var isMember = false;
var doorState = "CLOSED";

var getQueryString = function (field, url) {
    var href = url ? url : window.location.href;
    var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    var string = reg.exec(href);
    return string ? string[1] : null;
};

function toggleDoor() {
    console.log(doorState);
}

function openDoor() {
    if (doorState === "CLOSED") {
        doorPinWrite.writeSync(0);
        doorState = "OPEN";
        console.log('Door open now');
    }
}

function closeDoor() {
    if (doorState === "OPEN") {
        doorPinWrite.writeSync(1);
        doorState = "CLOSED";
        console.log('Door closed now');

    }
}
function openDoorAndThenCloseIt(openTime) {
    openTime = openTime | 1000;
    openDoor();
    setTimeout(function () {
        closeDoor();
    }, openTime);
}

const server = app.listen(3000, () => {
    console.log("Live at Port 3000");

});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


router.use(function (req, res, next) {
    console.log("/" + req.method);
    next();
});


router.get("/open/:phoneNumber", function (req, res) {
    console.log(req);
    var phoneNumber = req.params.phoneNumber;
    if (phoneNumber && phoneNumber.length > 0) {
        var membersArr = config.get('members');
        console.log(membersArr);
        var index, member, result, nameDetails;
        isMember = false;
        for (index = 0; index < membersArr.length; index++) {
            member = membersArr[index];
            if (member.phone === phoneNumber) {
                isMember = true;
                nameDetails = member.name;
                result = index;
                break;
            }
        }
        console.log("Is it a member? " + isMember);


        // Send the text message.
        if (phoneNumber != null && isMember) {
            console.log("Name: " + nameDetails);
            randomNumber = '' + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
            var client = twilio(config.get('twilio.account'), config.get('twilio.authToken'));
            console.log(config.get('twilio'));
            client.sendMessage({
                to: '+1' + phoneNumber,
                from: '+1' + config.get('twilio.phoneFrom'),
                body: 'Your verification pin is ' + randomNumber
            });
            console.log("Sent text message");
            console.log('The pin sent by text is :' + randomNumber);
            res.sendFile(path + "pinPrompt.html");
        }
        else {
            res.sendFile(path + "invalidMember.html");
        }
    } else {

    }


});

router.get("/verifyPIN/:pin", function (req, res) {
    var PINnumber = req.params.pin;
    console.log(PINnumber);
    console.log(randomNumber);
    if (PINnumber == randomNumber) {
        res.sendFile(path + "doorOpen.html");
        console.log("Correct PIN, opening door");
        console.log(doorState);
        openDoorAndThenCloseIt(10000);
    }
    else {
        res.sendFile(path + "pinPrompt.html");
        console.log("Incorrect PIN");
    }

});

router.get("/about", function (req, res) {
    res.sendFile(path + "about.html");
});

router.get("/contact", function (req, res) {
    res.sendFile(path + "contact.html");
});

app.use(express.static('public'));

app.use("/", router);

app.use("*", function (req, res) {
    res.sendFile(path + "404.html");
});

/* const server = app.listen(3000,function(){
  console.log("Live at Port 3000");
}); */



