#!/bin/bash

PROJECT="obyte-devnet-witness"
CONFDIR="$HOME/Library/Application Support"
#CONFDIR="$HOME/Library/Application Support" #for macOS

if [ -d "$CONFDIR/$PROJECT" ]; then
    echo "Configuration directory already exists."
else
    echo "Creating configuration directory with default keys:"
    cp -vr "config/$PROJECT" "$CONFDIR/"
fi

echo "Fixing Obyte DAG explorer to update automatically"
sed -i -e 's/new_joint/new_my_transactions/' node_modules/obyte-explorer/explorer.js

echo "You can now run 'npm run genesis'"
