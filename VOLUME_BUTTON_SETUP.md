# Volume Button Triple-Press Setup Guide

This document explains how to set up the volume button triple-press trigger for the GLM-4 Assistant app on Android.

## Overview

The app is designed to launch or bring to foreground when the user triple-presses the volume down button. This requires native Android integration that goes beyond standard React Native capabilities.

## Implementation Approaches

### Approach 1: Custom Expo Module (Recommended for Managed Expo)

The project includes a custom Expo module at `modules/volume-button-listener/` that provides the foundation for volume button detection.

**Advantages:**
- Works with Expo managed workflow
- Can be used with Expo Go for development
- Cleaner integration with Expo Router

**Setup Steps:**

1. **Install the module:**
   ```bash
   cd modules/volume-button-listener
   npm install
   cd ../..
   ```

2. **Add to app.config.ts:**
   ```typescript
   plugins: [
     // ... existing plugins
     "./modules/volume-button-listener/expo-module.config.ts",
   ],
   ```

3. **Create a dev build:**
   ```bash
   eas build --platform android --profile preview
   ```

### Approach 2: Direct MainActivity Override (For Bare React Native)

If you're using a bare React Native project or EAS build, you can override the MainActivity directly:

1. **Modify android/app/src/main/java/com/uncensoredglm/MainActivity.kt:**

```kotlin
package com.uncensoredglm

import android.os.Bundle
import android.view.KeyEvent
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {
  private var volumeDownPressCount = 0
  private var lastVolumeDownTime = 0L
  private val TRIPLE_PRESS_TIMEOUT = 1000L

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
  }

  override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
    return when (keyCode) {
      KeyEvent.KEYCODE_VOLUME_DOWN -> {
        handleVolumeDownPress()
        true
      }
      else -> super.onKeyDown(keyCode, event)
    }
  }

  private fun handleVolumeDownPress() {
    val currentTime = System.currentTimeMillis()

    // Reset count if timeout exceeded
    if (currentTime - lastVolumeDownTime > TRIPLE_PRESS_TIMEOUT) {
      volumeDownPressCount = 0
    }

    volumeDownPressCount++
    lastVolumeDownTime = currentTime

    // Trigger on triple press
    if (volumeDownPressCount >= 3) {
      volumeDownPressCount = 0
      // Send event to React Native
      sendEventToReactNative("volumeButtonTriplePress")
    }
  }

  private fun sendEventToReactNative(eventName: String) {
    // This will be handled by the event listener in the React Native app
    // See app/(tabs)/chat.tsx for the listener implementation
  }
}
```

### Approach 3: Accessibility Service (For Background Listening)

For listening to volume button presses even when the app is in the background, you need an Accessibility Service:

1. **Create AccessibilityService:**

```kotlin
package com.uncensoredglm

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.KeyEvent
import android.content.Intent
import android.os.Build

class VolumeButtonAccessibilityService : AccessibilityService() {
  private var volumeDownPressCount = 0
  private var lastVolumeDownTime = 0L
  private val TRIPLE_PRESS_TIMEOUT = 1000L

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    // Accessibility events don't directly capture hardware keys
    // This service mainly serves as a listener framework
  }

  override fun onInterrupt() {}

  override fun onKeyEvent(event: KeyEvent?): Boolean {
    if (event?.keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
      if (event.action == KeyEvent.ACTION_DOWN) {
        handleVolumeDownPress()
      }
      return true
    }
    return super.onKeyEvent(event)
  }

  private fun handleVolumeDownPress() {
    val currentTime = System.currentTimeMillis()

    if (currentTime - lastVolumeDownTime > TRIPLE_PRESS_TIMEOUT) {
      volumeDownPressCount = 0
    }

    volumeDownPressCount++
    lastVolumeDownTime = currentTime

    if (volumeDownPressCount >= 3) {
      volumeDownPressCount = 0
      launchApp()
    }
  }

  private fun launchApp() {
    val intent = Intent(this, MainActivity::class.java)
    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP
    startActivity(intent)
  }
}
```

2. **Add to AndroidManifest.xml:**

```xml
<service
  android:name=".VolumeButtonAccessibilityService"
  android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
  android:enabled="true"
  android:exported="true">
  <intent-filter>
    <action android:name="android.accessibilityservice.AccessibilityService" />
  </intent-filter>
  <meta-data
    android:name="android.accessibilityservice"
    android:resource="@xml/accessibility_service_config" />
</service>
```

3. **Create res/xml/accessibility_service_config.xml:**

```xml
<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
  android:description="@string/accessibility_service_description"
  android:accessibilityEventTypes="typeAllMask"
  android:accessibilityFeedbackType="feedbackGeneric"
  android:notificationTimeout="100"
  android:canRetrieveWindowContent="true"
  android:canRequestFilterKeyEvents="true" />
```

## React Native Integration

The app includes a chat context that handles the volume button events. When a triple-press is detected, the app will:

1. Bring the chat screen to foreground
2. Focus the text input field
3. Show the keyboard

## Testing

### In Expo Go (Limited):
- Volume button detection works only when the app is in foreground
- Use the chat screen to test message sending

### In Dev Build:
```bash
eas build --platform android --profile preview
```

### In Production Build:
```bash
eas build --platform android --profile production
```

## Limitations

1. **Expo Go:** Volume button interception is limited to foreground-only
2. **Background Listening:** Requires Accessibility Service or custom native module
3. **iOS:** This implementation is Android-specific. iOS would require a different approach using media controls or custom gestures

## Troubleshooting

### Volume button not working:
- Ensure the app has the necessary permissions
- Check that MainActivity.onKeyDown is being called
- Verify that the event is being sent to React Native

### App not launching on triple-press:
- Check Android logs: `adb logcat | grep "VolumeButton"`
- Verify the intent is being triggered
- Ensure the app is properly installed

### High CPU usage:
- Reduce the frequency of event emissions
- Implement debouncing for volume button presses
- Use `shouldComponentUpdate` to prevent unnecessary re-renders

## References

- [Android KeyEvent Documentation](https://developer.android.com/reference/android/view/KeyEvent)
- [Accessibility Service Documentation](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService)
- [Expo Modules Documentation](https://docs.expo.dev/modules/overview/)
