#!/bin/bash

# [bash] server.sh [dev|build]
# Should be in root directory

function print_usage () {
    echo "Usage:"
    echo "server.sh [dev|build|down|help]"
}

function start_or_restart_docker () {
    docker-compose restart || docker-compose up -d
}

# MAIN
if [[ $1 = dev || $1 = build ]]; then
    start_or_restart_docker
    cd ./frontend
    if [[ $1 = dev ]]; then
        npm run serve --fix
    else
        npm run build --fix
    fi
elif [[ $1 = down ]]; then
    docker-compose down -v
elif [[ $1 = help ]]; then
    print_usage
else
    print_usage
    exit 1
fi
