export type SimpleMultisigTransactionData = {
    types: {
        EIP712Domain: {
            name: string;
            type: string;
        }[];
        MultiSigTransaction: {
            name: string;
            type: string;
        }[];
    };
    domain: {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
        salt: string;
    };
    primaryType: string;
    message: {
        executor: string;
        nonce: number;
        gasLimit: number;
        destination: string;
        value: string;
        data: string;
    };
};
//# sourceMappingURL=SimpleMultisigTransactionData.d.ts.map