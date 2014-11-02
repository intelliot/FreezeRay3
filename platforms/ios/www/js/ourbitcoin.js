var tx;
var wifprivkey;
var pubaddr;

function makeKey() {
	key = Bitcoin.ECKey.makeRandom()
	console.log("key="+key)

	// Print your private key (in WIF format)
	wifprivkey = key.toWIF();
	console.log("wifprivkey="+wifprivkey);

	//TODO// ENCRYPT THE KEY AND SAVE TO DEVICE STORAGE HERE

	// Print your public key (toString defaults to a Bitcoin address)
	pubaddr = key.pub.getAddress().toString()
	console.log("pubaddr="+pubaddr)

	//TODO// SAVE THE PUBLICK KEY TO DEVICE STORAGE HERE

	//TODO// 
	//document.getElementById('showKey').innerHTML = "Public address: " + pubaddr;
	return key
}

function makeAndShowKey() {
	key = makeKey()

	//TODO// DISPLAY PUBLIC KEY FOR USER TO SCAN WITH THEIR ONLINE DEVICE
}

function getTransactionObject() {
	tx = new Bitcoin.Transaction()
	var msg = "New transaction object hex = " + tx.toHex()
	console.log(msg)
	//document.getElementById('transactionObject').innerHTML = msg
}

function getUnspentTransactionOutputs(addr) {
	//TODO// query the Chain API to get the unspent transaction output information
	// this has the "useable" version of the transaction hash
}

//function addInput(hash,index) {	
function addInput(tx_hash) {	
	// Add the input (who is paying) of the form [previous transaction hash, index of the output to use]
	inputFromBlockchain = ''
	var fixedhash = Bitcoin.convert.bytesToHex(Bitcoin.convert.hexToBytes(inputFromBlockchain).reverse());
	tx.addInput(fixedhash, 0);

	//var msg = "adding default input, tx is now "+ JSON.stringify(tx)
	var msg = "adding default input, tx is now "+ tx.toHex()
	console.log(msg)
	//document.getElementById('addInput').innerHTML = msg
}

//function addOutput(addr,satoshi) {	
function addOutput() {	
	// Add the output (who to pay to) of the form [payee's address, amount in satoshis]
	satoshiBalance = 490000;
	minerFee = 10000;
	satoshiToSend = satoshiBalance - minerFee;
	tx.addOutput("1AVZTL2StwQEA3DbcVnchVGTiNspSy239z", satoshiToSend);
	// remember to pay some back to self, rest will be the miner fee

	// var inputFromBlockchain = '97b700c17f6b253e7903566ffea01dd06d3c0de195fa918a6a175b8b327eb072'
	// console.log("input="+inputFromBlockchain)
	// var fixedtxhash = Bitcoin.bufferutils.reverse(inputFromBlockchain).toString()
	// var correctfromweb = '72b07e328b5b176a8a91fa95e10d3c6dd01da0fe6f5603793e256b7fc100b797'

	//var msg = "adding default output, tx is now "+ JSON.stringify(tx)
	var msg = "adding default output, tx is now "+ tx.toHex();
	console.log(msg);
	//document.getElementById('addOutput').innerHTML = msg
}

//function sign(index,wifprivkey) {	
function sign() {	

	// do this for real wallet
	//key = Bitcoin.ECKey.fromWIF(wifprivkey)

	// use hack wallet from blockchain
	//key = Bitcoin.ECKey.fromWIF("8pEWkKaxTeqwmSiBiaRETkHBYGtaCpB3RBMPQixhqQ3D");
	//key = "8pEWkKaxTeqwmSiBiaRETkHBYGtaCpB3RBMPQixhqQ3D";

	// Sign the first input with the new key
	tx.sign(0, key)
	console.log(tx.toHex())
	//document.getElementById('addOutput').innerHTML = msg
	//var msg = "signed, tx is now "+ JSON.stringify(tx)
	var msg = "signed, tx is now "+ tx.toHex()
	console.log(msg);
	//document.getElementById('sign').innerHTML = msg		
	// Print transaction serialized as hex
	// => 0100000001313eb630b128102b60241ca895f1d0ffca21 ...
}

function serializeTxToHex() {
	var txhex = tx.toHex()
	var msg = "tx as hex=" + txhex
	console.log(msg)
	//document.getElementById('serializeTxToHex').innerHTML = msg		
}