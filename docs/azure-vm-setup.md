# Azure VM Setup

Deploy the Discord bot on an Azure VM.

## 1. Create the VM

In the [Azure Portal](https://portal.azure.com), create a Virtual Machine:

- **Resource group:** `krampus-bot-rg`
- **VM name:** `krampus-bot-vm`
- **Region:** East US (or East US 2)
- **Image:** Ubuntu Server 24.04 LTS
- **Size:** B1s (or B1s v2 / B2ats_v2 if unavailable)
- **Authentication:** SSH public key
- **Inbound ports:** Allow SSH (22) only

No other inbound ports are needed — the bot uses outbound WebSocket connections.

## 2. Connect to the VM

```bash
ssh <your-user>@<vm-public-ip>
```

## 3. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git
```

## 4. Clone and install

```bash
git clone <your-repo-url> ~/revenge-of-krampus
cd ~/revenge-of-krampus
npm install
```

## 5. Create the .env file

```bash
nano ~/revenge-of-krampus/.env
```

```
APP_ID=your_app_id
DISCORD_TOKEN=your_bot_token
```

## 6. Set up systemd service

Create the service file:

```bash
sudo nano /etc/systemd/system/krampus-bot.service
```

```ini
[Unit]
Description=Revenge of Krampus Discord Bot
After=network.target

[Service]
Type=simple
User=<your-user>
WorkingDirectory=/home/<your-user>/revenge-of-krampus
ExecStart=/usr/bin/node bot.js
Restart=on-failure
RestartSec=5
EnvironmentFile=/home/<your-user>/revenge-of-krampus/.env

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable krampus-bot
sudo systemctl start krampus-bot
```

## 7. Useful commands

```bash
sudo systemctl status krampus-bot     # Check status
sudo journalctl -u krampus-bot -f     # Tail logs
sudo systemctl restart krampus-bot    # Restart after changes
```

## 8. Deploying updates

```bash
cd ~/revenge-of-krampus
git pull
npm install
sudo systemctl restart krampus-bot
```
