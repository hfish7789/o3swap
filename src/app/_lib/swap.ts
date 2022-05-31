import { Network } from './network';
import { Token } from './token';
import { NeoWalletName, EthWalletName, WalletName } from './wallet';

export type TxProgress = {
  step1: { hash: string; status: 0 | 1 | 2 }; // 0 = 未开始, 1 = 进行中, 2 = 已完成
  step2: { hash: string; status: 0 | 1 | 2 }; // 0 = 未开始, 1 = 进行中, 2 = 已完成
  step3: { hash: string; status: 0 | 1 | 2 }; // 0 = 未开始, 1 = 进行中, 2 = 已完成
};

export interface SwapTransaction {
  txid: string;
  isPending: boolean;
  min: boolean;
  fromToken: Token;
  toToken: Token;
  amount: string;
  receiveAmount: string;
  progress?: TxProgress;
  isFailed?: boolean;
  walletName: WalletName;
}

export interface SwapStateType {
  neoWalletName: NeoWalletName;
  ethWalletName: EthWalletName;
  bscWalletName: EthWalletName;
  hecoWalletName: EthWalletName;
  neoAccountAddress: string;
  ethAccountAddress: string;
  bscAccountAddress: string;
  hecoAccountAddress: string;
  balances: object;
  ethBalances: object;
  bscBalances: object;
  hecoBalances: object;
  neolineNetwork: Network;
  metamaskNetworkId: number;
  transaction: SwapTransaction;
  bridgeeTransaction: SwapTransaction;
  liquidityTransaction: SwapTransaction;
}

export type TxAtPage = 'swap' | 'bridge' | 'liquidity';

export class ChainTokens {
  ETH: [];
  NEO: [];
  BSC: [];
  HECO: [];
  ALL: [];
}
