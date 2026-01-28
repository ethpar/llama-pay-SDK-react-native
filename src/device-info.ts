export type Platform = 'web' | 'react-native' | 'node' | 'unknown'

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
    if (
        typeof process !== 'undefined' &&
        process.versions &&
        process.versions.node
    ) {
        return 'node'
    }

    return 'unknown'
}

async function getHostInfo() {
    const os = await import('node:os')
    const platform = os.platform()
    const arch = os.arch()
    const release = os.release()
    const version = os.version?.()

    let osName
    switch (platform) {
        case 'darwin':
            osName = 'macOS'
            break
        case 'win32':
            osName = 'Windows'
            break
        case 'linux':
            osName = 'Linux'
            break
        default:
            osName = platform
    }

    return `${platform}-${arch};${release}-${version}`
}

export async function getUserAgent() {
    const platform = detectPlatform()

    switch (platform) {
        case 'web':
            return navigator.userAgent
        case 'react-native':
            const deviceInfo = await import('react-native-device-info')
            return deviceInfo.getUserAgent()
        case 'node':
            return await getHostInfo()
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

export async function getNodeDeviceId() {
    const [{ default: os }, { default: crypto }] = await Promise.all([
        import('os'),
        import('crypto')
    ])

    const data = [
        os.hostname(),
        os.platform(),
        os.arch(),
        os.release(),
        os.cpus().length
    ].join('|')

    return crypto.createHash('sha256').update(data).digest('hex')
}

export async function getDeviceId() {
    const platform = detectPlatform()

    switch (platform) {
        case 'web':
            return getWebDeviceId()
        case 'react-native':
            const deviceInfo = await import('react-native-device-info')
            return deviceInfo.getDeviceId()
        case 'node':
            return await getNodeDeviceId()
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
        case 'node':
            return process.title
        default:
            return 'Unknown'
    }
}
