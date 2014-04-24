#!/usr/bin/env node
// List of plugins to install
var pluginlist = [
    {
        id: 	"org.apache.cordova.file@1.0.1"
    },
    {
        id: 	"org.apache.cordova.file-transfer@0.4.1"
    },
    {
        id: 	"org.apache.cordova.device@0.2.7"
    },
    {
        id: 	"org.apache.cordova.geolocation@0.3.6"
    },
    {
        id: 	"org.apache.cordova.network-information@0.2.7"
    },
    {
        id:     "https://github.com/Adobe-Marketing-Cloud/cordova-zip-plugin.git"
    },
    {
        id: 	"org.apache.cordova.device-orientation"
    },
    {
        id:     "org.apache.cordova.camera"
    },
    {
        id:     "org.apache.cordova.network-information"
    },
    {
        id:     "org.apache.cordova.inappbrowser"
    }
];

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

// Define endsWith function
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function puts(error, stdout, stderr) {
    console.log(stdout);
}

function pluginIsAlreadyInstalled(pluginId, installedPlugins) {
    for (var i = 0; i < installedPlugins.length; i++) {
        var currentPlugin = installedPlugins[i];
        if (currentPlugin.endsWith(pluginId)) {
            console.log('already installed: ' + pluginId);
            return true;
        }
    }

    console.log('not installed: ' + pluginId);
    return false;
}

// Get current list of plugins
exec('phonegap local plugin list', function(error, stdout, stderr) {
    if (error) {
        console.log('error reading plugin list. code: [' + error.code + ']');
    }
    else {
        // Output is expected in the following form:
        // [phonegap] org.apache.cordova.file-transfer
        // [phonegap] org.apache.cordova.splashscreen

        // Split at the newline to get an array of plugin entries
        var pluginListOutput = stdout.split('\n');
        var currentPlugins = [];
        for (var i = 0; i < pluginListOutput.length; i++) {
            var pluginEntry = pluginListOutput[i];

            if (pluginEntry.indexOf('phonegap') !== -1) {
                currentPlugins.push(pluginEntry);
            }
        }

        // Iterate through list of plugins, install those which are missing
        pluginlist.forEach(function(plugin) {
            if (pluginIsAlreadyInstalled(plugin.id, currentPlugins) === false) {
                console.log('installing plugin: ' + plugin.id);
                exec('phonegap local plugin add ' + plugin.id, puts);
            }
        });
    }
});