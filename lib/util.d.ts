import { Balance } from '@/models/Balance';
export declare function clipMiddle(str: string, maxLength?: number): string;
export declare function portfolioChangePctWeighted(tokens: Balance[]): number;
export declare function hexToRgba(hex: string, opacity: number): string;
export declare function isENSFormat(name: string): boolean;
export declare function throttle<T extends unknown[]>(callback: (...args: T) => void, delay: number): (...args: T) => void;
export declare function isValidCreditCard(num: string): boolean;
export declare function normalize(value: number, min: number, max: number): number;
//# sourceMappingURL=util.d.ts.map