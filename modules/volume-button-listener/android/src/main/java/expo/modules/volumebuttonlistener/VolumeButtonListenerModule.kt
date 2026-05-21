package expo.modules.volumebuttonlistener

import android.content.Context
import android.media.AudioManager
import android.view.KeyEvent
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.exception.Exceptions

class VolumeButtonListenerModule : Module() {
  private var audioManager: AudioManager? = null
  private var volumeDownPressCount = 0
  private var lastVolumeDownTime = 0L
  private val TRIPLE_PRESS_TIMEOUT = 1000L // 1 second window for triple press
  private var onVolumeButtonEventCallback: ((String, Int) -> Unit)? = null

  override fun definition() = ModuleDefinition {
    Name("VolumeButtonListener")

    Events("onVolumeButtonEvent")

    Function("startListening") {
      startListening()
    }

    Function("stopListening") {
      stopListening()
    }

    Function("isListening") {
      isListening()
    }
  }

  private fun startListening() {
    audioManager = appContext.reactContext?.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
    // Note: Direct volume button interception requires either:
    // 1. Accessibility Service (recommended for background listening)
    // 2. Custom Activity with onKeyDown override (foreground only)
    // This module provides the foundation; actual implementation requires native setup
  }

  private fun stopListening() {
    audioManager = null
  }

  private fun isListening(): Boolean {
    return audioManager != null
  }

  /**
   * This method should be called from the Activity's onKeyDown
   * Add this to your MainActivity.kt:
   *
   * override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
   *   if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
   *     volumeButtonListenerModule?.handleVolumeDownPress()
   *     return true
   *   }
   *   return super.onKeyDown(keyCode, event)
   * }
   */
  fun handleVolumeDownPress() {
    val currentTime = System.currentTimeMillis()

    // Reset count if timeout exceeded
    if (currentTime - lastVolumeDownTime > TRIPLE_PRESS_TIMEOUT) {
      volumeDownPressCount = 0
    }

    volumeDownPressCount++
    lastVolumeDownTime = currentTime

    // Emit event for each press
    sendEvent("onVolumeButtonEvent", mapOf(
      "type" to "volume_down",
      "pressCount" to volumeDownPressCount,
      "timestamp" to currentTime
    ))

    // Trigger action on triple press
    if (volumeDownPressCount >= 3) {
      volumeDownPressCount = 0
      sendEvent("onVolumeButtonEvent", mapOf(
        "type" to "triple_press",
        "timestamp" to currentTime
      ))
    }
  }

  fun handleVolumeUpPress() {
    val currentTime = System.currentTimeMillis()
    sendEvent("onVolumeButtonEvent", mapOf(
      "type" to "volume_up",
      "timestamp" to currentTime
    ))
  }
}
