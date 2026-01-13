import { NativeModule, requireNativeModule } from 'expo';

declare class ExpoAppleCloudStorageModule extends NativeModule {
  set(key: string, value: string): void;
  getString(key: string): string | null;
  remove(key: string): void;
  getAllKeys(): string[];
}

export default requireNativeModule<ExpoAppleCloudStorageModule>('ExpoAppleCloudStorage');
