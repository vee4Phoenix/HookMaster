#!/usr/bin/env node

module.exports = function(context) {

  var ios_source = 'platforms/ios/JHW Personality Compass/Plugins/com.contactpoint.custom';
  var ios_target = 'com.contactpoint.custom/src/ios';
  var android_source = 'platforms/android/src/com/contactpoint/custom';
  var android_target = 'com.contactpoint.custom/src/android';
  
  var fs = require('fs');
  var path = require('path');

  // no need to configure below
  var platform = process.argv[3];  // cordova build android = android
  var source_path = '';
  var target_path = '';

  if (platform == 'android') {
    source_path = android_source;
    target_path = android_target;
    processFiles(source_path);
  } else if (platform == 'ios') {
    source_path = ios_source;
    target_path = ios_target;
    processFiles(source_path);
  }
  
  function processFiles(dir) {
    var errorCount = 0;
    if (!fs.existsSync(dir)) {
      return;
    }

    fs.readdir(dir, function(err, list) {
      if (err) {
        console.log('processFiles err: ' + err);
        return;
      }

      // iterate directory content
      list.forEach(function(file) {
        var sourceFile = dir + '/' + file;
        var destFile = sourceFile.replace(source_path, target_path);

        // get status
        fs.stat(sourceFile, function(err, stat) {
          if (!stat.isDirectory()) {
            //console.log('Copying ' + sourceFile + '\n to ' + destFile + '\n');
            copyFile(sourceFile, destFile);
          } else {
            processFiles(sourceFile);
          }
        }); // fs.stat
      }); // list.forEach
    }); // fs.readdir
  } // processFiles

  function copyFile(src, dest) {
    if (fs.existsSync(src)) {
      fs.mkdir(path.dirname(dest), function(err) {
        fs.createReadStream(src).pipe(
          fs.createWriteStream(dest));
      });
    }
  }

};
