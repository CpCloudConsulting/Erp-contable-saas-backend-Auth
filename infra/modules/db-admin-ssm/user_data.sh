#!/bin/bash

set -e

echo "========================================="
echo "BeautySuite DB Admin initialization"
echo "========================================="

dnf update -y

echo "Installing PostgreSQL 17 client..."

dnf install -y postgresql17

echo "PostgreSQL client version:"

psql --version

echo "Checking SSM Agent..."

systemctl enable amazon-ssm-agent
systemctl start amazon-ssm-agent

echo "========================================="
echo "BeautySuite DB Admin ready"
echo "========================================="