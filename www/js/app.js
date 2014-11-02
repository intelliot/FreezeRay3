// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body class="platform-ios platform-cordova platform-webview"> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var freezehack = new Array();
freezehack['pubKey']  = '1LFKEBkpVFheo5QKyKVL2bvXDtvbnArWJu';
freezehack['privKey'] = 'KwQBcaqY5uW48g8RUsxKJsMVdZDCWqc2u98XQWP12XQxQjfPt2hB';
//freezehack['privkey'] = 'KwQBcaqY5uW48g8RUsxKJsMVdZDCWqc2u98XQWP12XQxQjfPt2hB'
freezehack['chainurl'] = 'https://api.chain.com/v2/bitcoin';
freezehack['chainkey'] = '?api-key-id=DEMO-4a5e1e4';

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

    .state('QRShow', {
        url: '/QRShow',
        templateUrl: 'QRShow.html'
        })

    ;

    // if none of the above states are matched, use this as the fallback

    $urlRouterProvider.otherwise('/welcome');


    });

    freezeRayApp

    .controller("QRConfirm", function($scope, $location) {
      $scope.friendKey = window.localStorage.getItem('friendKey');
      $scope.amount = window.localStorage.getItem('friendAmount');
      $scope.confirm =  function() {
        $location.path('QRShow')
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
        $scope.scanBarcode = function(object) {
            $cordovaBarcodeScanner.scan().then(function(imageData) {
                window.localStorage.setItem('friendKey', imageData.text)
                window.localStorage.setItem('amount', amount)
                $location.path('/confirmSell');
            }, function(error) {
                console.log("error: " + error);
            });
        }
    })

    .controller("QRShow", function($scope, $location) {
        $scope.message = "Scan this with your offline device to sign the transaction";
        new QRCode(document.getElementById("qrcode"), window.localStorage.getItem('utx'));
        $scope.next = function() {
            $location.path('/scantx');
        }
    })

    .controller("ScanAddressToPayController", function($scope, $cordovaBarcodeScanner, $http, $location) {

      $scope.scanBarcode = function(transaction) {
        //alert('got into ScanAddressToPayController, scanBarcode')

        function processInfo(input,mode) {
          console.log("got here, input="+input+",mode="+mode)
          //alert("got here, input="+input+",mode="+mode)
          if (mode == 'camera') {
              freezehack['payToAddress'] = input.text;
          }
          else {
            freezehack['payToAddress'] = input;
          }

          window.localStorage.setItem('friendKey', freezehack.payToAddress)
          window.localStorage.setItem('friendAmount', freezehack.payAmountMBTC)

          //alert("building api call");

          var chainurl = 'https://api.chain.com/v2/bitcoin/';
          var chainkey = '?api-key-id=DEMO-4a5e1e4';
          var fromaddr = freezehack.pubKey;
          var url = chainurl + "addresses/" + fromaddr + "/unspents" + chainkey;
          console.log("utxo chain url=" + url);
          //alert("utxo chain url=" + url);

          $http.get(url)
          .success(function(data,transaction) {
            console.log("got=" + JSON.stringify(data));
            //alert("got=" + JSON.stringify(data));
            freezehack['unsignedTransactionDataObject'] = data;
            unsignedTransHex = buildSimpleTransaction()
            //$location.path('/unsignedtx')
            window.localStorage.setItem('utx',unsignedTransHex);
            //alert("unsignedtranshex=" + JSON.stringify(data));
            $location.path('/confirmSell');
          })
          .error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              //alert("Something went wrong :("+JSON.stringify(data))
              console.log("Something went wrong :("+JSON.stringify(data))
            });

        }

        freezehack['payAmountMBTC'] = transaction.amount
        if (transaction && transaction['toAddress'] != undefined) {
          //alert('got into ScanAddressToPayController, call processInfo for paste')

          processInfo(transaction.toAddress,'paste')
        }
        else {
          //alert('got into ScanAddressToPayController, call cordovaBarcodeScanner')
          $cordovaBarcodeScanner.scan().then(function(imageData){ 
              alert("got into imagedata func")
              processInfo(imageData,'camera')
            },
            function(error) { console.log("error: " + error); 
          }
          );
        }
      }





    })


    .controller("ScanUnsignedTXController", function($scope, $cordovaBarcodeScanner, $http, $location) {

      $scope.scanBarcode = function(unsigned) {

        function processInfo(input,mode) {
          console.log("got here, input="+input+",mode="+mode)
          if (mode == 'camera') {
              freezehack['unsignedtxhex'] = input.text;
          }
          else {
            freezehack['unsignedtxhex'] = input;
          }

          //alert("unsigned tx hex is="+freezehack.unsignedtxhex+", now it needs to be signed");

          var txObj = Bitcoin.Transaction.fromHex(freezehack.unsignedtxhex)

          console.log("got here, this should be an object="+txObj)

          // hack, assume index zero
          privKeyHex = Bitcoin.ECKey.fromWIF(freezehack.privKey);
          txObj.sign(0,privKeyHex)

          freezehack['signedTransactionHex'] = txObj.toHex()

          console.log("signed tx hex="+freezehack.signedTransactionHex)

          alert("signed transaction hex="+freezehack.signedTransactionHex+", please display this to the user for them to scan with their online device")

        }

        if (unsigned && unsigned.txhash) {
          processInfo(unsigned.txhash,'paste')
        }
        else {
          $cordovaBarcodeScanner.scan().then(processInfo(imageData,'camera'),
            function(error) { console.log("error: " + error); 
          });
        }
      }

    }) 

    .controller("ScanSignedTXController", function($scope, $cordovaBarcodeScanner, $http, $location) {

      $scope.scanBarcode = function(signed) {

        function processInfo(input,mode) {
          console.log("got here, input="+input+",mode="+mode)
          if (mode == 'camera') {
              freezehack['signedTransactionHex'] = input.text;
          }
          else {
            freezehack['signedTransactionHex'] = input;
          }

          console.log("got here, the signed transaction hash is=",freezehack.signedTransactionHex);

          //var url = 'https://blockchain.info/pushtx';
          var url = freezehack.chainurl+'/transactions'+freezehack.chainkey
          console.log("POSTing data to "+url)
          //var toPost = freezehack.signedTransactionHex
          var toPost = {'hex': freezehack.signedTransactionHex}
          //alert("Are you sure you want to post "+freezehack.signedTransactionHex+" to "+url)

          $http.post(url, toPost).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              alert("Bitcoins Sent!"+JSON.stringify(data))
              console.log("Much success!"+JSON.stringify(data))
            }). 
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
              alert("Something went wrong :("+JSON.stringify(data))
              console.log("Something went wrong :("+JSON.stringify(data))
            });

        }

        if (signed && signed.txhash) {
          processInfo(signed.txhash,'paste')
        }
        else {
          $cordovaBarcodeScanner.scan().then(processInfo(imageData,'camera'),
            function(error) { console.log("error: " + error); 
          });
        }
      }

    }) 



    .controller("walletCtrl", function($scope) {
        $(function() {
            $('#graph').highcharts({
                xAxis: {
                    type: 'datetime',
                    minRange: 4 * 24 * 3600000, // fourteen days
                },
                yAxis: {
                    title: null
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: 'Market Price (USD)'
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 1
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },
                series: [{
                    data: [

        [1383416105000,204.15],[1383502505000,206.85],[1383588905000,225.1],[1383675305000,246.63],[1383761705000,258.23],[1383848105000,292.32],[1383934505000,325.56],[1384020905000,359.76],[1384107305000,296.91],[1384193705000,339.38],[1384280105000,353.95],[1384366505000,391.64],[1384452905000,416.5],[1384539305000,428.24],[1384625705000,433.53],[1384712105000,463.0],[1384798505000,583.16],[1384884905000,559.99],[1384971305000,595.0],[1385057705000,694.95],[1385144105000,761.0],[1385230505000,837.99],[1385316905000,833.16],[1385403305000,814.0],[1385489705000,844.9],[1385576105000,961.0],[1385662505000,1009.0],[1385748905000,1083.9],[1385835305000,1119.96],[1385921705000,970.0],[1386008105000,992.27],[1386094505000,1060.0],[1386180905000,1151.0],[1386267305000,1028.34],[1386353705000,894.0],[1386440105000,727.29],[1386526505000,722.99],[1386612905000,871.0],[1386699305000,936.98],[1386785705000,886.2],[1386872105000,845.75],[1386958505000,874.0],[1387044905000,864.7],[1387131305000,848.17],[1387217705000,709.0],[1387304105000,702.05],[1387390505000,576.16],[1387476905000,653.0],[1387563305000,660.0],[1387649705000,612.5],[1387736105000,637.0],[1387822505000,639.9],[1387908905000,647.27],[1387995305000,658.07],[1388081705000,734.42],[1388168105000,715.51],[1388254505000,701.61],[1388340905000,714.79],[1388427305000,739.1],[1388513705000,731.0],[1388600105000,746.9],[1388686505000,758.01],[1388772905000,806.21],[1388859305000,822.38],[1388945705000,896.0],[1389032105000,934.21],[1389118505000,867.38],[1389204905000,825.29],[1389291305000,809.17],[1389377705000,827.46],[1389464105000,891.85],[1389550505000,851.0],[1389636905000,807.83],[1389723305000,820.75],[1389809705000,847.7],[1389896105000,830.9],[1389982505000,793.0],[1390068905000,801.53],[1390155305000,833.0],[1390241705000,831.72],[1390328105000,822.56],[1390414505000,813.05],[1390500905000,813.02],[1390587305000,789.1],[1390673705000,806.0],[1390760105000,826.77],[1390846505000,777.0],[1390932905000,800.2],[1391019305000,803.6],[1391105705000,799.37],[1391192105000,802.5],[1391278505000,815.99],[1391364905000,819.57],[1391451305000,813.8],[1391537705000,809.05],[1391624105000,800.0],[1391710505000,778.0],[1391796905000,742.78],[1391883305000,707.0],[1391969705000,710.0],[1392056105000,665.0],[1392142505000,670.0],[1392228905000,667.01],[1392315305000,633.99],[1392401705000,672.1],[1392488105000,651.42],[1392574505000,623.5],[1392660905000,642.0],[1392747305000,626.77],[1392833705000,623.93],[1392920105000,582.7],[1393006505000,566.16],[1393092905000,603.98],[1393179305000,626.77],[1393265705000,545.0],[1393352105000,528.0],[1393438505000,585.38],[1393524905000,585.17],[1393611305000,577.97],[1393697705000,571.5],[1393784105000,559.88],[1393870505000,666.5],[1393956905000,677.61],[1394043305000,664.85],[1394129705000,657.02],[1394216105000,621.3],[1394302505000,609.0],[1394388905000,637.99],[1394475305000,621.99],[1394561705000,622.9],[1394648105000,642.1],[1394734505000,642.61],[1394820905000,636.47],[1394907305000,636.29],[1394993705000,634.94],[1395080105000,624.7],[1395166505000,627.0],[1395252905000,608.41],[1395339305000,590.0],[1395425705000,579.99],[1395512105000,557.0],[1395598505000,567.13],[1395684905000,572.0],[1395771305000,580.02],[1395857705000,585.7],[1395944105000,520.2],[1396030505000,503.0],[1396116905000,499.94],[1396203305000,449.02],[1396289705000,457.0],[1396376105000,479.51],[1396462505000,445.0],[1396548905000,446.31],[1396635305000,446.01],[1396721705000,451.84],[1396808105000,459.67],[1396894505000,447.74],[1396980905000,454.07],[1397067305000,443.1],[1397153705000,401.0],[1397240105000,427.99],[1397326505000,424.98],[1397412905000,405.0],[1397499305000,453.14],[1397585705000,489.91],[1397672105000,511.5],[1397758505000,495.0],[1397844905000,479.98],[1398017705000,500.19],[1398104105000,496.5],[1398190505000,493.33],[1398276905000,487.3],[1398363305000,491.6],[1398449705000,459.15],[1398536105000,463.88],[1398622505000,440.1],[1398708905000,447.0],[1398795305000,447.7],[1398881705000,449.0],[1398968105000,460.01],[1399054505000,447.51],[1399140905000,434.5],[1399227305000,436.21],[1399313705000,427.83],[1399400105000,430.33],[1399486505000,446.65],[1399572905000,441.5],[1399659305000,452.02],[1399745705000,452.42],[1399832105000,435.0],[1399918505000,441.5],[1400004905000,438.95],[1400091305000,447.49],[1400177705000,448.99],[1400264105000,449.51],[1400350505000,449.08],[1400436905000,447.14],[1400523305000,446.42],[1400609705000,485.01],[1400696105000,494.87],[1400782505000,523.84],[1400868905000,527.47],[1400955305000,521.52],[1401041705000,575.0],[1401128105000,584.0],[1401214505000,581.87],[1401300905000,574.33],[1401387305000,568.0],[1401473705000,609.03],[1401560105000,620.45],[1401646505000,674.98],[1401732905000,631.49],[1401819305000,673.9],[1401905705000,644.66],[1401992105000,658.72],[1402078505000,655.75],[1402164905000,654.3],[1402251305000,652.0],[1402337705000,650.93],[1402424105000,649.89],[1402510505000,639.99],[1402596905000,617.0],[1402683305000,582.0],[1402769705000,557.92],[1402856105000,560.49],[1402942505000,595.0],[1403028905000,597.65],[1403115305000,604.6],[1403201705000,604.32],[1403288105000,593.33],[1403374505000,590.99],[1403460905000,596.08],[1403547305000,591.5],[1403633705000,585.54],[1403720105000,567.0],[1403806505000,569.0],[1403892905000,588.97],[1403979305000,597.08],[1404065705000,596.0],[1404152105000,620.0],[1404238505000,654.45],[1404324905000,654.0],[1404411305000,644.04],[1404497705000,635.49],[1404584105000,632.78],[1404670505000,634.49],[1404756905000,621.98],[1404843305000,623.7],[1404929705000,624.84],[1405016105000,619.78],[1405102505000,630.31],[1405188905000,631.98],[1405275305000,630.9],[1405361705000,622.8],[1405448105000,623.17],[1405534505000,619.48],[1405620905000,626.0],[1405707305000,629.86],[1405793705000,630.92],[1405880105000,623.77],[1405966505000,619.14],[1406052905000,621.03],[1406139305000,622.01],[1406225705000,601.18],[1406312105000,602.59],[1406398505000,595.88],[1406484905000,592.51],[1406571305000,586.96],[1406657705000,581.5],[1406744105000,573.48],[1406830505000,586.0],[1406916905000,601.94],[1407003305000,591.59],[1407089705000,589.79],[1407176105000,593.94],[1407262505000,580.21],[1407348905000,581.6],[1407435305000,587.24],[1407521705000,589.3],[1407608105000,588.61],[1407694505000,588.99],[1407780905000,578.97],[1407867305000,569.54],[1407953705000,550.14],[1408040105000,521.66],[1408126505000,498.16],[1408212905000,509.0],[1408299305000,491.88],[1408385705000,468.19],[1408472105000,487.5],[1408558505000,507.3],[1408644905000,525.78],[1408731305000,518.25],[1408817705000,503.88],[1408904105000,510.75],[1408990505000,503.79],[1409076905000,512.79],[1409163305000,514.84],[1409249705000,509.39],[1409336105000,511.99],[1409422505000,503.88],[1409508905000,477.98],[1409595305000,482.59],[1409681705000,483.65],[1409768105000,472.76],[1409854505000,486.0],[1409940905000,485.91],[1410027305000,481.09],[1410113705000,480.62],[1410200105000,476.61],[1410286505000,466.48],[1410372905000,485.03],[1410459305000,469.0],[1410545705000,470.43],[1410632105000,479.86],[1410718505000,475.49],[1410804905000,475.3],[1410891305000,468.0],[1410977705000,448.0],[1411064105000,428.19],[1411150505000,398.89],[1411236905000,415.56],[1411323305000,406.3],[1411409705000,400.98],[1411496105000,423.0],[1411582505000,431.91],[1411668905000,408.08],[1411755305000,405.14],[1411841705000,400.74],[1411928105000,380.0],[1412014505000,381.94],[1412100905000,382.67],[1412187305000,385.27],[1412273705000,375.85],[1412360105000,363.75],[1412446505000,336.0],[1412532905000,293.67],[1412619305000,331.2],[1412705705000,330.7],[1412792105000,346.26],[1412878505000,378.94],[1412964905000,358.97],[1413051305000,359.99],[1413137705000,364.83],[1413224105000,381.46],[1413310505000,411.89],[1413396905000,394.0],[1413483305000,378.02],[1413569705000,382.83],[1413656105000,389.68],[1413742505000,388.99],[1413828905000,384.95],[1413915305000,387.0],[1414001705000,385.1],[1414088105000,363.99],[1414174505000,358.46],[1414260905000,348.89],[1414347305000,355.43],[1414433705000,356.5],[1414520105000,354.94],[1414606505000,343.53],[1414692905000,337.0],[1414779305000,340.95],[1414865705000,327.39],[1414916161770,324.78]

                    ]
                }]
            }); 
        });
    })

    .controller("BuildUnsignedTXController", function($scope,$http) {
      $scope.buildUnsignedTX = function(transaction) {
        var chainurl = 'https://api.chain.com/v2/bitcoin/';
        var chainkey = '?api-key-id=DEMO-4a5e1e4';
        //var fromx = transaction.fromAddress;
        var fromx = window.localStorage.getItem('publicKey');
        var url = chainurl + "addresses/" + fromx + "/unspents" + chainkey;
        console.log("utxo chain url=" + url);

        $http.get(url).success(function(data) {
          console.log("got=" + JSON.stringify(data));
        });
      }

    });
