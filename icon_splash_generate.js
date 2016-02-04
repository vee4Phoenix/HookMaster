/**
The MIT License (MIT)

Copyright (c) 2014 Alex Disler

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

module.exports = function(context) {

  var fs     = require('fs');
  var ig     = require('imagemagick');
  var _      = context.requireCordovaModule('underscore');
  var Q      = context.requireCordovaModule('q');

  var cordova_util = context.requireCordovaModule("cordova-lib/src/cordova/util");
  var ConfigParser = context.requireCordovaModule('cordova-common').ConfigParser;
  var projectXML = cordova_util.projectConfig(context.opts.projectRoot);
  var projectName = new ConfigParser(projectXML).name();

  /**
   * Check which platforms are added to the project and return their splash screen names and sizes
   *
   * @param  {String} projectName
   * @return {Promise} resolves with an array of platforms
   */
  var getPlatforms = function () {
      var deferred = Q.defer();
      var platforms = [];
      platforms.push({
          name : 'ios',
          // TODO: use async fs.exists
          isAdded : fs.existsSync('platforms/ios'),
          splashPath : 'platforms/ios/' + projectName + '/Images.xcassets/Brand Assets.launchimage/',
          splash : [
              { name : 'Default-568h@2x~iphone.png',      width : 640,   height : 1136 },
              { name : 'Default-667h.png',                width : 750,   height : 1334 },
              { name : 'Default-736h.png',                width : 1242,  height : 2208 },
              { name : 'Default-Landscape-736h.png',      width : 2208,  height : 1242 },
              { name : 'Default-Landscape@2x~ipad.png',   width : 2048,  height : 1536 },
              { name : 'Default-LandscapeNo@2x~ipad.png', width : 2048,  height : 1496 },
              { name : 'Default-Landscape~ipad.png',      width : 1024,  height : 768 },
              { name : 'Default-LandscapeNo~ipad.png',    width : 1024,  height : 748 },
              { name : 'Default-Portrait@2x~ipad.png',    width : 1536,  height : 2048 },
              { name : 'Default-PortraitNo@2x~ipad.png',  width : 1536,  height : 2008 },
              { name : 'Default-Portrait~ipad.png',       width : 768,   height : 1024 },
              { name : 'Default-PortraitNo~ipad.png',     width : 768,   height : 1004 },
              { name : 'Default@2x~iphone.png',           width : 640,   height : 960 },
              { name : 'Default~iphone.png',              width : 320,   height : 480 },
          ],
          iconsPath : 'platforms/ios/' + projectName + '/Images.xcassets/AppIcon.appiconset/',
          icons : [
              { name : 'icon-40.png',       size : 40  },
              { name : 'icon-40@2x.png',    size : 80  },
              { name : 'icon-50.png',       size : 50  },
              { name : 'icon-50@2x.png',    size : 100 },
              { name : 'icon-60@2x.png',    size : 120 },
              { name : 'icon-60@3x.png',    size : 180 },
              { name : 'icon-72.png',       size : 72  },
              { name : 'icon-72@2x.png',    size : 144 },
              { name : 'icon-76.png',       size : 76  },
              { name : 'icon-76@2x.png',    size : 152 },
              { name : 'icon-small.png',    size : 29  },
              { name : 'icon-small@2x.png', size : 58  },
              { name : 'icon-small@3x.png', size : 87  },
              { name : 'icon.png',          size : 57  },
              { name : 'icon@2x.png',       size : 114 },
          ]          
      });
      platforms.push({
          name : 'android',
          isAdded : fs.existsSync('platforms/android'),
          splashPath : 'platforms/android/res/',
          splash : [
              { name : 'drawable-land-ldpi/screen.png',  width : 320,  height: 200 },
              { name : 'drawable-land-mdpi/screen.png',  width : 480,  height: 320 },
              { name : 'drawable-land-hdpi/screen.png',  width : 800,  height: 480 },
              { name : 'drawable-land-xhdpi/screen.png', width : 1280, height: 720 },
              { name : 'drawable-port-ldpi/screen.png',  width : 200,  height: 320 },
              { name : 'drawable-port-mdpi/screen.png',  width : 320,  height: 480 },
              { name : 'drawable-port-hdpi/screen.png',  width : 480,  height: 800 },
              { name : 'drawable-port-xhdpi/screen.png', width : 720,  height: 1280 },
          ],
          iconsPath : 'platforms/android/res/',
          icons : [
              { name : 'drawable/icon.png',         size : 96 },
              { name : 'drawable-hdpi/icon.png',    size : 72 },
              { name : 'drawable-ldpi/icon.png',    size : 36 },
              { name : 'drawable-mdpi/icon.png',    size : 48 },
              { name : 'drawable-xhdpi/icon.png',   size : 96 },
              { name : 'drawable-xxhdpi/icon.png',  size : 144 },
              { name : 'drawable-xxxhdpi/icon.png', size : 192 },
              { name : 'icon-web.png', 				size : 512 },
          ]          
      });
      // TODO: add all platforms
      deferred.resolve(platforms);
      return deferred.promise;
  };


  /**
   * @var {Object} settings - names of the config file and of the splash image
   * TODO: add option to get these values as CLI params
   */
  var settings = {};
  settings.CONFIG_FILE = 'config.xml';
  settings.SPLASH_FILE = 'splash.png';
  settings.ICON_FILE   = 'icon.png';

  /**
   * @var {Object} console utils
   */
  var display = {};
  display.success = function (str) {
      str = 'Success:  ' + str;
      console.log('  ' + str);
  };
  display.error = function (str) {
      str = 'Error:  ' + str;
      console.log('  ' + str);
  };
  display.header = function (str) {
      console.log('');
      console.log(' ### ' + str + ' ### ');
      console.log('');
  };

  /**
   * Crops and creates a new splash in the platform's folder.
   *
   * @param  {Object} platform
   * @param  {Object} splash
   * @return {Promise}
   */
  var generateSplash = function (platform, splash) {
      var deferred = Q.defer();
      ig.crop({
          srcPath: settings.SPLASH_FILE,
          dstPath: platform.splashPath + splash.name,
          quality: 1,
          format: 'png',
          width: splash.width,
          height: splash.height,
      } , function(err, stdout, stderr){
          if (err) {
              deferred.reject(err);
          } else {
              deferred.resolve();
              display.success(splash.name + ' created');
          }
      });
      return deferred.promise;
  };
  
  /**
   * Resizes and creates a new icon in the platform's folder.
   *
   * @param  {Object} platform
   * @param  {Object} icon
   * @return {Promise}
   */
  var generateIcon = function (platform, icon) {
      var deferred = Q.defer();
      ig.resize({
          srcPath: settings.ICON_FILE,
          dstPath: platform.iconsPath + icon.name,
          quality: 1,
          format: 'png',
          width: icon.size,
          height: icon.size,
      } , function(err, stdout, stderr){
          if (err) {
              deferred.reject(err);
          } else {
              deferred.resolve();
              display.success(icon.name + ' created');
          }
      });
      return deferred.promise;
  };

  /**
   * Generates splash based on the platform object
   *
   * @param  {Object} platform
   * @return {Promise}
   */
  var generateSplashForPlatform = function (platform) {
      var deferred = Q.defer();
      display.header('Generating splash screen for ' + platform.name);
      var all = [];
      var splashes = platform.splash;
      splashes.forEach(function (splash) {
          all.push(generateSplash(platform, splash));
      });
      Q.all(all).then(function () {
          deferred.resolve();
      }).catch(function (err) {
          console.log(err);
      });
      return deferred.promise;
  };
  
  /**
   * Generates icons based on the platform object
   *
   * @param  {Object} platform
   * @return {Promise}
   */
  var generateIconsForPlatform = function (platform) {
      var deferred = Q.defer();
      display.header('Generating Icons for ' + platform.name);
      var all = [];
      var icons = platform.icons;
      icons.forEach(function (icon) {
          all.push(generateIcon(platform, icon));
      });
      Q.all(all).then(function () {
          deferred.resolve();
      }).catch(function (err) {
          console.log(err);
      });
      return deferred.promise;
  };

  /**
   * Goes over all the platforms and triggers splash screen generation
   *
   * @param  {Array} platforms
   * @return {Promise}
   */
  var generateSplashes = function (platforms) {
      var deferred = Q.defer();
      var sequence = Q();
      var all = [];
      _(platforms).where({ isAdded : true }).forEach(function (platform) {
          sequence = sequence.then(function () {
              return generateSplashForPlatform(platform);
          });
          all.push(sequence);
      });
      Q.all(all).then(function () {
          deferred.resolve();
      });
      return deferred.promise;
  };
  
  /**
   * Goes over all the platforms and triggers icon generation
   *
   * @param  {Array} platforms
   * @return {Promise}
   */
  var generateIcons = function (platforms) {
      var deferred = Q.defer();
      var sequence = Q();
      var all = [];
      _(platforms).where({ isAdded : true }).forEach(function (platform) {
          sequence = sequence.then(function () {
              return generateIconsForPlatform(platform);
          });
          all.push(sequence);
      });
      Q.all(all).then(function () {
          deferred.resolve(platforms);
      });
      return deferred.promise;
  };

  /**
   * Checks if at least one platform was added to the project
   *
   * @return {Promise} resolves if at least one platform was found, rejects otherwise
   */
  var atLeastOnePlatformFound = function () {
      var deferred = Q.defer();
      getPlatforms().then(function (platforms) {
          var activePlatforms = _(platforms).where({ isAdded : true });
          if (activePlatforms.length > 0) {
              display.success('platforms found: ' + _(activePlatforms).pluck('name').join(', '));
              deferred.resolve();
          } else {
              display.error('No cordova platforms found. Make sure you are in the root folder of your Cordova project and add platforms with \'cordova platform add\'');
              deferred.reject();
          }
      });
      return deferred.promise;
  };

  /**
   * Checks if a valid splash file exists
   *
   * @return {Promise} resolves if exists, rejects otherwise
   */
  var validSplashExists = function () {
      var deferred = Q.defer();
      fs.exists(settings.SPLASH_FILE, function (exists) {
          if (exists) {
              display.success(settings.SPLASH_FILE + ' exists');
              deferred.resolve();
          } else {
              display.error(settings.SPLASH_FILE + ' does not exist in the root folder');
              deferred.reject();
          }
      });
      return deferred.promise;
  };
  
  /**
   * Checks if a valid icon file exists
   *
   * @return {Promise} resolves if exists, rejects otherwise
   */
  var validIconExists = function () {
      var deferred = Q.defer();
      fs.exists(settings.ICON_FILE, function (exists) {
          if (exists) {
              display.success(settings.ICON_FILE + ' exists');
              deferred.resolve();
          } else {
              display.error(settings.ICON_FILE + ' does not exist in the root folder');
              deferred.reject();
          }
      });
      return deferred.promise;
  };

  /**
   * Checks if a config.xml file exists
   *
   * @return {Promise} resolves if exists, rejects otherwise
   */
  var configFileExists = function () {
      var deferred = Q.defer();
      fs.exists(settings.CONFIG_FILE, function (exists) {
          if (exists) {
              display.success(settings.CONFIG_FILE + ' exists');
              deferred.resolve();
          } else {
              display.error('cordova\'s ' + settings.CONFIG_FILE + ' does not exist in the root folder');
              deferred.reject();
          }
      });
      return deferred.promise;
  };

  display.header('Checking Project & Splash & Icon');

  atLeastOnePlatformFound()
      .then(validSplashExists)
      .then(validIconExists)
      .then(configFileExists)
      .then(getPlatforms)
      .then(generateIcons)
      .then(generateSplashes)
      .catch(function (err) {
          if (err) {
              console.log(err);
          }
      }).then(function () {
          console.log('');
      });
}