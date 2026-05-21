# GLM-4 Assistant App - Build & Deployment Instructions

This document provides step-by-step instructions for building and deploying the GLM-4 AI Assistant mobile app on Android.

## Prerequisites

Before building, ensure you have:

1. **Expo Account** - Sign up at [expo.dev](https://expo.dev)
2. **EAS CLI** - Install globally:
   ```bash
   npm install -g eas-cli
   ```
3. **Node.js 18+** - Required for building
4. **Android Device or Emulator** - For testing
5. **GLM-4 API Key** - Get from [open.bigmodel.cn](https://open.bigmodel.cn)

## Development Setup

### 1. Install Dependencies

```bash
cd /home/ubuntu/uncensored-glm-mobile
pnpm install
```

### 2. Configure Environment

Create a `.env` file in the project root (optional):

```env
# API Configuration
EXPO_PUBLIC_GLM_API_ENDPOINT=https://open.bigmodel.cn/api/paas/v4/chat/completions
```

### 3. Run Development Server

```bash
pnpm dev
```

This starts both the Metro bundler and the backend server. You should see output like:

```
Metro Bundler started at http://localhost:8081
API Server running at http://localhost:3000
```

### 4. Test in Expo Go (Mobile)

**On Android:**
1. Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Google Play
2. Open Expo Go app
3. Scan the QR code displayed in the terminal
4. App will load in Expo Go

**Note:** Volume button functionality is limited in Expo Go. For full functionality, create a dev build (see below).

## Building for Android

### Option 1: Development Build (Recommended for Testing)

A development build includes the volume button listener and other native modules.

```bash
eas build --platform android --profile preview
```

This will:
1. Build the app with development settings
2. Include the volume button listener module
3. Generate an APK file
4. Provide a download link

**Installation:**
```bash
# Download the APK from the provided link, then:
adb install path/to/app.apk
```

### Option 2: Production Build

For distribution on Google Play Store:

```bash
eas build --platform android --profile production
```

This creates an optimized, signed APK ready for submission.

### Option 3: Local Build (Advanced)

If you prefer to build locally without EAS:

```bash
# Generate native Android project
npx expo prebuild --clean

# Build with Gradle
cd android
./gradlew assembleRelease
cd ..

# APK will be at: android/app/build/outputs/apk/release/app-release.apk
```

## Configuration

### API Key Setup

The app requires a GLM-4 API key to function. Users can configure this in the app:

1. Open the app
2. Go to **Settings** tab
3. Enter your GLM-4 API key from [open.bigmodel.cn](https://open.bigmodel.cn)
4. Enter the API endpoint (default is usually correct)
5. Tap **Save Settings**

**Getting an API Key:**
1. Visit [open.bigmodel.cn](https://open.bigmodel.cn)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into the app settings

### Volume Button Setup

The volume button triple-press trigger requires native Android integration. See `VOLUME_BUTTON_SETUP.md` for detailed setup instructions.

**Quick Setup for Dev Build:**
1. The dev build includes the volume button listener module
2. When you triple-press volume down, the app will come to foreground
3. The chat screen will open with keyboard ready

## Testing

### Unit Tests

```bash
pnpm test
```

### Manual Testing Checklist

- [ ] App launches without errors
- [ ] Chat screen displays correctly
- [ ] Settings screen loads
- [ ] API key can be entered and saved
- [ ] Messages can be sent and received
- [ ] Error messages display properly
- [ ] Clear history button works
- [ ] Volume button triple-press opens app (dev build only)

## Troubleshooting

### Build Fails with Module Error

**Problem:** `Module not found: volume-button-listener`

**Solution:**
```bash
# Ensure the module is properly linked
cd modules/volume-button-listener
npm install
cd ../..

# Rebuild
eas build --platform android --profile preview --clean
```

### API Key Not Working

**Problem:** "API request failed" error when sending messages

**Solution:**
1. Verify your API key is correct on [open.bigmodel.cn](https://open.bigmodel.cn)
2. Check that your account has available API credits
3. Ensure the API endpoint URL is correct
4. Try re-entering the API key in settings

### Volume Button Not Working

**Problem:** Triple-pressing volume down doesn't open the app

**Solution:**
1. Ensure you're using a dev build (not Expo Go)
2. Check that the app has the necessary permissions
3. Verify the MainActivity override is in place (see `VOLUME_BUTTON_SETUP.md`)
4. Check Android logs: `adb logcat | grep "VolumeButton"`

### App Crashes on Startup

**Problem:** App crashes immediately after launch

**Solution:**
1. Check the logs: `adb logcat | grep "GLM"`
2. Ensure all dependencies are installed: `pnpm install`
3. Clear cache: `pnpm start --clear`
4. Rebuild: `eas build --platform android --profile preview --clean`

## Performance Optimization

### Reduce App Size

The default build is around 50-80 MB. To reduce:

1. **Enable ProGuard/R8:**
   - Edit `android/app/build.gradle`
   - Set `minifyEnabled true` in release build type

2. **Remove Unused Dependencies:**
   - Review `package.json`
   - Remove any unused packages

### Improve Startup Time

1. **Use Hermes Engine:**
   - Edit `app.config.ts`
   - Set `jsEngine: "hermes"`

2. **Lazy Load Routes:**
   - Current setup already uses lazy loading via Expo Router

## Deployment to Google Play Store

### Prerequisites

1. Google Play Developer Account ($25 one-time fee)
2. Signed APK (production build)
3. App screenshots and description
4. Privacy policy

### Steps

1. **Create App Listing:**
   - Go to [Google Play Console](https://play.google.com/console)
   - Create new app
   - Fill in app details

2. **Upload APK:**
   ```bash
   eas build --platform android --profile production
   ```
   - Download the signed APK
   - Upload to Google Play Console

3. **Complete Store Listing:**
   - Add screenshots
   - Write description
   - Set pricing
   - Configure content rating

4. **Submit for Review:**
   - Review all details
   - Submit for review
   - Wait for approval (usually 2-4 hours)

## Monitoring & Analytics

### View Build Status

```bash
eas build:list
```

### View Build Logs

```bash
eas build:view <build-id>
```

### Monitor App Performance

Consider integrating:
- **Sentry** for crash reporting
- **Firebase Analytics** for usage tracking
- **LogRocket** for session replay

## Support & Resources

- **Expo Documentation:** https://docs.expo.dev
- **EAS Build:** https://docs.expo.dev/eas-build/introduction/
- **React Native:** https://reactnative.dev
- **GLM-4 API:** https://open.bigmodel.cn/dev/api
- **Android Development:** https://developer.android.com

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Build timeout | Increase timeout: `eas build --timeout 3600` |
| Out of memory | Reduce build resources or split build |
| Module not found | Run `pnpm install` and rebuild |
| API errors | Check API key and endpoint configuration |
| Volume button not working | Ensure dev build, check permissions |

## Next Steps

1. **Test the app** on a physical device
2. **Gather user feedback** on chat functionality
3. **Optimize performance** based on usage patterns
4. **Add additional features** as needed
5. **Submit to Google Play Store** when ready

---

For additional help, refer to the project documentation or contact support.
