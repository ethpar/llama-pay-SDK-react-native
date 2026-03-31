export type Platform = 'web' | 'react-native' | 'unknown'

export async function getUserAgent(): Promise<string> {
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
        return navigator.userAgent
    }
    return 'unknown'
}

export async function getDeviceId(): Promise<string> {
    if (typeof localStorage === 'undefined') return 'unknown'
    const key = '__llama_pay_device_id__'
    let id = localStorage.getItem(key)
    if (!id) {
        id = crypto.randomUUID()
        localStorage.setItem(key, id)
    }
    return id
}

export async function getBundleId(): Promise<string> {
    if (typeof location !== 'undefined') {
        return location.origin
    }
    return 'unknown'
}
