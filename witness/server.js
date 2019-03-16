"use strict";
require("ocore/wallet.js");
const witness = require('obyte-witness');
const explorer = require('obyte-explorer/explorer.js');
const headlessWallet = require('headless-obyte');
const eventBus = require('ocore/event_bus.js');
const validationUtils = require("ocore/validation_utils.js");
const conf = require('ocore/conf.js');
const constants = require('ocore/constants.js');

function initRPC() {
	var rpc = require('json-rpc2');

	var server = rpc.Server.$create({
		'websocket': true, // is true by default 
		'headers': { // allow custom headers is empty by default 
			'Access-Control-Allow-Origin': '*'
		}
	});

	/**
	 * Send funds to address.
	 * If address is invalid, then returns "invalid address".
	 * @param {String} address
	 * @param {Integer} amount
	 * @return {String} status
	 */
	server.expose('sendtoaddress', function(args, opt, cb) {
		var amount = args[1];
		var toAddress = args[0];
		if (amount && toAddress) {
			if (validationUtils.isValidAddress(toAddress))
				headlessWallet.issueChangeAddressAndSendPayment(null, amount, toAddress, null, function(err, unit) {
					cb(err, err ? undefined : unit);
				});
			else
				cb("invalid address");
		}
		else
			cb("wrong parameters");
	});

	/**
	 * Send blackbytes to address.
	 * If address is invalid, then returns "invalid address".
	 * @param {String} device
	 * @param {String} address
	 * @param {Integer} amount
	 * @return {String} status
	 */
	server.expose('sendblackbytestoaddress', function(args, opt, cb) {
		if (args.length != 3) {
			return cb("wrong parameters");
		}

		let device = args[0];
		let toAddress = args[1];
		let amount = args[2];

		if (!validationUtils.isValidDeviceAddress(device)) {
			return cb("invalid device address");
		}

		if (!validationUtils.isValidAddress(toAddress)) {
			return cb("invalid address");
		}

		headlessWallet.readSingleAddress(function(fromAddress) {
			createIndivisibleAssetPayment(constants.BLACKBYTES_ASSET, amount, fromAddress, toAddress, device, function(err, unit) {
				cb(err, err ? undefined : unit);
			});
		});
	});

	server.listen(conf.rpcPort, conf.rpcInterface);
}

function createIndivisibleAssetPayment(asset, amount, fromAddress, toAddress, toDevice, callback) {
	var network = require('ocore/network.js');
	var indivisibleAsset = require('ocore/indivisible_asset.js');
	var walletGeneral = require('ocore/wallet_general.js');

	indivisibleAsset.composeAndSaveIndivisibleAssetPaymentJoint({
		asset: asset,
		paying_addresses: [fromAddress],
		fee_paying_addresses: [fromAddress],
		change_address: fromAddress,
		to_address: toAddress,
		amount: amount,
		tolerance_plus: 0,
		tolerance_minus: 0,
		signer: headlessWallet.signer,
		callbacks: {
			ifNotEnoughFunds: callback,
			ifError: callback,
			ifOk: function(objJoint, arrChains) {
				network.broadcastJoint(objJoint);
				if (arrChains) { // if the asset is private
					walletGeneral.sendPrivatePayments(toDevice, arrChains);
				}
				callback(null, objJoint.unit.unit);
			}
		}
	});
}

function postTimestamp(address) {
	var composer = require('ocore/composer.js');
	var network = require('ocore/network.js');
	var callbacks = composer.getSavingCallbacks({
		ifNotEnoughFunds: function(err) {
			console.error(err);
		},
		ifError: function(err) {
			console.error(err);
		},
		ifOk: function(objJoint) {
			network.broadcastJoint(objJoint);
		}
	});

	var datafeed = {
		time: new Date().toString(),
		timestamp: Date.now()
	};
	composer.composeDataFeedJoint(address, datafeed, headlessWallet.signer, callbacks);
}

eventBus.once('headless_wallet_ready', function() {
	initRPC();
	headlessWallet.readSingleAddress(function(address) {
		setInterval(postTimestamp, conf.TIMESTAMPING_INTERVAL, address);
	});
});

eventBus.on('paired', function(from_address) {
    console.log('Sucessfully paired with:' + from_address);
    const device = require('ocore/device.js');
    device.sendMessageToDevice(from_address, "text", "Welcome to devnet Witness!");
});
