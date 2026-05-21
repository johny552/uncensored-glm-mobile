import { EventEmitter, Subscription } from "expo-modules-core";
import { NativeModulesProxy } from "expo-modules-core";

const VolumeButtonListenerModule = NativeModulesProxy.VolumeButtonListener || {};

export type VolumeButtonEvent = {
  type: "volume_up" | "volume_down";
  timestamp: number;
};

class VolumeButtonListener extends EventEmitter {
  private subscription: Subscription | null = null;

  constructor() {
    super(VolumeButtonListenerModule);
  }

  /**
   * Start listening for volume button events
   */
  async startListening(): Promise<void> {
    if (this.subscription) {
      console.warn("Volume button listener already started");
      return;
    }

    if (VolumeButtonListenerModule.startListening) {
      await VolumeButtonListenerModule.startListening();
    }

    this.subscription = this.addListener(
      "onVolumeButtonEvent",
      (event: VolumeButtonEvent) => {
        this.handleVolumeButtonEvent(event);
      }
    );
  }

  /**
   * Stop listening for volume button events
   */
  async stopListening(): Promise<void> {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }

    if (VolumeButtonListenerModule.stopListening) {
      await VolumeButtonListenerModule.stopListening();
    }
  }

  /**
   * Handle volume button events (override in subclass or use listeners)
   */
  private handleVolumeButtonEvent(event: VolumeButtonEvent): void {
    // This will be emitted to listeners
  }

  /**
   * Add a listener for volume button events
   */
  addVolumeButtonListener(
    callback: (event: VolumeButtonEvent) => void
  ): Subscription {
    return this.addListener("onVolumeButtonEvent", callback);
  }
}

export default new VolumeButtonListener();
