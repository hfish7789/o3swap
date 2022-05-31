import { NETWORK } from './network';

export type ConnectChainType = 'ETH' | 'NEO' | 'BSC' | 'HECO';
export type WalletName = 'O3' | 'NeoLine' | 'MetaMask';
export type NeoWalletName = 'O3' | 'NeoLine';
export type EthWalletName = 'O3' | 'MetaMask';

export const METAMASK_CHAIN_ID = {
  BSC: NETWORK === 'MainNet' ? 56 : 97,
  HECO: NETWORK === 'MainNet' ? 128 : 256,
  ETH: NETWORK === 'MainNet' ? 1 : 3,
};

export const METAMASK_CHAIN =
  NETWORK === 'MainNet'
    ? {
        56: 'BSC',
        128: 'HECO',
        1: 'ETH',
      }
    : {
        97: 'BSC',
        256: 'HECO',
        3: 'ETH',
      };

export interface Wallet {
  name: WalletName;
  logo: string;
}

export interface NeoWallet extends Wallet {
  name: NeoWalletName;
}
export interface EthWallet extends Wallet {
  name: EthWalletName;
}
export const NEO_WALLETS: NeoWallet[] = [
  {
    name: 'O3',
    logo: '/assets/images/logo-O3.png',
  },
  {
    name: 'NeoLine',
    logo: '/assets/images/logo-NeoLine.png',
  },
];

export const ETH_WALLETS: EthWallet[] = [
  {
    name: 'MetaMask',
    logo: '/assets/images/logo-MetaMask.png',
  },
  {
    name: 'O3',
    logo: '/assets/images/logo-O3.png',
  },
];

export const BSC_WALLETS: EthWallet[] = ETH_WALLETS;

export const HECO_WALLETS: EthWallet[] = ETH_WALLETS;
