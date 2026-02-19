export type Platform = 'web' | 'react-native' | 'unknown';
export declare function detectPlatform(): Platform;
export declare function getUserAgent(): Promise<string>;
export declare function getMobileDeviceId(): Promise<string>;
export declare function getDeviceId(): Promise<string>;
export declare function getBundleId(): Promise<string>;
//# sourceMappingURL=device-info.d.ts.map