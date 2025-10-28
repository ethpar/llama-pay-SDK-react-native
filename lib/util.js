"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clipMiddle = clipMiddle;
exports.portfolioChangePctWeighted = portfolioChangePctWeighted;
exports.hexToRgba = hexToRgba;
exports.isENSFormat = isENSFormat;
exports.throttle = throttle;
exports.isValidCreditCard = isValidCreditCard;
exports.normalize = normalize;
function clipMiddle(str, maxLength = 20) {
    if (str.length <= maxLength)
        return str;
    const half = Math.floor((maxLength - 3) / 2);
    return str.slice(0, half) + '...' + str.slice(str.length - half);
}
function portfolioChangePctWeighted(tokens) {
    const totalValue = tokens.reduce((s, t) => s + (t.currentValue || 0), 0);
    if (totalValue === 0)
        return 0;
    const weightedSum = tokens.reduce((s, t) => s + (t.currentValue || 0) * (t.priceChangePercentange24h || 0), 0);
    return weightedSum / totalValue;
}
function hexToRgba(hex, opacity) {
    let cleaned = hex.replace('#', '');
    if (cleaned.length === 3) {
        cleaned = cleaned
            .split('')
            .map((c) => c + c)
            .join('');
    }
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
function isENSFormat(name) {
    return /^(?:[a-z0-9-]+\.)+[a-z]{2,}$/.test(name);
}
function throttle(callback, delay) {
    let isWaiting = false;
    return (...args) => {
        if (isWaiting) {
            return;
        }
        callback(...args);
        isWaiting = true;
        setTimeout(() => {
            isWaiting = false;
        }, delay);
    };
}
function isValidCreditCard(num) {
    const str = num.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    // Loop from right to left
    for (let i = str.length - 1; i >= 0; i--) {
        let digit = parseInt(str[i], 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9)
                digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}
function normalize(value, min, max) {
    return (value - min) / (max - min);
}
//# sourceMappingURL=util.js.map