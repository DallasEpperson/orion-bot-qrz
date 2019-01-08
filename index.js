var config = require('./qrz.config.json');
var request = require('then-request');
var FormData = require('then-request').FormData;
var xmlParser = require('xml-js');

var rgx = /^(<@[A-Za-z0-9]+> )?callsign ([A-Za-z0-9]+)$/;

module.exports.PluginName = 'QRZ.com Callsign Lookup';

module.exports.CanHandleMessage = function(messageText){
    return rgx.test(messageText.toLowerCase());
};

module.exports.HandleMessage = function(event, sendMsg){
    let callsignToLookUp = event.text.toLowerCase().match(rgx)[2];

    let data = new FormData();
    data.append('username', config.username);
    data.append('password', config.password);
    request('POST', 'https://xmldata.qrz.com/xml/1.33/?agent=orionbot', {form: data}).getBody('utf8')
    .then(function(body){
        let authResponse = xmlParser.xml2js(body, {compact: true});
        //todo ensure auth response wasn't an error
        return authResponse.QRZDatabase.Session.Key._text;
    })
    .then(function(sessionKey){
        return request('GET', 'http://xmldata.qrz.com/xml/1.33/?s=' + sessionKey + ';callsign=' + callsignToLookUp).getBody('utf8');
    })
    .then(function(body){
        let callsignResponse = xmlParser.xml2js(body, {compact: true});
        //todo ensure callsign response wasn't an error
        let callsignObj = callsignResponse.QRZDatabase.Callsign;
        let response = callsignObj.call._text + " (" + callsignObj.land._text + "): ";
        response += ((!!callsignObj.fname? callsignObj.fname._text : "") + " " + callsignObj.name._text).trim() + "\n";
        response += callsignObj.addr1._text + "\n" 
        response += callsignObj.addr2._text;
        if(!!callsignObj.state)
            response += ", " + callsignObj.state._text;
        response += " " + callsignObj.zip._text + "\n";
        response += callsignObj.country._text;
        sendMsg(response, event.channel);
        return true;
    })
    .catch(function(err){
        console.log('An error occurred: ', err);
        sendMsg('An error occurred.', event.channel);
    });
};