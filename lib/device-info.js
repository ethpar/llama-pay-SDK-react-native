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
exports.getNodeDeviceId = getNodeDeviceId;
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
    if (typeof process !== 'undefined' &&
        process.versions &&
        process.versions.node) {
        return 'node';
    }
    return 'unknown';
}
async function getHostInfo() {
    const os = await Promise.resolve().then(() => __importStar(require('node:os')));
    const platform = os.platform();
    const arch = os.arch();
    const release = os.release();
    const version = os.version?.();
    let osName;
    switch (platform) {
        case 'darwin':
            osName = 'macOS';
            break;
        case 'win32':
            osName = 'Windows';
            break;
        case 'linux':
            osName = 'Linux';
            break;
        default:
            osName = platform;
    }
    return `${platform}-${arch};${release}-${version}`;
}
async function getUserAgent() {
    const platform = detectPlatform();
    switch (platform) {
        case 'web':
            return navigator.userAgent;
        case 'react-native':
            const deviceInfo = await Promise.resolve().then(() => __importStar(require('react-native-device-info')));
            return deviceInfo.getUserAgent();
        case 'node':
            return await getHostInfo();
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
async function getNodeDeviceId() {
    const [{ default: os }, { default: crypto }] = await Promise.all([
        Promise.resolve().then(() => __importStar(require('os'))),
        Promise.resolve().then(() => __importStar(require('crypto')))
    ]);
    const data = [
        os.hostname(),
        os.platform(),
        os.arch(),
        os.release(),
        os.cpus().length
    ].join('|');
    return crypto.createHash('sha256').update(data).digest('hex');
}
async function getDeviceId() {
    const platform = detectPlatform();
    switch (platform) {
        case 'web':
            return getWebDeviceId();
        case 'react-native':
            const deviceInfo = await Promise.resolve().then(() => __importStar(require('react-native-device-info')));
            return deviceInfo.getDeviceId();
        case 'node':
            return await getNodeDeviceId();
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
        case 'node':
            return process.title;
        default:
            return 'Unknown';
    }
}
//# sourceMappingURL=device-info.js.map