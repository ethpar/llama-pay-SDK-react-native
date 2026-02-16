"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicAddress = getPublicAddress;
exports.signTx = signTx;
exports.signERC20 = signERC20;
exports.signTypedData = signTypedData;
exports.broadcastTx = broadcastTx;
const ethers_1 = require("ethers");
const erc20Abi = require('./erc20.abi.json');
function getPublicAddress(privateKey) {
    return new ethers_1.ethers.Wallet(privateKey).address;
}
function buildERC20TransactionData(params) {
    const token = new ethers_1.ethers.Interface(erc20Abi);
    const data = token.encodeFunctionData('transfer', [params.to, params.value]);
    return {
        to: params.tokenAddress,
        data,
        value: 0n,
        from: params.from
    };
}
async function signTx(privateKey, tx, rpcUrl) {
    let txReq = { ...tx };
    const provider = rpcUrl ? new ethers_1.ethers.JsonRpcProvider(rpcUrl) : null;
    const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
    const populated = await wallet.populateTransaction(txReq);
    return wallet.signTransaction(populated);
}
async function signERC20(privateKey, tx, rpcUrl) {
    if (!tx.from)
        throw new Error('Missing from');
    if (!tx.to)
        throw new Error('Missing to');
    if (tx.value == null)
        throw new Error('Missing value');
    const txReq = buildERC20TransactionData({
        from: tx.from,
        to: tx.to,
        value: tx.value,
        tokenAddress: tx.tokenAddress
    });
    const provider = rpcUrl ? new ethers_1.ethers.JsonRpcProvider(rpcUrl) : null;
    const wallet = new ethers_1.ethers.Wallet(privateKey, provider);
    const populated = await wallet.populateTransaction(txReq);
    return wallet.signTransaction(populated);
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
async function broadcastTx(signedTx, rpcUrl) {
    const provider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
    return provider.broadcastTransaction(signedTx);
}
//# sourceMappingURL=crypto.js.map