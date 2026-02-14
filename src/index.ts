import { EventEmitter, EventSubscription } from "expo-modules-core";

import ExpoAppleCloudStorageModule, {
  ICloudStorageChangeEvent,
  ICloudStorageChangeReason,
} from "./ExpoAppleCloudStorageModule";

type EventsMap = {
  onICloudStorageChange: (event: ICloudStorageChangeEvent) => void;
};

const emitter = new EventEmitter<EventsMap>(ExpoAppleCloudStorageModule);

export function set(key: string, value: string): void {
  return ExpoAppleCloudStorageModule.set(key, value);
}

export function getString(key: string): string | null {
  return ExpoAppleCloudStorageModule.getString(key);
}

export function remove(key: string): void {
  return ExpoAppleCloudStorageModule.remove(key);
}

export function getAllKeys(): string[] {
  return ExpoAppleCloudStorageModule.getAllKeys();
}

export function addChangeListener(
  listener: (event: ICloudStorageChangeEvent) => void,
): EventSubscription {
  return emitter.addListener("onICloudStorageChange", listener);
}

export type { ICloudStorageChangeEvent, ICloudStorageChangeReason };

export default {
  set,
  getString,
  remove,
  getAllKeys,
  addChangeListener,
};
