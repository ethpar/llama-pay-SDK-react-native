import { ethers, TransactionResponse } from 'ethers'
import { SimpleMultisigTransactionData } from './models/SimpleMultisigTransactionData'
import { ERC20_ABI } from './erc20Abi'

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
    const token = new ethers.Interface(ERC20_ABI)

    const data = token.encodeFunctionData('transfer', [params.to, params.value])

    return {
        to: params.tokenAddress,
        data,
        value: 0n,
        from: params.from
    }
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
