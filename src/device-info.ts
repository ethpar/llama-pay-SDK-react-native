export type Platform = 'web' | 'react-native' | 'unknown'

export function detectPlatform(): Platform {
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
    const platform = detectPlatform()

    switch (platform) {
        case 'web':
            return navigator.userAgent
        case 'react-native':
            const deviceInfo = await import('react-native-device-info')
            return deviceInfo.getUserAgent()
        default:
            return 'Unknown'
    }
}

function getWebDeviceId(): string {
    const KEY = '__d_id__'

    let id = localStorage.getItem(KEY)
    if (!id) {
        id = crypto.randomUUID()
        localStorage.setItem(KEY, id)
    }

    return id
}

export async function getDeviceId() {
    const platform = detectPlatform()

    switch (platform) {
        case 'web':
            return getWebDeviceId()
        case 'react-native':
            const deviceInfo = await import('react-native-device-info')
            return deviceInfo.getDeviceId()
        default:
            return 'Unknown'
    }
}

export async function getBundleId() {
    const platform = detectPlatform()

    switch (platform) {
        case 'web':
            return location.origin
        case 'react-native':
            const deviceInfo = await import('react-native-device-info')
            return deviceInfo.getBundleId()
        default:
            return 'Unknown'
    }
}
