#!/bin/bash

PROJECT="obyte-devnet-witness"
CONFDIR="$HOME/.config"

if [ -d node_modules/ocore ]; then
    echo "Setting devnet constants:"
    cp -v config/constants.js node_modules/ocore/constants.js
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

echo "Fixing Obyte DAG explorer to update automatically"
sed -i -e 's/new_joint/new_my_transactions/' node_modules/obyte-explorer/explorer.js

echo "You can now run 'npm run genesis'"
