import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "expo-icloud-storage-example",
  slug: "expo-icloud-storage-example",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.example.icloudstorageexample",
    entitlements: {
      "com.apple.developer.ubiquity-kvstore-identifier":
        "$(TeamIdentifierPrefix)$(CFBundleIdentifier)",
    },
  },
  android: {
    package: "com.example.icloudstorageexample",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
});
