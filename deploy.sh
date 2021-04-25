#!/bin/bash

if [ -z ${1+x} ]; then {
	echo App directory path not specified
	echo Usage: $0 APP_PATH
	exit -1
}
fi

# App directory
export APPDIR=$(cd $1; pwd)
echo Deploying app to $APPDIR

# Set working directory to script directory (repo root)
cd "$(dirname "$0")"

# Remove old code
rm -rf $APPDIR/*
# Copy latest code to app dir
cp -r backend/ $APPDIR/backend
cp -r frontend/ $APPDIR/frontend

# Make backend script executable
chmod +x $APPDIR/backend/index.js

# Patch joi path
echo Patching Joi module relative path
sed -i 's/require("Joi")/require("../node_modules/joi")/g' $APPDIR/backend/routes/auth.js

# Restart servers
echo Restarting node server...
systemctl restart team6bank_node
echo Restarting react server...
cd $APPDIR/frontend
pm2 reload all

# tree $APPDIR
