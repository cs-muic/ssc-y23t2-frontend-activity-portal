#!/bin/bash

docker context use default
docker build -t jorntumrongwit/activity-portal-frontend .
docker push jorntumrongwit/activity-portal-frontend .
docker context use remote-activity-portal
docker pull jorntumrongwit/activity-portal-frontend
docker rm -f frontend
docker-compose up -d