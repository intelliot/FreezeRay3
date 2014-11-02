// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body class="platform-ios platform-cordova platform-webview"> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var freezeRayApp = angular.module('app', ['ionic', 'ngCordova'])

.run(function($ionicPlatform) {
$ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    .state('page3', {
        url: '/wallet',
        templateUrl: 'page3.html'
        })

    .state('page5', {
        url: '/welcome',
        templateUrl: 'page5.html'
        })

    .state('page6', {
        url: '/create',
        templateUrl: 'page6.html'
        })

    .state('page7', {
        url: '/reminders',
        templateUrl: 'page7.html'
        })

    .state('page8', {
        url: '/send',
        templateUrl: 'page8.html'
        })

    .state('page9', {
        url: '/unsignedtx',
        templateUrl: 'page9.html'
        })

    .state('page10', {
        url: '/scantx',
        templateUrl: 'page10.html'
        })

    .state('page11', {
        url: '/offlinescan',
        templateUrl: 'page11.html'
        })
    ;

    // if none of the above states are matched, use this as the fallback

    $urlRouterProvider.otherwise('/welcome');


});

freezeRayApp

.controller("welcomeCtrl", function($scope) {
    alert(makeKey());
})

.controller("QRScannerController", function($scope, $cordovaBarcodeScanner) {
    $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {                                 
            alert(imageData.text);
            console.log("format " + imageData.format);
        }, function(error) {
            console.log("error: " + error);
        });
    }
});