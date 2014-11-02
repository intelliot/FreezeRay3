var wifprivkey;
var pubaddr;

function makeKey() {
	key = Bitcoin.ECKey.makeRandom()
	console.log("key="+key)

	// Print your private key (in WIF format)
	wifprivkey = key.toWIF();
	this.toWIF = wifprivkey;

	//TODO// ENCRYPT THE KEY AND SAVE TO DEVICE STORAGE HERE

	// Print your public key (toString defaults to a Bitcoin address)
	pubaddr = key.pub.getAddress().toString();
	this.pub = pubaddr;

	//TODO// SAVE THE PUBLICK KEY TO DEVICE STORAGE HERE

	//TODO// 
	//document.getElementById('showKey').innerHTML = "Public address: " + pubaddr;
	this.key = key;
}

function makeAndShowKey() {
	key = makeKey()

	//TODO// DISPLAY PUBLIC KEY FOR USER TO SCAN WITH THEIR ONLINE DEVICE
}

// function buildUnsignedTransaction() {
// 	//todo
// 	//utxoObj = freezehack['unsignedTransactionDataObject']
// 	utxoJSON = '[{
//   "transaction_hash": "dd13822a44a3a7876bc397d0264d8317fc285acbfd0a5243166b038fb80450fa",
//   "output_index": 0,
//   "value": 470000,
//   "addresses": ["1LFKEBkpVFheo5QKyKVL2bvXDtvbnArWJu"],
//   "script": "OP_DUP OP_HASH160 d31f6dc3de872b56d21dd7d4a1642d726e197a20 OP_EQUALVERIFY OP_CHECKSIG",
//   "script_hex": "76a914d31f6dc3de872b56d21dd7d4a1642d726e197a2088ac",
//   "script_type": "pubkeyhash",
//   "required_signatures": 1,
//   "spent": false,
//   "confirmations": 41
// }]';

// 	utxoObj = JSON.parse(utxoJSON);

// 	transHash = utxoObj[0].transaction_hash;
// 	console.log("transaction hash is: "+transhash)
// 	alert("transaction hash is "+transhash)

// 	// return the hex encoded version of the unsigned transaction
// }

// function parseTXHashFromUTXOObject(utxoObject) {
// 	//todo
// }


function getTransactionObject() {
	tx = new Bitcoin.Transaction()
	var msg = "New transaction object hex = " + tx.toHex()
	console.log(msg)
	//document.getElementById('transactionObject').innerHTML = msg
	return tx
}

function getUnspentTransactionOutputs(addr) {
	//TODO// query the Chain API to get the unspent transaction output information
	// this has the "useable" version of the transaction hash
}

function buildSimpleTransaction() {
	console.log("Building simple trans")
	console.log("pay amount="+freezehack.payAmountMBTC)
	freezehack['payAmountSatoshi'] = freezehack.payAmountMBTC * 100000;
	console.log("pay amount satoshi="+freezehack.payAmountSatoshi)
	console.log("payToAddress="+freezehack.payToAddress)

	prevTransHash = freezehack.unsignedTransactionDataObject[0].transaction_hash;
	prevTransAmount = freezehack.unsignedTransactionDataObject[0].value;
	prevTransIndex = freezehack.unsignedTransactionDataObject[0].output_index;
	console.log("prev transaction hash is: "+prevTransHash)
	//alert("prev transaction hash is "+prevTransHash)
    minerFee = 10000

    forceAmount = prevTransAmount - minerFee
	if (freezehack.payAmountSatoshi != forceAmount) {
		console.log("Forcing pay amount to be equal to prev trans amount minus miner fee="+forceAmount)

		freezehack.payAmountSatoshi = forceAmount
	}

    freezehack['sendTransObj'] = new Bitcoin.Transaction()

    freezehack.sendTransObj.addInput(prevTransHash,prevTransIndex)

	//freezehack.sendBackAmount  = freezehack.payAmountSatoshi - prevTransAmount - minerFee
	freezehack.sendTransObj.addOutput(freezehack.payToAddress, freezehack.payAmountSatoshi);

	freezehack['sendTransHEX'] = freezehack.sendTransObj.toHex();

	console.log("unsigned tx hash="+freezehack.sendTransHEX)

	//freezehack.sendTransObj.addOutput(freezehack.pubKey, freezehack.payAmountSatoshi);

	//keyObj = Bitcoin.ECKey.fromWIF(freezehack.privKey)
	//freezehack.sendTransObj.sign(prevTransIndex,keyObj);

	//var msg = "signed, tx is now "+ freezehack.sendTransObj.toHex()
	//console.log(msg);

	return freezehack.sendTransHEX;
}

function signSimpleTransaction() {
	console.log("Signing simple transaction")
	var tmptx = new Bitcoin.Transaction()

}

//function addInput(hash,index) {	
function addInput(tx_hash) {	
	// Add the input (who is paying) of the form [previous transaction hash, index of the output to use]
	//inputFromBlockchain = ''
	//var fixedhash = Bitcoin.convert.bytesToHex(Bitcoin.convert.hexToBytes(inputFromBlockchain).reverse());
	tx.addInput(fixedhash, 0);

	//var msg = "adding default input, tx is now "+ JSON.stringify(tx)
	var msg = "adding default input, tx is now "+ tx.toHex()
	console.log(msg)
	//document.getElementById('addInput').innerHTML = msg
}

//function addOutput(addr,satoshi) {	
function addOutput() {	
	// Add the output (who to pay to) of the form [payee's address, amount in satoshis]

	minerFee = 10000;
	satoshiToSend = amount - minerFee;
	freezehack.sendTransObj.addOutput(freezehack.payToAddress, freezehack.payAmountSatoshi);
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