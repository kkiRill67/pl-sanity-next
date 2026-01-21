# SSH Setup Guide for Deployment

This guide explains how to set up SSH access for automated deployment.

## Prerequisites

- SSH access to your server
- Server IP address or domain name
- SSH key pair (or generate one)

---

## Step 1: Generate SSH Key Pair

### On Your Local Machine

```bash
# Generate SSH key (Ed25519 recommended)
ssh-keygen -t ed25519 -C "deploy@your-server" -f ~/.ssh/deploy_key

# Or use RSA (if Ed25519 is not supported)
ssh-keygen -t rsa -b 4096 -C "deploy@your-server" -f ~/.ssh/deploy_key
```

**Important**: Do NOT add a passphrase if you want automated deployment.

---

## Step 2: Add Public Key to Server

### Option A: Using ssh-copy-id (Recommended)

```bash
# Copy public key to server
ssh-copy-id -i ~/.ssh/deploy_key.pub username@your-server-ip

# Test connection
ssh -i ~/.ssh/deploy_key username@your-server-ip
```

### Option B: Manual Setup

1. **Copy the public key content**:
   ```bash
   cat ~/.ssh/deploy_key.pub
   ```

2. **SSH into your server** (using password or existing key):
   ```bash
   ssh username@your-server-ip
   ```

3. **Add the public key to authorized_keys**:
   ```bash
   # Create .ssh directory if it doesn't exist
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh

   # Add public key
   echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys

   # Set permissions
   chmod 600 ~/.ssh/authorized_keys
   ```

4. **Test connection** (from your local machine):
   ```bash
   ssh -i ~/.ssh/deploy_key username@your-server-ip
   ```

---

## Step 3: Secure SSH Access (Recommended)

### Disable Password Authentication

On your server:

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Find and set these values:
PasswordAuthentication no
PermitRootLogin no
PubkeyAuthentication yes

# Restart SSH
sudo systemctl restart ssh
```

### Setup SSH Key with Passphrase (More Secure)

If you want to use a passphrase:

1. **Generate key with passphrase**:
   ```bash
   ssh-keygen -t ed25519 -C "deploy@your-server" -f ~/.ssh/deploy_key
   ```

2. **Start SSH agent**:
   ```bash
   eval "$(ssh-agent -s)"
   ```

3. **Add key to agent**:
   ```bash
   ssh-add ~/.ssh/deploy_key
   ```

4. **For GitHub Actions**, you'll need to use `ssh-agent` action in workflow.

---

## Step 4: Setup GitHub Secrets

### Required Secrets for Deployment

Go to your GitHub repository → Settings → Secrets and variables → Actions:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `SSH_HOST` | Your server IP or domain | e.g., `192.168.1.100` or `your-domain.com` |
| `SSH_USER` | SSH username | e.g., `root`, `ubuntu`, `deploy` |
| `SSH_PRIVATE_KEY` | Private key content | `cat ~/.ssh/deploy_key` |
| `DEPLOY_PATH` | Deployment directory | e.g., `/var/www/app` or `/home/deploy/app` |

### How to Get Each Secret

#### 1. SSH_HOST
```bash
# Your server IP
echo $SSH_HOST  # e.g., 192.168.1.100

# Or domain name
echo $SSH_HOST  # e.g., your-domain.com
```

#### 2. SSH_USER
```bash
# Your SSH username
echo $SSH_USER  # e.g., root, ubuntu, deploy
```

#### 3. SSH_PRIVATE_KEY
```bash
# Copy the entire private key
cat ~/.ssh/deploy_key
```

**Important**: Copy the ENTIRE key including:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

#### 4. DEPLOY_PATH
```bash
# Directory where your app will be deployed
echo $DEPLOY_PATH  # e.g., /var/www/app or /home/deploy/app
```

---

## Step 5: Add Secrets to GitHub

### Via Web Interface

1. Go to your GitHub repository
2. Click **Settings** (top right)
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret:

```
Secret name: SSH_HOST
Secret value: 192.168.1.100
```

Repeat for all secrets.

### Via GitHub CLI

```bash
# Install GitHub CLI
# https://cli.github.com/

# Set secrets
gh secret set SSH_HOST --body "192.168.1.100"
gh secret set SSH_USER --body "ubuntu"
gh secret set SSH_PRIVATE_KEY --body "$(cat ~/.ssh/deploy_key)"
gh secret set DEPLOY_PATH --body "/var/www/app"
```

---

## Step 6: Test SSH Connection

### Manual Test

```bash
# Test connection
ssh -i ~/.ssh/deploy_key username@your-server-ip

# Test with specific port
ssh -i ~/.ssh/deploy_key -p 22 username@your-server-ip

# Test command execution
ssh -i ~/.ssh/deploy_key username@your-server-ip "echo 'SSH OK'"
```

### Test from GitHub Actions

1. Go to **Actions** tab
2. Select your deployment workflow
3. Click **Run workflow**
4. Check the logs for SSH connection test

---

## Step 7: Setup Deployment Directory on Server

### Create Deployment Directory

SSH into your server:

```bash
# Create deployment directory
sudo mkdir -p /var/www/app

# Set ownership (replace with your username)
sudo chown -R username:username /var/www/app

# Set permissions
sudo chmod -R 755 /var/www/app
```

### Alternative: User Home Directory

```bash
# Create in user home
mkdir -p ~/app

# No need to change ownership
```

---

## Troubleshooting

### Error: "Permission denied (publickey)"

**Solution**:
1. Check if public key is in `~/.ssh/authorized_keys` on server
2. Check permissions:
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```
3. Check SSH config: `PasswordAuthentication yes` (temporarily)

### Error: "Could not resolve hostname"

**Solution**:
1. Check if domain name is correct
2. Check if server IP is correct
3. Test DNS resolution: `ping your-domain.com`

### Error: "Connection refused"

**Solution**:
1. Check if SSH is running: `sudo systemctl status ssh`
2. Check firewall: `sudo ufw status`
3. Check SSH port: `sudo netstat -tulpn | grep :22`

### Error: "Host key verification failed"

**Solution**:
1. Remove old host key:
   ```bash
   ssh-keygen -R your-server-ip
   ```
2. Connect again and accept new key

### Error: "Private key is not valid"

**Solution**:
1. Check if private key is complete
2. Check line endings (should be LF, not CRLF)
3. Check permissions: `chmod 600 ~/.ssh/deploy_key`

---

## Security Best Practices

### 1. Use Dedicated Deployment User

Create a separate user for deployment:

```bash
# On server
sudo adduser deploy
sudo usermod -aG sudo deploy

# Setup SSH key for deploy user
sudo mkdir -p /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

### 2. Restrict SSH Access

Edit `/etc/ssh/sshd_config`:

```bash
# Allow only specific users
AllowUsers deploy ubuntu

# Disable root login
PermitRootLogin no

# Disable password authentication
PasswordAuthentication no
```

### 3. Use SSH Port Forwarding (Optional)

For extra security, use a non-standard SSH port:

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config
# Change Port to something like 2222

# Update firewall
sudo ufw delete allow 22/tcp
sudo ufw allow 2222/tcp
sudo ufw reload

# Update GitHub secret
SSH_HOST=your-domain.com:2222
```

### 4. Setup Fail2Ban

```bash
# Install fail2ban
sudo apt-get install -y fail2ban

# Enable and start
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 5. Monitor SSH Access

```bash
# View SSH logs
sudo tail -f /var/log/auth.log

# View failed attempts
sudo grep "Failed password" /var/log/auth.log
```

---

## Advanced: SSH Config File

Create `~/.ssh/config` on your local machine:

```bash
# ~/.ssh/config
Host my-server
    HostName 192.168.1.100
    User ubuntu
    IdentityFile ~/.ssh/deploy_key
    Port 22
```

Then you can connect with:
```bash
ssh my-server
```

---

## GitHub Actions Workflow Example

### Basic Deployment Workflow

```yaml
name: Deploy to Server

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH
        uses: webfactory/ssh-agent@v0.8.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

      - name: Deploy to server
        run: |
          ssh -o StrictHostKeyChecking=no ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} "
            cd ${{ secrets.DEPLOY_PATH }} &&
            git pull origin main &&
            cd frontend &&
            npm install &&
            npm run build &&
            pm2 restart nextjs-frontend
          "
```

### Docker Deployment Workflow

See `.github/workflows/deploy.yml` in your repository.

---

## Common Commands

### Test SSH Connection

```bash
# Basic test
ssh -i ~/.ssh/deploy_key username@server-ip

# With command
ssh -i ~/.ssh/deploy_key username@server-ip "echo 'SSH OK'"

# With port
ssh -i ~/.ssh/deploy_key -p 22 username@server-ip
```

### Copy Files via SSH

```bash
# Copy file to server
scp -i ~/.ssh/deploy_key file.txt username@server-ip:/path/to/destination/

# Copy directory recursively
scp -i ~/.ssh/deploy_key -r directory/ username@server-ip:/path/to/destination/
```

### Execute Remote Commands

```bash
# Single command
ssh -i ~/.ssh/deploy_key username@server-ip "ls -la"

# Multiple commands
ssh -i ~/.ssh/deploy_key username@server-ip "
  cd /var/www/app &&
  git pull &&
  npm install
"
```

---

## Resources

- [SSH Documentation](https://www.ssh.com/academy/ssh)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OpenSSH Best Practices](https://www.openssh.com/)

---

## Summary

### Quick Setup Checklist

- [ ] Generate SSH key pair
- [ ] Add public key to server
- [ ] Test SSH connection
- [ ] Create deployment directory
- [ ] Add secrets to GitHub
- [ ] Test GitHub Actions workflow
- [ ] Setup SSL certificate
- [ ] Monitor deployment

### Required Secrets

```
SSH_HOST=your-server-ip-or-domain
SSH_USER=your-username
SSH_PRIVATE_KEY=your-private-key
DEPLOY_PATH=/path/to/deployment
SANITY_API_READ_TOKEN=your-token
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-project.sanity.studio
```

---

**Last Updated**: January 2026
**Version**: 1.0
