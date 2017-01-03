#!/bin/bash

cd "$1"
user="$2"
set -v

# Apt Repositories
cat > /etc/apt/sources.list.d/nodesource.list <<< 'deb https://deb.nodesource.com/node_7.x xenial main'
wget -qO - https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add -
apt-get update

# Packages
apt-get install -y nodejs build-essential

# TODO etc. etc.
