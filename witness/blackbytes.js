"use strict";
const headlessWallet = require('headless-obyte');
const eventBus = require('ocore/event_bus.js');

function onError(err){
	throw Error(err);
}

function createBlackbytes(address, onDone){
	var composer = require('ocore/composer.js');
	var network = require('ocore/network.js');

	var callbacks = composer.getSavingCallbacks({
		ifNotEnoughFunds: onError,
		ifError: onError,
		ifOk: function(objJoint){
			network.broadcastJoint(objJoint);
			onDone(objJoint.unit.unit);
		}
	});
	var asset = {
		cap: (1+2*2+5+10+20*2+50+100+200*2+500+1000+2000*2+5000+10000+20000*2+50000+100000)*1e10,
		is_private: true,
		is_transferrable: true,
		auto_destroy: false,
		fixed_denominations: true,
		issued_by_definer_only: true,
		cosigned_by_definer: false,
		spender_attested: false,
		denominations: [
			{denomination: 1, count_coins: 1e10},
			{denomination: 2, count_coins: 2e10},
			{denomination: 5, count_coins: 1e10},
			{denomination: 10, count_coins: 1e10},
			{denomination: 20, count_coins: 2e10},
			{denomination: 50, count_coins: 1e10},
			{denomination: 100, count_coins: 1e10},
			{denomination: 200, count_coins: 2e10},
			{denomination: 500, count_coins: 1e10},
			{denomination: 1000, count_coins: 1e10},
			{denomination: 2000, count_coins: 2e10},
			{denomination: 5000, count_coins: 1e10},
			{denomination: 10000, count_coins: 1e10},
			{denomination: 20000, count_coins: 2e10},
			{denomination: 50000, count_coins: 1e10},
			{denomination: 100000, count_coins: 1e10}
		]
	};
	composer.composeAssetDefinitionJoint(address, asset, headlessWallet.signer, callbacks);
}

eventBus.once('headless_wallet_ready', function() {
    headlessWallet.readSingleAddress(function(address) {
        createBlackbytes(address, function(assetHash) {
            console.log("Blackbytes asset created: " + assetHash);
            process.exit(0);
        });
    });
});
