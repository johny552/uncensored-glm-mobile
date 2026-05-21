# GLM-4 AI Assistant - Android Mobile App

A minimalist Android mobile app that provides quick access to a GLM-4 AI assistant via a hardware trigger (triple-press volume down button). The app connects to a cloud-hosted GLM-4 API for unrestricted AI conversations.

## Features

### Core Functionality
- **Chat Interface**: Clean, intuitive messaging interface for conversations with GLM-4 AI
- **Cloud-Based AI**: Connects to GLM-4 API for powerful AI responses
- **API Configuration**: User-provided API key and endpoint configuration
- **Local Storage**: Chat history and settings persisted locally using AsyncStorage
- **Dark Mode**: Automatic light/dark theme support based on device settings

### Hardware Integration
- **Volume Button Trigger**: Triple-press volume down to open the app or bring it to foreground
- **Quick Access**: Minimal friction between user and AI
- **Background Support**: Accessibility Service integration for background listening (requires dev build)

### User Experience
- **Real-time Messaging**: Send and receive messages with timestamps
- **Error Handling**: Graceful error messages for API failures
- **Loading States**: Visual feedback during API requests
- **Clear History**: One-tap option to clear all chat messages
- **Responsive Design**: Optimized for mobile portrait orientation

## Project Structure

```
uncensored-glm-mobile/
├── app/                          # Expo Router app structure
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigation layout
│   │   ├── chat.tsx             # Main chat screen
│   │   └── settings.tsx         # Settings screen
│   ├── _layout.tsx              # Root layout with providers
│   └── oauth/
├── lib/
│   ├── chat-context.tsx         # Chat state management
│   ├── trpc.ts                  # API client
│   └── theme-provider.tsx       # Theme management
├── components/
│   ├── screen-container.tsx     # SafeArea wrapper
│   └── ui/
│       └── icon-symbol.tsx      # Icon mappings
├── hooks/
│   ├── use-volume-button.ts     # Volume button hook
│   └── use-colors.ts            # Theme colors hook
├── modules/
│   └── volume-button-listener/  # Native Android module
├── assets/images/               # App icons and branding
├── server/                       # Backend server (optional)
├── design.md                     # UI/UX design documentation
├── VOLUME_BUTTON_SETUP.md       # Volume button implementation guide
├── BUILD_INSTRUCTIONS.md        # Build and deployment guide
└── todo.md                       # Project task tracking
```

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript 5.9
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: React Context + useReducer
- **Routing**: Expo Router 6
- **Storage**: AsyncStorage
- **API**: Direct HTTP calls to GLM-4 API
- **Build Tool**: EAS Build

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Expo account (free at expo.dev)
- GLM-4 API key from open.bigmodel.cn

### Installation

```bash
# Clone or navigate to the project
cd uncensored-glm-mobile

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### First Run

1. **Get API Key**:
   - Visit [open.bigmodel.cn](https://open.bigmodel.cn)
   - Sign up and create an API key
   - Note: Free tier includes limited API calls

2. **Configure App**:
   - Open the app in Expo Go or dev build
   - Go to Settings tab
   - Enter your GLM-4 API key
   - Tap Save Settings

3. **Start Chatting**:
   - Go to Chat tab
   - Type a message
   - Press send
   - Wait for AI response

## Usage

### Chat Screen

- **Send Message**: Type in the input field and tap the send button (→)
- **View History**: Scroll up to see previous messages
- **Clear Chat**: Tap the "Clear" button in the header
- **Character Limit**: 500 characters per message

### Settings Screen

- **API Key**: Enter your GLM-4 API key (stored securely)
- **API Endpoint**: Configure custom endpoint (default provided)
- **Clear History**: Delete all messages and start fresh
- **About**: View app version and model information

### Volume Button Trigger

- **Triple-Press**: Press volume down button 3 times within 1 second
- **App Launch**: App opens or comes to foreground
- **Chat Ready**: Chat screen opens with keyboard ready
- **Note**: Requires dev build; limited in Expo Go

## Configuration

### Environment Variables

Create a `.env` file (optional):

```env
# API Configuration
EXPO_PUBLIC_GLM_API_ENDPOINT=https://open.bigmodel.cn/api/paas/v4/chat/completions
```

### App Branding

Edit `app.config.ts`:

```typescript
const env = {
  appName: "GLM-4 Assistant",
  appSlug: "uncensored-glm-mobile",
  logoUrl: "https://...", // S3 URL of app icon
};
```

## Building for Android

### Development Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Build with volume button support
eas build --platform android --profile preview

# Download and install APK
adb install path/to/app.apk
```

### Production Build

```bash
# Build optimized APK
eas build --platform android --profile production

# Ready for Google Play Store submission
```

### Local Build

```bash
# Generate native Android project
npx expo prebuild --clean

# Build with Gradle
cd android
./gradlew assembleRelease
cd ..

# APK at: android/app/build/outputs/apk/release/app-release.apk
```

## API Integration

### GLM-4 API Details

- **Endpoint**: `https://open.bigmodel.cn/api/paas/v4/chat/completions`
- **Model**: `glm-4`
- **Authentication**: Bearer token (API key)
- **Request Format**: OpenAI-compatible chat completions

### Example Request

```bash
curl -X POST https://open.bigmodel.cn/api/paas/v4/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "glm-4",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "temperature": 0.7
  }'
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| API key not working | Verify key on open.bigmodel.cn, check account credits |
| Messages not sending | Check internet connection, verify API endpoint |
| Volume button not working | Use dev build (not Expo Go), check permissions |
| App crashes on startup | Clear cache: `pnpm start --clear` |
| Build fails | Run `pnpm install` and rebuild |

### Debug Logs

```bash
# View app logs
adb logcat | grep "GLM"

# View build logs
eas build:view <build-id>

# View Metro bundler logs
pnpm dev
```

## Performance

- **App Size**: ~50-80 MB (dev build)
- **Startup Time**: ~2-3 seconds
- **Message Response**: 1-5 seconds (depends on API)
- **Storage**: ~5-10 MB for 100+ messages

## Security Considerations

- **API Key**: Stored locally in AsyncStorage (consider using SecureStore for production)
- **Data**: Chat history stored locally, not synced to cloud
- **Network**: HTTPS only for API calls
- **Permissions**: Minimal permissions required (internet only)

## Future Enhancements

- [ ] Copy/share message functionality
- [ ] Haptic feedback on interactions
- [ ] Message search and filtering
- [ ] Multiple conversation threads
- [ ] Voice input/output
- [ ] Image support
- [ ] Conversation export
- [ ] Cloud sync (optional)
- [ ] Push notifications
- [ ] Custom system prompts

## Contributing

To contribute improvements:

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly on Android device
4. Submit a pull request with description

## License

This project is provided as-is for personal use.

## Support

For issues or questions:

1. Check `BUILD_INSTRUCTIONS.md` for build help
2. See `VOLUME_BUTTON_SETUP.md` for hardware integration
3. Review `design.md` for UI/UX details
4. Check project logs for debugging

## Resources

- **Expo Documentation**: https://docs.expo.dev
- **React Native**: https://reactnative.dev
- **GLM-4 API**: https://open.bigmodel.cn/dev/api
- **Android Development**: https://developer.android.com
- **NativeWind**: https://www.nativewind.dev

## Disclaimer

This app connects to GLM-4 API, which is provided by Zhipu AI. Usage is subject to their terms of service and API rate limits. Users are responsible for obtaining and managing their own API keys and associated costs.

---

**Version**: 1.0.0  
**Last Updated**: May 20, 2026  
**Platform**: Android (React Native)
