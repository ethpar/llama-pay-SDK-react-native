"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectPlatform = detectPlatform;
exports.getUserAgent = getUserAgent;
exports.getMobileDeviceId = getMobileDeviceId;
exports.getDeviceId = getDeviceId;
exports.getBundleId = getBundleId;
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
    const platform = detectPlatform();
    switch (platform) {
        case 'web':
            return navigator.userAgent;
        case 'react-native':
            const deviceInfo = await Promise.resolve().then(() => __importStar(require('react-native-device-info')));
            return deviceInfo.getUserAgent();
        default:
            return 'Unknown';
    }
}
function getWebDeviceId() {
    const KEY = '__d_id__';
    let id = localStorage.getItem(KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(KEY, id);
    }
    return id;
}
const SOC_PATTERNS = [
    /^s\d+e\d+/i, // s5e9925 (Exynos)
    /^mt\d+/i, // mt6785 (Mediatek)
    /^sdm?\d+/i, // sm8350 / sdm845 (Snapdragon)
    /^kirin\d+/i,
    /^exynos\d+/i,
    /^universal\d+/i,
    /^gs\d+/i // Google tensor
];
function looksLikeSoC(id) {
    if (!id)
        return true;
    return SOC_PATTERNS.some((r) => r.test(id));
}
async function getMobileDeviceId() {
    try {
        const DeviceInfo = await Promise.resolve().then(() => __importStar(require('react-native-device-info')));
        const [deviceId, model, brand, product, hardware] = await Promise.all([
            DeviceInfo.getDeviceId(),
            DeviceInfo.getModel(),
            DeviceInfo.getBrand(),
            DeviceInfo.getProduct(),
            DeviceInfo.getHardware()
        ]);
        if (deviceId && !looksLikeSoC(deviceId)) {
            return deviceId;
        }
        if (product && !looksLikeSoC(product)) {
            return product;
        }
        if (hardware && !looksLikeSoC(hardware)) {
            return hardware;
        }
        if (brand || model) {
            return `${brand ?? ''} ${model ?? ''}`.trim();
        }
        return 'unknown-device';
    }
    catch {
        return 'unknown-device';
    }
}
async function getDeviceId() {
    const platform = detectPlatform();
    switch (platform) {
        case 'web':
            return getWebDeviceId();
        case 'react-native':
            return getMobileDeviceId();
        default:
            return 'Unknown';
    }
}
async function getBundleId() {
    const platform = detectPlatform();
    switch (platform) {
        case 'web':
            return location.origin;
        case 'react-native':
            const deviceInfo = await Promise.resolve().then(() => __importStar(require('react-native-device-info')));
            return deviceInfo.getBundleId();
        default:
            return 'Unknown';
    }
}
//# sourceMappingURL=device-info.js.map