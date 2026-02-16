import { ethers, TransactionResponse } from 'ethers'
import { SimpleMultisigTransactionData } from './models/SimpleMultisigTransactionData'

const erc20Abi = require('./erc20.abi.json')

export type TransactionRequest = ethers.TransactionRequest

export function getPublicAddress(privateKey: string) {
    return new ethers.Wallet(privateKey).address
}

function buildERC20TransactionData(params: {
    from: ethers.AddressLike
    to: ethers.AddressLike
    value: ethers.BigNumberish
    tokenAddress: string
}): ethers.TransactionRequest {
    const token = new ethers.Interface(erc20Abi)

    const data = token.encodeFunctionData('transfer', [params.to, params.value])

    return {
        to: params.tokenAddress,
        data,
        value: 0n,
        from: params.from
    }
}

export async function signTx(
    privateKey: string,
    tx: TransactionRequest,
    rpcUrl?: string
): Promise<string> {
    let txReq = { ...tx }
    const provider = rpcUrl ? new ethers.JsonRpcProvider(rpcUrl) : null
    const wallet = new ethers.Wallet(privateKey, provider)
    const populated = await wallet.populateTransaction(txReq)
    return wallet.signTransaction(populated)
}

export async function signERC20(
    privateKey: string,
    tx: TransactionRequest & { tokenAddress: string },
    rpcUrl?: string
): Promise<string> {
    if (!tx.from) throw new Error('Missing from')
    if (!tx.to) throw new Error('Missing to')
    if (tx.value == null) throw new Error('Missing value')

    const txReq = buildERC20TransactionData({
        from: tx.from,
        to: tx.to,
        value: tx.value,
        tokenAddress: tx.tokenAddress
    })
    const provider = rpcUrl ? new ethers.JsonRpcProvider(rpcUrl) : null
    const wallet = new ethers.Wallet(privateKey, provider)
    const populated = await wallet.populateTransaction(txReq)
    return wallet.signTransaction(populated)
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

export async function broadcastTx(
    signedTx: string,
    rpcUrl: string
): Promise<TransactionResponse> {
    const provider = new ethers.JsonRpcProvider(rpcUrl)

    return provider.broadcastTransaction(signedTx)
}
