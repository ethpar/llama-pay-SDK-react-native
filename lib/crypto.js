"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicAddress = getPublicAddress;
exports.sendNative = sendNative;
exports.sendERC20 = sendERC20;
exports.signTypedData = signTypedData;
const ethers_1 = require("ethers");
const erc20Abi_1 = require("./erc20Abi");
function getPublicAddress(privateKey) {
    return new ethers_1.ethers.Wallet(privateKey).address;
}
function buildERC20TransactionData(params) {
    const token = new ethers_1.ethers.Interface(erc20Abi_1.ERC20_ABI);
    const data = token.encodeFunctionData('transfer', [params.to, params.value]);
    return {
        to: params.tokenAddress,
        data,
        value: 0n,
        from: params.from
    };
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
//# sourceMappingURL=crypto.js.map