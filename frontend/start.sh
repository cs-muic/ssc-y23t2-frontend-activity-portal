#!/bin/bash

docker context use default
docker build -t jorntumrongwit/activity-portal-frontend .
docker push jorntumrongwit/activity-portal-frontend
docker context use remote-activity-portal
docker rm -f frontend
docker image rm jorntumrongwit/activity-portal-frontend
docker pull jorntumrongwit/activity-portal-frontend
docker-compose up --force-recreate -d