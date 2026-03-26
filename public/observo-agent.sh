#!/bin/bash

# ==========================================
# Observo Server Monitoring Agent
# ==========================================

# 1. Configuration (Replace with your actual details)
WRITE_KEY=$1
if [ -z "$WRITE_KEY" ]; then
  echo "Error: Missing Write Key."
  echo "Usage: ./observo-agent.sh <YOUR_WRITE_KEY>"
  exit 1
fi

INGEST_URL="https://observo-xi.vercel.app//api/v1/ingest"
SERVER_NAME=$(hostname)



CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')

# Get Memory usage percentage
MEMORY_USAGE=$(free -m | awk 'NR==2{printf "%.2f", $3*100/$2 }')

# Get Disk usage percentage for the root partition (/)
DISK_USAGE=$(df -h / | awk '$NF=="/"{printf "%s", $5}' | tr -d '%')

# Get Server Uptime string
UPTIME=$(uptime -p)
OS =$(uname)

# 3. Construct the JSON Payload
# Notice how this matches your ingestionSchema perfectly!
PAYLOAD=$(cat <<EOF
{
  "type": "server_metrics",
  "server_name": "$SERVER_NAME",  
  "write_key": "$WRITE_KEY",
  "payload": {
    "cpu_percent": $CPU_USAGE,
    "memory_percent": $MEMORY_USAGE,
    "disk_percent": $DISK_USAGE,
    "uptime": "$UPTIME",
    "operatingSystem":"$OS",

  }
}
EOF
)

# 4. Fire it off to your API
curl -s -X POST "$INGEST_URL" \
     -H "Content-Type: application/json" \
     -d "$PAYLOAD"

echo "Observo: Sent server metrics successfully. (CPU: $CPU_USAGE%, RAM: $MEMORY_USAGE%)"