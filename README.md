# Byteball Devnet Witness and Hub

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

Run the witness (when it asks for password, press enter):
```
$ npm run witness
```

## Connecting to the devnet

A devnet wallet must use the same byteball protocol as the witness in order to work. Copy the `config/constants.js` to the `node_modules/byteballcore/` overwriting the existing constants.js:

```
$ cp config/constants.js node_modules/byteballcore/constants.js
```

The devnet witness exposes a byteball hub on port 6611 to which wallets can connect to by setting the following parameters in the conf.js of the wallet:

```
exports.WS_PROTOCOL = 'ws://';
exports.hub = 'localhost:6611';
```

## Distributing bytes

The witness exposes a simplified JSON RPC endpoint on port 6612 that can be used to send bytes to any wallets:

```
$ curl --data '{"jsonrpc":"2.0", "id":1, "method":"sendtoaddress", "params":["7AAUNXYL3G5RB73TKQPCPGC6FL5RM2G6", 12345678] }' http://127.0.0.1:6612
```

## Using with docker

Building the devnet docker image:

```
$ docker build -t byteball-devnet-witness:latest .
```

Running the devnet:

```
$ docker run -it -p 6611:6611 -p 6612:6612 byteball-devnet-witness
```

## Known issues

For some reason the stable units are lagging behind by two units. So in order to make the first stable payment using the command above, 3 payment has to be sent.
