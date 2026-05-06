<<<<<<< Updated upstream
import DeviceInfo from 'react-native-device-info'

export type Platform = 'web' | 'react-native' | 'unknown'

function detectPlatform(): Platform {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        return 'web'
    }
    if (
        typeof navigator !== 'undefined' &&
        navigator.product === 'ReactNative'
    ) {
        return 'react-native'
    }

    return 'unknown'
}

=======
>>>>>>> Stashed changes
export async function getUserAgent() {
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
        return navigator.userAgent
    }

    if (typeof process !== 'undefined' && process.version) {
        return `Node.js/${process.version} (${process.platform})`
    }

    return 'unknown'
}

export async function getBundleId() {
<<<<<<< Updated upstream
    const platform = detectPlatform()

    switch (platform) {
        case 'web':
            return location.origin
        case 'react-native':
            return DeviceInfo.getBundleId()
        default:
            return 'Unknown'
    }
=======
    if (typeof require !== 'undefined') {
        try {
            const Constants = require('expo-constants').default
            if (Constants.expoConfig?.ios?.bundleIdentifier)
                return Constants.expoConfig.ios.bundleIdentifier
            if (Constants.expoConfig?.android?.package)
                return Constants.expoConfig.android.package
        } catch {}

        try {
            const { NativeModules } = require('react-native')
            if (NativeModules?.RNDeviceInfo?.bundleId)
                return NativeModules.RNDeviceInfo.bundleId
        } catch {}
    }

    if (typeof process !== 'undefined' && process.versions?.node) {
        try {
            const pkg = require('./package.json')
            if (pkg.name) return pkg.name
        } catch {}
    }

    if (typeof window !== 'undefined') {
        return window.location.hostname
    }

    return null
>>>>>>> Stashed changes
}
