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

    .state('page12', {
        url: '/buildtransaction',
        templateUrl: 'page12.html'
        })

    .state('confirmSell', {
        url: '/confirmSell',
        templateUrl: 'confirmSell.html'
        })

    ;

    // if none of the above states are matched, use this as the fallback

    $urlRouterProvider.otherwise('/welcome');


    });

    freezeRayApp

    .controller("QRConfirm", function($scope) {
      $scope.friendKey = window.localStorage.getItem('friendKey');
      $scope.confirm =  function() {
        alert();
      }
    })

    .controller("welcomeCtrl", function($scope) {
        if (!window.localStorage.getItem('privateKey') && !window.localStorage.getItem('publicKey')) {
            key = new makeKey();
            window.localStorage.setItem('publicKey',key.pub);
            window.localStorage.setItem('privateKey',key.toWIF);
            window.localStorage.setItem('key',key.key);
            alert("New public/private key pair generated! \n private key: \n" + window.localStorage.getItem('privateKey'));
        }
    })

    .controller("QRScannerController", function($scope, $cordovaBarcodeScanner, $location) {
        $scope.scanBarcode = function() {
            $cordovaBarcodeScanner.scan().then(function(imageData) {
                window.localStorage.setItem('friendKey', imageData.text)
                $location.path('/confirmSell');
            }, function(error) {
                console.log("error: " + error);
            });
        }
    })

    .controller("BuildUnsignedTXController", function($scope,$http) {
     
      $scope.buildUnsignedTX = function(transaction) {
        var chainurl = 'https://api.chain.com/v2/bitcoin/';
        var chainkey = '?api-key-id=DEMO-4a5e1e4';
        var fromx = transaction.fromAddress;
        var url = chainurl + "addresses/" + fromx + "/unspents" + chainkey;
        console.log("utxo chain url=" + url);

        $http.get(url).success(function(data) {
          console.log("got=" + JSON.stringify(data));
        });
      }

    });
