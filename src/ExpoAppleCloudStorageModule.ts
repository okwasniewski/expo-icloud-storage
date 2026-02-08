import { NativeModule, requireNativeModule } from 'expo';

export type ICloudStorageChangeReason = 
  | 'server'
  | 'initialSync'
  | 'quotaViolation'
  | 'accountChange'
  | 'unknown';

export type ICloudStorageChangeEvent = {
  changedKeys: string[];
  reason: ICloudStorageChangeReason;
};

declare class ExpoAppleCloudStorageModule extends NativeModule {
  set(key: string, value: string): void;
  getString(key: string): string | null;
  remove(key: string): void;
  getAllKeys(): string[];
}

export default requireNativeModule<ExpoAppleCloudStorageModule>('ExpoAppleCloudStorage');
