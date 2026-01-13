# expo-icloud-storage

> **Note:** This is an iOS/macOS/tvOS only module. See [Cross-Platform Usage](#cross-platform-usage) for Android support.

React Native wrapper for iCloud's `NSUbiquitousKeyValueStore` - simple key-value storage that syncs across a user's Apple devices via iCloud.

## Installation

```bash
npm install expo-icloud-storage
```

## Configuration

### Expo (Managed Workflow)

Add the iCloud entitlement to your `app.config.ts` or `app.json`:

```typescript
export default {
  expo: {
    ios: {
      entitlements: {
        'com.apple.developer.ubiquity-kvstore-identifier':
          '$(TeamIdentifierPrefix)$(CFBundleIdentifier)',
      },
    },
  },
};
```

Then run `npx expo prebuild` to regenerate native projects.

### Bare Workflow / Manual Setup

1. Run `npx pod-install` after installing the npm package.

2. **Enable iCloud Capability** in Xcode:
   - Open your iOS project in Xcode
   - Select your app target
   - Go to "Signing & Capabilities"
   - Click "+ Capability" and add "iCloud"
   - Enable "Key-value storage"

3. **Add Entitlement** to your `ios/[YourApp]/[YourApp].entitlements`:
   ```xml
   <key>com.apple.developer.ubiquity-kvstore-identifier</key>
   <string>$(TeamIdentifierPrefix)$(CFBundleIdentifier)</string>
   ```

## API Reference

### `set(key: string, value: string): void`

Store a string value in iCloud key-value storage.

```typescript
import iCloudStorage from 'expo-icloud-storage';

iCloudStorage.set('username', 'john_doe');

// For complex objects, use JSON.stringify
iCloudStorage.set('settings', JSON.stringify({ theme: 'dark', notifications: true }));
```

### `getString(key: string): string | null`

Retrieve a string value from iCloud key-value storage.

```typescript
const username = iCloudStorage.getString('username');

// For complex objects, use JSON.parse
const settingsString = iCloudStorage.getString('settings');
const settings = settingsString ? JSON.parse(settingsString) : null;
```

### `remove(key: string): void`

Remove a key-value pair from storage.

```typescript
iCloudStorage.remove('username');
```

### `getAllKeys(): string[]`

Get all keys currently stored in iCloud key-value storage.

```typescript
const keys = iCloudStorage.getAllKeys();
console.log('Stored keys:', keys);
```

## Usage Example

```typescript
import iCloudStorage from 'expo-icloud-storage';

// Store simple values
iCloudStorage.set('lastSync', new Date().toISOString());

// Store complex objects
const userData = { id: 123, name: 'John', preferences: { theme: 'dark' } };
iCloudStorage.set('userData', JSON.stringify(userData));

// Retrieve values
const lastSync = iCloudStorage.getString('lastSync');
const userDataString = iCloudStorage.getString('userData');
const parsedUserData = userDataString ? JSON.parse(userDataString) : null;

// List all keys
const allKeys = iCloudStorage.getAllKeys();

// Remove a key
iCloudStorage.remove('lastSync');
```

## Storage Limits

`NSUbiquitousKeyValueStore` has the following limitations:

| Limit | Value |
|-------|-------|
| Total storage | 1 MB |
| Maximum keys | 1024 |
| Per-key size | 1 MB |

Exceeding these limits may result in data loss or sync failures.

## Sync Behavior

- Data automatically syncs across devices signed into the same iCloud account
- Sync happens in the background when network is available
- No explicit sync needed - the library calls `synchronize()` automatically
- First sync may take a few moments after app launch
- Works offline - changes sync when connection is restored

## Platform Support

| Platform | Supported |
|----------|-----------|
| iOS | ✅ |
| macOS | ✅ |
| tvOS | ✅ |
| Android | ❌ |
| Web | ❌ |

## Cross-Platform Usage

Since iCloud is not available on Android, you can create an abstraction layer using [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) for Android while using `expo-icloud-storage` on iOS.

### Installation

```bash
npm install expo-icloud-storage react-native-mmkv
```

### Create a Storage Abstraction

```typescript
// storage.ts
import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';

interface Storage {
  set(key: string, value: string): void;
  getString(key: string): string | null | undefined;
  remove(key: string): void;
  getAllKeys(): string[];
}

function createStorage(): Storage {
  if (Platform.OS === 'ios') {
    // Use iCloud storage on iOS for cross-device sync
    const iCloudStorage = require('expo-icloud-storage').default;
    return {
      set: (key: string, value: string) => iCloudStorage.set(key, value),
      getString: (key: string) => iCloudStorage.getString(key),
      remove: (key: string) => iCloudStorage.remove(key),
      getAllKeys: () => iCloudStorage.getAllKeys(),
    };
  }

  // Use MMKV on Android for fast local storage
  const mmkv = new MMKV();
  return {
    set: (key: string, value: string) => mmkv.set(key, value),
    getString: (key: string) => mmkv.getString(key),
    remove: (key: string) => mmkv.delete(key),
    getAllKeys: () => mmkv.getAllKeys(),
  };
}

export const storage = createStorage();
```

### Usage

```typescript
import { storage } from './storage';

// Works on both iOS and Android
storage.set('user', JSON.stringify({ name: 'John' }));
const user = storage.getString('user');
storage.remove('user');
const keys = storage.getAllKeys();
```

This approach gives you:
- **iOS**: iCloud sync across all user's Apple devices
- **Android**: Fast local storage with MMKV

## Troubleshooting

### "No value returned even though I set it"

- Ensure iCloud is enabled on the device
- Check that the user is signed into iCloud
- Verify the entitlement is correctly configured
- First sync after app install may take a moment

### "Data not syncing between devices"

- Both devices must be signed into the same iCloud account
- Ensure both devices have iCloud Drive enabled
- Check network connectivity
- Wait a few moments - sync is not instantaneous

### Build errors with "ubiquity-kvstore-identifier"

- Verify your Apple Developer account has iCloud capabilities enabled
- Ensure your App ID is configured for iCloud in the Apple Developer Portal
- Check that your provisioning profile includes iCloud entitlements

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
