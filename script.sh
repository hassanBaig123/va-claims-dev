#!/bin/bash

# Save the current directory
current_dir=$(pwd)

# Change to the script's directory
cd "$(dirname "$0")"

aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 504947529581.dkr.ecr.us-west-2.amazonaws.com

# Check if docker-compose.yml exists in the current directory
if [ -f docker-compose.yml ]; then
  # Run `docker-compose down` to stop containers
#   docker-compose down

  # Run `docker-compose up` to start containers in the background
  docker-compose up -d
  sleep 2
  docker image prune -af

else
  echo "docker-compose.yml not found in the current directory"
fi

# Change back to the original directory
cd "$current_dir"