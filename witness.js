"use strict";
const witness = require('byteball-witness');
const headlessWallet = require('headless-byteball');
const eventBus = require('byteballcore/event_bus.js');
const validationUtils = require("byteballcore/validation_utils.js");
const conf = require('byteballcore/conf.js');

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

	server.listen(conf.rpcPort, conf.rpcInterface);
}

eventBus.once('headless_wallet_ready', function() {
    initRPC();
});
