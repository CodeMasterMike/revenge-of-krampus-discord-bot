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
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
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
PUBLIC_KEY=your_public_key
```

## 6. Set up pm2

Install pm2 globally:

```bash
sudo npm install -g pm2
```

Start the bot:

```bash
cd ~/revenge-of-krampus
pm2 start bot.js --name krampus-bot
```

Set up pm2 to start on boot:

```bash
pm2 startup
pm2 save
```

## 7. Useful commands

```bash
pm2 status                  # Check status
pm2 logs krampus-bot        # Tail logs
pm2 restart krampus-bot     # Restart after changes
pm2 stop krampus-bot        # Stop the bot
pm2 delete krampus-bot      # Remove from pm2
```

## 8. Deploying updates

### Manual

```bash
cd ~/revenge-of-krampus
git pull
npm install
pm2 restart krampus-bot
```

### Automatic (GitHub Actions)

A GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys on every push to `main`. It SSHs into the VM and runs the deploy commands above.

**Setup — add these secrets in your GitHub repo (Settings > Secrets and variables > Actions):**

- `VM_HOST` — the VM's public IP address
- `VM_USER` — your SSH username (e.g. `mmcalpin`)
- `VM_SSH_KEY` — a private SSH key authorized on the VM

**To generate a deploy key on the VM:**

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy -N ""
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy   # copy this as the VM_SSH_KEY secret value
```
