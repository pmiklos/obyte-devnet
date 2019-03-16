# Obyte Devnet Witness and Hub

This project provides a lightweight disposable obyte network that can be used on demand for developement. It generates a new DAG from scratch with a simplified protocol for your own use. Benefits of using the devnet compared to testnet are:
* no wait times for sychronizing the network to the latest state
* minimal storage requirement since you don't have to download the whole testnet dag which is already several gigabytes
* you can create as many devnet DAGs you want, for example one for each project
* you can use it for integration testing
* very fast, configurable confirmation times

Of course using the testnet has its benefits as well since that is accessible to anyone and so perfect for beta-testing.

The devnet protocol is simplified to a single witness which runs multiple serives:
* exposes a JSON-RPC wallet endpoint for easy coin distribution
* exposes a DAG explorer to visualise and browse the network
* timestamp oracle for time-bound smart contracts

## Creating the devnet
Start with installing the dependencies:
```
$ npm install
```

Initialize devnet configuration and network protocol:
```
$ npm run init
```

Create the geneis unit (when it asks for password, press enter):
```
$ npm run genesis
```

Define blackbytes asset (when it asks for password, press enter):
```
$ npm run blackbytes
```

Start the hub
```
$ npm run hub
```

Start the witness (when it asks for password, press enter):
```
$ npm run witness
```

## Connecting to the devnet

A devnet wallet must use the same obyte protocol as the witness in order to work. The recommended way to set up devnet is to use the [obyte-devnet-config](../../../obyte-devnet-config). Alternatively, you can copy the `config/constants.js` to the `node_modules/ocore/` overwriting the existing constants.js:

```
$ cp config/constants.js node_modules/ocore/constants.js
```

The devnet hub runs on port 6611 to which wallets can connect to by setting the following parameters in the conf.js of the wallet:

```
exports.WS_PROTOCOL = 'ws://';
exports.hub = 'localhost:6611';
```

## Distributing bytes and blackbytes

The witness exposes a simplified JSON RPC endpoint on port 6612 that can be used to send bytes and blackbytes to any wallets.

In order to send blackbytes, the receiving wallet has to be paired with the witness first. The pairing code by default is `AtbXPcYt2i4PwNAuf9awIYWx3aGZQb2DlUBc8wm1UhTl@localhost:6611#0000`. Note that before transferring blackbytes the blackbytes asset definition has to become stable. Since the timestamp oracle posts every minute, it becomes stable in about two minutes. Alternatively sending two byte transactions from the witness wallet also confirms the blackbytes definition.

### RPC sendtoaddress
Parameters:
* `{String} address`- receving wallet address
* `{Integer} amount` - amount in bytes

Example:
```
$ curl --data '{"jsonrpc":"2.0", "id":1, "method":"sendtoaddress", "params":["7AAUNXYL3G5RB73TKQPCPGC6FL5RM2G6", 12345678] }' http://127.0.0.1:6612
```

### RPC sendblackbytestoaddress
Parameters:
* `{String} device`- the address of the receving device
* `{String} address`- receving wallet address
* `{Integer} amount` - amount in bytes

Example:
```
$ curl --data '{"jsonrpc":"2.0", "id":1, "method":"sendblackbytestoaddress", "params": ["0BN2NOKBEBZNQPKSVUZZBWAM4NF5JLQCT", "ILVKZNLAL3OEUXX4QBNDNFNRVLBZTTXO", 35000] }' http://127.0.0.1:6612
```

## Using with docker

Building the devnet docker image:

```
$ docker build -t obyte-devnet:latest .
```

Running the devnet:

```
$ docker run -it -p 6611:6611 -p 6612:6612 -p 8080:8080 obyte-devnet
```

## Timestamp Oracle

The witness also acts as a timestamp oracle posting every minute by default. The Oracle's address is the same as the witness' address which is by default `ZQFHJXFWT2OCEBXF26GFXJU4MPASWPJT`. The timestamping interval can be controlled by the TIMESTAMPING_INTERVAL configuration parameter either in `conf.js` or in `~/.config/obyte-devnet-witness/conf.json`.

## DAG Explorer

The witness runs a DAG explorer as well which is exposed on port 8080 and so can be access at [http://localhost:8080](http://localhost:8080).

## Known issues

For some reason the stable units are lagging behind by two units. So in order to make the first stable payment using the command above, 3 payment has to be sent.