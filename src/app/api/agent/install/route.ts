import { NextResponse } from "next/server";

export async function GET(req: Request) {
 
  const { searchParams } = new URL(req.url);
  const writeKey = searchParams.get("key");

  if (!writeKey) {
    return new NextResponse("Error: Missing write_key parameter.", {
      status: 400,
    });
  }

  const host = req.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const scriptUrl = `${baseUrl}/observo-agent.sh`;
  const apiUrl = `${baseUrl}/api/v1/ingest`;

  const installerScript = `#!/bin/bash
echo "🚀 Installing Observo Agent..."

    AGENT_DIR="/opt/observo"
    AGENT_FILE="$AGENT_DIR/agent.sh"

    # Create a secure directory
    sudo mkdir -p $AGENT_DIR

    # 1. Download your script from the public folder
    echo "⬇️  Downloading agent from ${scriptUrl}..."
    sudo curl -sL "${scriptUrl}" -o $AGENT_FILE

# 2. Update the hardcoded localhost URL to the actual API URL
sudo sed -i 's|http://localhost:3000/api/v1/ingest|${apiUrl}|g' $AGENT_FILE

# 3. Make it executable
sudo chmod +x $AGENT_FILE

# 4. Set up the Cron Job to run every minute, passing the WRITE_KEY as an argument
CRON_CMD="* * * * * $AGENT_FILE ${writeKey}"
# Remove any old Observo cron jobs, then add the new one
(sudo crontab -l 2>/dev/null | grep -v "$AGENT_FILE"; echo "$CRON_CMD") | sudo crontab -

echo "✅ Observo Agent installed successfully!"
echo "📊 Your server is now reporting metrics every minute in the background."
`;

  return new NextResponse(installerScript, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
