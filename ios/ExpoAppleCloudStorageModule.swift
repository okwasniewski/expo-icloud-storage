import ExpoModulesCore
import Foundation

public class ExpoAppleCloudStorageModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoAppleCloudStorage")

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
}
