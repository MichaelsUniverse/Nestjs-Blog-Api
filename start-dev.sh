#!/bin/bash

cleanup() {
  echo "App stopped, removing Database"
  npm run db:dev:down
}

trap cleanup SIGINT

npm run start:dev

cleanup
