# GitHub Actions Setup

## Workflows Configured

### 1. CI Workflow (`ci.yml`)
Runs on every push and PR to `main` and `develop` branches:
- ✅ TypeScript type checking
- ✅ Build verification
- ✅ Uploads build artifacts

### 2. Vercel Deployment (`deploy-vercel.yml`)
Automatically deploys to Vercel when code is pushed to `main`:
- 🚀 Production deployment to Vercel

## Vercel Setup Instructions

To enable automatic Vercel deployments, you need to add these secrets to your GitHub repository:

### Step 1: Get Vercel Token
1. Go to https://vercel.com/account/tokens
2. Create a new token
3. Copy the token value

### Step 2: Get Vercel Project IDs
Run these commands in your terminal after installing Vercel CLI:

```bash
npm i -g vercel
vercel login
vercel link
```

This will create a `.vercel/project.json` file with your `orgId` and `projectId`.

### Step 3: Add GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these three secrets:

1. **VERCEL_TOKEN**: The token from Step 1
2. **VERCEL_ORG_ID**: The `orgId` from `.vercel/project.json`
3. **VERCEL_PROJECT_ID**: The `projectId` from `.vercel/project.json`

### Step 4: Push to Main Branch
Once secrets are configured, any push to `main` branch will automatically deploy to Vercel!

## Branch Strategy

- **main**: Production branch - deploys to Vercel
- **develop**: Development branch - runs CI checks
- **feature branches**: Create PRs to develop/main - runs CI checks

## Manual Deployment

If you need to deploy manually:
```bash
vercel --prod
```
