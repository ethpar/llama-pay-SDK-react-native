"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAgent = getUserAgent;
exports.getDeviceId = getDeviceId;
exports.getBundleId = getBundleId;
const react_native_device_info_1 = __importDefault(require("react-native-device-info"));
function detectPlatform() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        return 'web';
    }
    if (typeof navigator !== 'undefined' &&
        navigator.product === 'ReactNative') {
        return 'react-native';
    }
    return 'unknown';
}
async function getUserAgent() {
    return react_native_device_info_1.default.getUserAgent();
}
async function getDeviceId() {
    return react_native_device_info_1.default.getUniqueId();
}
async function getBundleId() {
    const platform = detectPlatform();
    switch (platform) {
        case 'web':
            return location.origin;
        case 'react-native':
            return react_native_device_info_1.default.getBundleId();
        default:
            return 'Unknown';
    }
}
//# sourceMappingURL=device-info.js.map