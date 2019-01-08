# QRZ.com integration for Orion

Plugin for [Orion](https://github.com/DallasEpperson/orion-bot). Adds the ability to ask for amateur radio callsign information.

## Installing

* Copy this repo into a subfolder of Orion's `plugins/` folder
* Copy `qrz.exampleconfig.json` to `qrz.config.json` and replace values accordingly
* Reboot Orion

## Usage

Responds to messages of the format `callsign ab1cd` where `ab1cd` is a callsign.

## Example

Send `callsign W4CAE`  
```
W4CAE (United States): COLUMBIA AMATEUR RADIO CLUB
PO BOX 595
Columbia, SC 29202
United States
```