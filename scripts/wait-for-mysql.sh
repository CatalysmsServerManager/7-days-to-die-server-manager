#!/bin/bash

echo "Waiting for mysql"
until mysql -h"$MYSQL_HOST" -P"$MYSQL_PORT" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" $MYSQL_DATABASE
do
  printf "."
  sleep 1
done

echo "mysql ready"