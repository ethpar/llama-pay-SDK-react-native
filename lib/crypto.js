"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicAddress = getPublicAddress;
exports.sendNative = sendNative;
exports.sendERC20 = sendERC20;
exports.signNativeTransfer = signNativeTransfer;
exports.signERC20Transfer = signERC20Transfer;
exports.signTypedData = signTypedData;
exports.sha256 = sha256;
const ethers_1 = require("ethers");
const erc20Abi_1 = require("./erc20Abi");
function getPublicAddress(privateKey) {
    return new ethers_1.ethers.Wallet(privateKey).address;
}
async function sendNative(privateKey, tx, rpcUrl) {
    let txReq = { ...tx };
    const provider = rpcUrl ? new ethers_1.ethers.JsonRpcProvider(rpcUrl) : null;
    const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
    return wallet.sendTransaction(txReq);
}
async function sendERC20(privateKey, tx, rpcUrl) {
    if (!tx.to)
        throw new Error('Missing to');
    if (tx.value == null)
        throw new Error('Missing value');
    const provider = rpcUrl ? new ethers_1.ethers.JsonRpcProvider(rpcUrl) : null;
    const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
    const token = new ethers_1.ethers.Contract(tx.tokenAddress, erc20Abi_1.ERC20_ABI, wallet);
    return token.transfer(tx.to, tx.value);
}
async function signNativeTransfer({ toAddress, amount, privateKey, rpcUrl }) {
    const provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
    const network = await provider.getNetwork();
    const wallet = new ethers_1.ethers.Wallet(privateKey);
    const nonce = await provider.getTransactionCount(await wallet.getAddress());
    const tx = {
        to: toAddress,
        value: amount,
        chainId: network.chainId,
        nonce: nonce,
        gasLimit: 21000n,
        maxFeePerGas: ethers_1.ethers.parseUnits('50', 'gwei'),
        maxPriorityFeePerGas: ethers_1.ethers.parseUnits('2', 'gwei')
    };
    const signedTx = await wallet.signTransaction(tx);
    return signedTx;
}
async function signERC20Transfer({ tokenAddress, toAddress, amount, privateKey, rpcUrl }) {
    const provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
    const network = await provider.getNetwork();
    const wallet = new ethers_1.ethers.Wallet(privateKey);
    const nonce = await provider.getTransactionCount(await wallet.getAddress());
    const erc20Interface = new ethers_1.ethers.Interface(erc20Abi_1.ERC20_ABI);
    const data = erc20Interface.encodeFunctionData('transfer', [
        toAddress,
        amount
    ]);
    const tx = {
        to: tokenAddress,
        value: 0n,
        data: data,
        chainId: network.chainId,
        nonce: nonce,
        gasLimit: 65000n,
        maxFeePerGas: ethers_1.ethers.parseUnits('50', 'gwei'),
        maxPriorityFeePerGas: ethers_1.ethers.parseUnits('2', 'gwei')
    };
    const signedTx = await wallet.signTransaction(tx);
    return signedTx;
}
async function signTypedData(privateKey, txData, rpcUrl) {
    const provider = rpcUrl ? new ethers_1.ethers.JsonRpcProvider(rpcUrl) : null;
    const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
    const signature = await wallet.signTypedData(txData.domain, { MultiSigTransaction: txData.types.MultiSigTransaction }, {
        ...txData.message,
        value: txData.message.value === '0x'
            ? BigInt(0)
            : BigInt(txData.message.value),
        nonce: parseInt(txData.message.nonce)
    });
    return signature;
}
async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    return hashHex;
}
//# sourceMappingURL=crypto.js.map