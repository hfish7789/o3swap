import { ConnectChainType, WalletName } from './wallet';
export interface VaultWallet {
  walletName: WalletName;
  address: string;
  chain: ConnectChainType;
}
