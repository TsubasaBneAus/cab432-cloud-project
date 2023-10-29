#!/bin/bash

cd /home/ubuntu/cab432-cloud-project
docker compose -f docker-compose.prod.yml up --build --force-recreate