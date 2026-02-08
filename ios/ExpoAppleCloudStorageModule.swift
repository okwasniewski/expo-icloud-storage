import ExpoModulesCore
import Foundation

public class ExpoAppleCloudStorageModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoAppleCloudStorage")

    Events("onICloudStorageChange")

    OnCreate {
      NotificationCenter.default.addObserver(
        self,
        selector: #selector(handleStoreChange(_:)),
        name: NSUbiquitousKeyValueStore.didChangeExternallyNotification,
        object: NSUbiquitousKeyValueStore.default
      )
    }

    OnDestroy {
      NotificationCenter.default.removeObserver(self)
    }

    Function("set") { (key: String, value: String) in
      NSUbiquitousKeyValueStore.default.set(value, forKey: key)
      NSUbiquitousKeyValueStore.default.synchronize()
    }

    Function("getString") { (key: String) -> String? in
      return NSUbiquitousKeyValueStore.default.string(forKey: key)
    }

    Function("remove") { (key: String) in
      NSUbiquitousKeyValueStore.default.removeObject(forKey: key)
      NSUbiquitousKeyValueStore.default.synchronize()
    }

    Function("getAllKeys") { () -> [String] in
      return NSUbiquitousKeyValueStore.default.dictionaryRepresentation.keys.map { String($0) }
    }
  }

  @objc
  private func handleStoreChange(_ notification: Notification) {
    guard let userInfo = notification.userInfo else {
      return
    }

    var changeReason = "unknown"
    if let reason = userInfo[NSUbiquitousKeyValueStoreChangeReasonKey] as? Int {
      switch reason {
      case NSUbiquitousKeyValueStoreServerChange:
        changeReason = "server"
      case NSUbiquitousKeyValueStoreInitialSyncChange:
        changeReason = "initialSync"
      case NSUbiquitousKeyValueStoreQuotaViolationChange:
        changeReason = "quotaViolation"
      case NSUbiquitousKeyValueStoreAccountChange:
        changeReason = "accountChange"
      default:
        changeReason = "unknown"
      }
    }

    let changedKeys = userInfo[NSUbiquitousKeyValueStoreChangedKeysKey] as? [String] ?? []

    sendEvent("onICloudStorageChange", [
      "changedKeys": changedKeys,
      "reason": changeReason
    ])
  }
}
