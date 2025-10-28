export type HDWallet = {
    id: string;
    name: string;
    mnemonic: string;
};
export type Account = {
    id: string;
    name: string;
    address: string;
    type: 'hd' | 'single';
    walletId?: string;
    privateKey?: string;
    derivationPath?: string;
};
//# sourceMappingURL=Wallet.d.ts.map