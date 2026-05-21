import { ConfigPlugin, createRunOncePlugin, withMainActivity } from "@expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

const pkg = require("./package.json");

const withVolumeButtonListener: ConfigPlugin = (config) => {
  return withMainActivity(config, async (config) => {
    const mainActivityPath = config.modResults.path;
    let contents = config.modResults.contents;

    // Add volume button handling to MainActivity
    const importStatement = `import expo.modules.volumebuttonlistener.VolumeButtonListenerModule;`;
    const onKeyDownOverride = `
  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
    if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
      // Handle volume down button
      return true;
    }
    return super.onKeyDown(keyCode, event);
  }`;

    if (!contents.includes(importStatement)) {
      contents = contents.replace(
        "import android.os.Bundle;",
        `import android.os.Bundle;\nimport android.view.KeyEvent;\n${importStatement}`
      );
    }

    if (!contents.includes("onKeyDown")) {
      contents = contents.replace(
        "public class MainActivity extends ReactActivity {",
        `public class MainActivity extends ReactActivity {${onKeyDownOverride}`
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};

export default createRunOncePlugin(withVolumeButtonListener, pkg.name, pkg.version);
