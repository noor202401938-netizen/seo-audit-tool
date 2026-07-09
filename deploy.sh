#!/bin/bash
set -e

echo "Starting SEO Auditor Deployment on AWS..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker ubuntu
    rm get-docker.sh
    echo "Docker installed successfully! Please log out and log back in, then re-run this script."
    exit 1
fi

# Ensure required .env exists
if [ ! -f .env ]; then
    echo "Creating a default .env file..."
    echo "GEMINI_API_KEY=YOUR_API_KEY_HERE" > .env
    echo "Please edit the .env file with your actual API key, then run this script again."
    exit 1
fi

echo "Building and starting Docker containers..."
sudo docker compose up -d --build

echo "Deployment complete! Your app is now running on port 80."
