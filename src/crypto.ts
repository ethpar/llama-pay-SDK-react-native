import { ethers, TransactionResponse } from 'ethers'
import { SimpleMultisigTransactionData } from './models/SimpleMultisigTransactionData'
import { ERC20_ABI } from './erc20Abi'

export type TransactionRequest = ethers.TransactionRequest

export function getPublicAddress(privateKey: string) {
    return new ethers.Wallet(privateKey).address
}

export async function sendNative(
    privateKey: string,
    tx: TransactionRequest,
    rpcUrl?: string
): Promise<TransactionResponse> {
    let txReq = { ...tx }
    const provider = rpcUrl ? new ethers.JsonRpcProvider(rpcUrl) : null
    const wallet = new ethers.Wallet(privateKey, provider)
    return wallet.sendTransaction(txReq)
}

export async function sendERC20(
    privateKey: string,
    tx: TransactionRequest & { tokenAddress: string },
    rpcUrl?: string
): Promise<TransactionResponse> {
    if (!tx.to) throw new Error('Missing to')
    if (tx.value == null) throw new Error('Missing value')

    const provider = rpcUrl ? new ethers.JsonRpcProvider(rpcUrl) : null
    const wallet = new ethers.Wallet(privateKey, provider)

    const token = new ethers.Contract(tx.tokenAddress, ERC20_ABI, wallet)
    return token.transfer(tx.to, tx.value)
}

export async function signNativeTransfer({
    toAddress,
    amount,
    privateKey,
    rpcUrl
}: {
    toAddress: string
    amount: bigint
    privateKey: string
    rpcUrl: string
}): Promise<string> {
    const provider = new ethers.JsonRpcProvider(rpcUrl)

    const network = await provider.getNetwork()
    const wallet = new ethers.Wallet(privateKey)
    const nonce = await provider.getTransactionCount(await wallet.getAddress())

    const tx = {
        to: toAddress,
        value: amount,
        chainId: network.chainId,
        nonce: nonce,
        gasLimit: 21000n,
        maxFeePerGas: ethers.parseUnits('50', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei')
    }

    const signedTx = await wallet.signTransaction(tx)
    return signedTx
}

export async function signERC20Transfer({
    tokenAddress,
    toAddress,
    amount,
    privateKey,
    rpcUrl
}: {
    tokenAddress: string
    toAddress: string
    amount: bigint
    privateKey: string
    rpcUrl: string
}): Promise<string> {
    const provider = new ethers.JsonRpcProvider(rpcUrl)

    const network = await provider.getNetwork()
    const wallet = new ethers.Wallet(privateKey)
    const nonce = await provider.getTransactionCount(await wallet.getAddress())

    const erc20Interface = new ethers.Interface(ERC20_ABI)
    const data = erc20Interface.encodeFunctionData('transfer', [
        toAddress,
        amount
    ])

    const tx = {
        to: tokenAddress,
        value: 0n,
        data: data,
        chainId: network.chainId,
        nonce: nonce,
        gasLimit: 65000n,
        maxFeePerGas: ethers.parseUnits('50', 'gwei'),
        maxPriorityFeePerGas: ethers.parseUnits('2', 'gwei')
    }

    const signedTx = await wallet.signTransaction(tx)
    return signedTx
}

export async function signTypedData(
    privateKey: string,
    txData: SimpleMultisigTransactionData,
    rpcUrl?: string
): Promise<string> {
    const provider = rpcUrl ? new ethers.JsonRpcProvider(rpcUrl) : null
    const wallet = new ethers.Wallet(privateKey, provider)

    const signature = await wallet.signTypedData(
        txData.domain,
        { MultiSigTransaction: txData.types.MultiSigTransaction },
        {
            ...txData.message,
            value:
                txData.message.value === '0x'
                    ? BigInt(0)
                    : BigInt(txData.message.value),
            nonce: parseInt(txData.message.nonce as any)
        }
    )

    return signature
}
