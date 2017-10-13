#!/bin/bash

PROJECT="byteball-devnet-witness"
CONFDIR="$HOME/.config"

if [ -d node_modules/byteballcore ]; then
    echo "Setting devnet constants:"
    cp -v config/constants.js node_modules/byteballcore/constants.js
else
    echo "Project is not ready yet. Run 'npm install' first!"
    exit -1
fi

if [ -d "$CONFDIR/$PROJECT" ]; then
    echo "Configuration directory already exists."
else
    echo "Creating configuration directory with default keys:"
    cp -vr config/$PROJECT $CONFDIR/
fi

BYTEBALL_CORE_VERSION=`npm view byteballcore version`
if [ "$BYTEBALL_CORE_VERSION" == "0.2.57" ]; then
    echo "Patching byteball core to support single witness:"
    patch node_modules/byteballcore/composer.js < composer.patch
else
    echo "Detected compatible byteball core v$BYTEBALL_CORE_VERSION"
fi

echo "You can now run 'npm run genesis'"