# GitHub Actions Deployment to VDS

This repository includes a GitHub Actions workflow that builds the project and deploys it to a Virtual Dedicated Server (VDS) via SSH and `rsync`.

## Workflow Overview (`.github/workflows/deploy.yml`)

1. **Trigger**  
   - Runs on pushes to the `main` branch.  
   - Can also be started manually via **Workflow Dispatch**.

2. **Jobs**  
- **Checkout** the repository.  
- **Set up Node.js** (default version `20`).  
- **Install dependencies** using `npm ci`.  
- **Build** Docker image locally
- **Deploy** the Docker image to the VDS via SSH, pulling and running the container.

## Required Secrets

Add the following repository secrets (Settings → Secrets → Actions):

| Secret | Description |
|--------|-------------|
| `SSH_HOST` | Hostname or IP address of your VDS. |
| `SSH_USER` | SSH username for the VDS. |
| `SSH_PRIVATE_KEY` | Private SSH key (PEM format) with access to the VDS. |
| `DEPLOY_PATH` | Absolute path on the VDS where the app should be deployed (e.g., `/var/www/bodymetrics`). |

> **Important:** The private key must **not** have a passphrase, or you must configure the workflow to handle it.

## How It Works

- The workflow writes the provided private key to a temporary file (`/tmp/deploy_key`) and sets restrictive permissions.
- After building the Docker image locally and syncing the source code to the VDS, the deploy step SSHes into the VDS, builds the Docker image there, and runs a new container exposing port 3000.
- No additional remote commands are needed; the Docker container runs the application.

## Customization

- **Node version:** Change `node-version` in the workflow if you need a different version.
- **Build script:** Adjust `npm run build` if your project uses a different command.
- **Process manager:** Replace the PM2 commands with your preferred manager (e.g., `systemctl`, `docker`, etc.).
- **Additional steps:** Add linting, tests, or notifications as needed.

## Security Considerations

- The workflow disables strict host key checking (`-o StrictHostKeyChecking=no`). For production use, consider adding the server’s host key to known hosts instead.
- The temporary private key file is removed after deployment (`rm -f /tmp/deploy_key`).

---

Once the secrets are configured, any push to `main` will automatically deploy the latest build to your VDS. You can also trigger the workflow manually from the **Actions** tab.
