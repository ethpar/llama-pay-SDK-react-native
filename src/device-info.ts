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

const SOC_PATTERNS = [
    /^s\d+e\d+/i, // s5e9925 (Exynos)
    /^mt\d+/i, // mt6785 (Mediatek)
    /^sdm?\d+/i, // sm8350 / sdm845 (Snapdragon)
    /^kirin\d+/i,
    /^exynos\d+/i,
    /^universal\d+/i,
    /^gs\d+/i // Google tensor
]

function looksLikeSoC(id?: string | null): boolean {
    if (!id) return true
    return SOC_PATTERNS.some((r) => r.test(id))
}

export async function getMobileDeviceId(): Promise<string> {
    try {
        const DeviceInfo = await import('react-native-device-info')
        const [deviceId, model, brand, product, hardware] = await Promise.all([
            DeviceInfo.getDeviceId(),
            DeviceInfo.getModel(),
            DeviceInfo.getBrand(),
            DeviceInfo.getProduct(),
            DeviceInfo.getHardware()
        ])
        if (deviceId && !looksLikeSoC(deviceId)) {
            return deviceId
        }
        if (product && !looksLikeSoC(product)) {
            return product
        }
        if (hardware && !looksLikeSoC(hardware)) {
            return hardware
        }
        if (brand || model) {
            return `${brand ?? ''} ${model ?? ''}`.trim()
        }
        return 'unknown-device'
    } catch {
        return 'unknown-device'
    }
}

export async function getDeviceId() {
    const platform = detectPlatform()

    switch (platform) {
        case 'web':
            return getWebDeviceId()
        case 'react-native':
            return getMobileDeviceId()
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
