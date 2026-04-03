import DeviceInfo from 'react-native-device-info'

export type Platform = 'web' | 'react-native' | 'unknown'

export async function getUserAgent() {
    return DeviceInfo.getUserAgent()
}

export async function getDeviceId(): Promise<string> {
    return DeviceInfo.getUniqueId()
}

export async function getBundleId() {
    return DeviceInfo.getBundleId()
}
