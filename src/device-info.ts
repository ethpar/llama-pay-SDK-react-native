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

export async function getUserAgent() {
    return DeviceInfo.getUserAgent()
}

export async function getDeviceId(): Promise<string> {
    return DeviceInfo.getUniqueId()
}

export async function getBundleId() {
    const platform = detectPlatform()

    switch (platform) {
        case 'web':
            return location.origin
        case 'react-native':
            return DeviceInfo.getBundleId()
        default:
            return 'Unknown'
    }
}
