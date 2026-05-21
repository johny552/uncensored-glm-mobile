// Load environment variables with proper priority (system > .env)
require("./scripts/load-env.js");
import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = require("./app.json").expo;

export default config;
