#!/bin/sh

cd /home/ubuntu
docker-compose -f docker-compose.prod.yml up --build --force-recreate -d