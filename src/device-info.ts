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
}
