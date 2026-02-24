#!/bin/bash

echo "🧹 Cleaning Docker containers..."
docker container prune -f

echo "🧹 Cleaning Docker images..."
docker image prune -a -f

echo "🧹 Cleaning Docker volumes..."
docker volume prune -f

echo "🧹 Cleaning Docker networks..."
docker network prune -f

echo "🧹 Cleaning Docker build cache..."
docker builder prune -a -f

echo "🧹 Cleaning system cache..."
sudo sync && sudo sysctl -w vm.drop_caches=3

echo "📊 Disk usage after cleanup:"
df -h

echo "✅ Cleanup finished!"
