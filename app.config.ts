import type { ExpoConfig } from "expo/config";

// Simply re-export the app.json config
// This allows EAS to modify app.json directly without TypeScript issues
const config: ExpoConfig = require("./app.json").expo;

export default config;
