# GitHub Setup for Automatic APK Builds

This guide will help you set up automatic APK builds on GitHub so you can easily download your app.

## Step 1: Create a GitHub Account (if you don't have one)

1. Go to https://github.com
2. Click "Sign up"
3. Create your account with email and password
4. Verify your email

## Step 2: Create a New Repository

1. Go to https://github.com/new
2. Fill in the details:
   - **Repository name**: `uncensored-glm-mobile`
   - **Description**: GLM-4 AI Assistant Android App
   - **Public** or **Private** (your choice)
3. Click "Create repository"

## Step 3: Add Your Expo Token to GitHub Secrets

This allows GitHub to build your APK automatically.

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**
5. Fill in:
   - **Name**: `EXPO_TOKEN`
   - **Secret**: Paste your Expo token: `ri6WbAczz15-USocEbMMe1dwsmmauV6Vm2x4UCV7`
6. Click **Add secret**

## Step 4: Upload Project Files to GitHub

You have two options:

### Option A: Using Git Commands (Recommended)

```bash
# Navigate to the project folder
cd /home/ubuntu/uncensored-glm-mobile

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote set-url origin https://github.com/YOUR_USERNAME/uncensored-glm-mobile.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Option B: Upload via GitHub Web Interface

1. Go to your repository on GitHub
2. Click "Add file" → "Upload files"
3. Drag and drop all project files
4. Click "Commit changes"

## Step 5: Trigger the Build

Once files are uploaded, the build starts automatically. To check status:

1. Go to your GitHub repository
2. Click **Actions** (top menu)
3. You'll see "Build Android APK" workflow running
4. Wait for it to complete (takes 10-15 minutes)

## Step 6: Download Your APK

Once the build completes:

1. Go to **Actions** → **Build Android APK**
2. Click the latest successful build
3. Scroll down to **Artifacts**
4. Click **GLM-4-Assistant.apk** to download
5. The APK is ready to install on your phone!

## Step 7: Install on Your Phone

1. Download the APK to your phone (or transfer from computer)
2. Open your file manager
3. Go to Downloads folder
4. Tap the APK file
5. Android asks "Install this app?"
6. Tap **Install**
7. Open the app and enjoy!

## Troubleshooting

### Build fails with "EXPO_TOKEN not found"
- Make sure you added the token to GitHub Secrets (Step 3)
- Check that the name is exactly `EXPO_TOKEN` (case-sensitive)

### Build takes too long
- First build takes 15-20 minutes
- Subsequent builds are faster (5-10 minutes)

### APK download link not showing
- Wait a few more minutes for the build to complete
- Refresh the page
- Check the build logs for errors

## Updating Your App

Whenever you make changes to the code:

1. Commit and push to GitHub:
   ```bash
   git add -A
   git commit -m "Your change description"
   git push
   ```

2. The build automatically starts
3. Download the new APK from Actions

## Need Help?

- GitHub Docs: https://docs.github.com
- Expo Docs: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/eas-build/introduction/
