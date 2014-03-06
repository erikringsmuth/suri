#!/bin/bash
cd "$(dirname "$0")"
../elasticsearch/bin/elasticsearch &
node-inspector &
supervisor -w ../server.js,../server --debug ../server.js