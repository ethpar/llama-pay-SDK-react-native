import 'dart:io';
import 'dart:html' as html show window, document, localStorage;
import 'package:device_info_plus/device_info_plus.dart';
import 'package:uuid/uuid.dart';

enum Platform { web, flutter, unknown }

Platform detectPlatform() {
  try {
    // Check if we're in a web environment
    if (identical(0, 0.0) && html.window != null && html.document != null) {
      return Platform.web;
    }
  } catch (e) {
    // Not in web environment
  }

  // Check if we're in Flutter environment
  try {
    if (Platform.isAndroid || Platform.isIOS || Platform.isMacOS || 
        Platform.isWindows || Platform.isLinux || Platform.isFuchsia) {
      return Platform.flutter;
    }
  } catch (e) {
    // Not in Flutter environment
  }

  return Platform.unknown;
}

Future<String> getUserAgent() async {
  final platform = detectPlatform();

  switch (platform) {
    case Platform.web:
      try {
        return html.window.navigator.userAgent;
      } catch (e) {
        return 'Unknown Web UserAgent';
      }
    case Platform.flutter:
      try {
        final deviceInfo = DeviceInfoPlugin();
        if (Platform.isAndroid) {
          final androidInfo = await deviceInfo.androidInfo;
          return 'Android ${androidInfo.version.release}';
        } else if (Platform.isIOS) {
          final iosInfo = await deviceInfo.iosInfo;
          return 'iOS ${iosInfo.systemVersion}';
        } else if (Platform.isMacOS) {
          final macOsInfo = await deviceInfo.macOsInfo;
          return 'macOS ${macOsInfo.osRelease}';
        } else if (Platform.isWindows) {
          final windowsInfo = await deviceInfo.windowsInfo;
          return 'Windows ${windowsInfo.majorVersion}.${windowsInfo.minorVersion}';
        } else if (Platform.isLinux) {
          final linuxInfo = await deviceInfo.linuxInfo;
          return 'Linux ${linuxInfo.version}';
        }
        return 'Flutter Unknown';
      } catch (e) {
        return 'Flutter Unknown';
      }
    default:
      return 'Unknown';
  }
}

String _getWebDeviceId() {
  const key = '__d_id__';

  try {
    String? id = html.localStorage[key];
    if (id == null) {
      id = const Uuid().v4();
      html.localStorage[key] = id;
    }
    return id;
  } catch (e) {
    return const Uuid().v4(); // Fallback to generated UUID
  }
}

Future<String> getDeviceId() async {
  final platform = detectPlatform();

  switch (platform) {
    case Platform.web:
      return _getWebDeviceId();
    case Platform.flutter:
      try {
        final deviceInfo = DeviceInfoPlugin();
        if (Platform.isAndroid) {
          final androidInfo = await deviceInfo.androidInfo;
          return androidInfo.id;
        } else if (Platform.isIOS) {
          final iosInfo = await deviceInfo.iosInfo;
          return iosInfo.identifierForVendor ?? const Uuid().v4();
        } else if (Platform.isMacOS) {
          final macOsInfo = await deviceInfo.macOsInfo;
          return macOsInfo.systemGUID ?? const Uuid().v4();
        } else if (Platform.isWindows) {
          final windowsInfo = await deviceInfo.windowsInfo;
          return windowsInfo.computerName;
        } else if (Platform.isLinux) {
          final linuxInfo = await deviceInfo.linuxInfo;
          return linuxInfo.machineId ?? const Uuid().v4();
        }
        return const Uuid().v4();
      } catch (e) {
        return const Uuid().v4(); // Fallback to generated UUID
      }
    default:
      return const Uuid().v4(); // Fallback to generated UUID
  }
}

Future<String> getBundleId() async {
  final platform = detectPlatform();

  switch (platform) {
    case Platform.web:
      try {
        return html.window.location.origin;
      } catch (e) {
        return 'Unknown Web Origin';
      }
    case Platform.flutter:
      try {
        final deviceInfo = DeviceInfoPlugin();
        if (Platform.isAndroid) {
          final androidInfo = await deviceInfo.androidInfo;
          return androidInfo.packageName;
        } else if (Platform.isIOS) {
          final iosInfo = await deviceInfo.iosInfo;
          return iosInfo.bundleId;
        } else if (Platform.isMacOS) {
          final macOsInfo = await deviceInfo.macOsInfo;
          return macOsInfo.bundleId;
        } else if (Platform.isWindows) {
          final windowsInfo = await deviceInfo.windowsInfo;
          return windowsInfo.computerName;
        } else if (Platform.isLinux) {
          final linuxInfo = await deviceInfo.linuxInfo;
          return linuxInfo.id;
        }
        return 'Flutter Unknown';
      } catch (e) {
        return 'Flutter Unknown';
      }
    default:
      return 'Unknown';
  }
}
