import {
  SwapStateType,
  UPDATE_NEO_ACCOUNT,
  UPDATE_NEO_BALANCES,
  RESET_NEO_BALANCES,
  UPDATE_ETH_WALLET_NAME,
  UPDATE_NEO_WALLET_NAME,
  UPDATE_ETH_ACCOUNT,
  UPDATE_METAMASK_NETWORK_ID,
  UPDATE_NEOLINE_NETWORK,
  UPDATE_PENDING_TX,
  UPDATE_BSC_ACCOUNT,
  UPDATE_BSC_WALLET_NAME,
  UPDATE_HECO_ACCOUNT,
  UPDATE_HECO_WALLET_NAME,
  RESET_ETH_BALANCES,
  UPDATE_ETH_BALANCES,
  RESET_BSC_BALANCES,
  RESET_HECO_BALANCES,
  UPDATE_BSC_BALANCES,
  UPDATE_HECO_BALANCES,
  UPDATE_BRIDGE_PENDING_TX,
  UPDATE_LIQUIDITY_PENDING_TX,
  NNEO_TOKEN,
} from '@lib';

const initialState: SwapStateType = {
  neoWalletName: null,
  ethWalletName: null,
  bscWalletName: null,
  hecoWalletName: null,
  neoAccountAddress: null,
  ethAccountAddress: null,
  bscAccountAddress: null,
  hecoAccountAddress: null,
  balances: {}, // neo 链连接钱包的balances
  ethBalances: {},
  bscBalances: {},
  hecoBalances: {},
  neolineNetwork: null,
  metamaskNetworkId: null,
  transaction: null,
  bridgeeTransaction: null,
  liquidityTransaction: null,
  // transaction: {
  //   txid: '',
  //   isPending: false,
  //   isFailed: false,
  //   min: true,
  //   fromToken: NNEO_TOKEN,
  //   toToken: NNEO_TOKEN,
  //   amount: '100',
  //   receiveAmount: '1000',
  // },
  // bridgeeTransaction: {
  //   txid: '0f4787014a5442fc02843dc376548fa7a4dd400a92850f783873b034d84dccd5',
  //   isPending: false,
  //   isFailed: true,
  //   min: false,
  //   fromToken: NNEO_TOKEN,
  //   toToken: NNEO_TOKEN,
  //   amount: '1',
  //   receiveAmount: '1',
  //   progress: {
  //     step1: { hash: '', status: 1 },
  //     step2: { hash: '', status: 0 },
  //     step3: { hash: '', status: 0 },
  //   },
  // },
  // liquidityTransaction: {
  //   txid: '0f4787014a5442fc02843dc376548fa7a4dd400a92850f783873b034d84dccd5',
  //   isPending: false,
  //   min: false,
  //   fromToken: NNEO_TOKEN,
  //   toToken: NNEO_TOKEN,
  //   amount: '1',
  //   receiveAmount: '0.0001'
  // },
};

export default function swap(state = initialState, action): any {
  switch (action.type) {
    case UPDATE_NEO_WALLET_NAME:
      setSessionStorage('neoWalletName', action.data);
      return { ...state, neoWalletName: action.data };
    case UPDATE_ETH_WALLET_NAME:
      setSessionStorage('ethWalletName', action.data);
      return { ...state, ethWalletName: action.data };
    case UPDATE_BSC_WALLET_NAME:
      setSessionStorage('bscWalletName', action.data);
      return { ...state, bscWalletName: action.data };
    case UPDATE_HECO_WALLET_NAME:
      setSessionStorage('hecoWalletName', action.data);
      return { ...state, hecoWalletName: action.data };

    case UPDATE_NEO_ACCOUNT:
      return { ...state, neoAccountAddress: action.data };
    case UPDATE_ETH_ACCOUNT:
      return { ...state, ethAccountAddress: action.data };
    case UPDATE_BSC_ACCOUNT:
      return { ...state, bscAccountAddress: action.data };
    case UPDATE_HECO_ACCOUNT:
      return { ...state, hecoAccountAddress: action.data };

    case UPDATE_NEO_BALANCES:
      return { ...state, balances: action.data };
    case RESET_NEO_BALANCES:
      return { ...state, balances: {} };

    case UPDATE_ETH_BALANCES:
      return { ...state, ethBalances: action.data };
    case RESET_ETH_BALANCES:
      return { ...state, ethBalances: {} };

    case UPDATE_BSC_BALANCES:
      return { ...state, bscBalances: action.data };
    case RESET_BSC_BALANCES:
      return { ...state, bscBalances: {} };

    case UPDATE_HECO_BALANCES:
      return { ...state, hecoBalances: action.data };
    case RESET_HECO_BALANCES:
      return { ...state, hecoBalances: {} };

    case UPDATE_NEOLINE_NETWORK:
      return { ...state, neolineNetwork: action.data };
    case UPDATE_METAMASK_NETWORK_ID:
      return { ...state, metamaskNetworkId: action.data };

    case UPDATE_PENDING_TX:
      setlocalStorage('transaction', action.data);
      return { ...state, transaction: action.data };
    case UPDATE_BRIDGE_PENDING_TX:
      setlocalStorage('bridgeeTransaction', action.data);
      return { ...state, bridgeeTransaction: action.data };
    case UPDATE_LIQUIDITY_PENDING_TX:
      setlocalStorage('liquidityTransaction', action.data);
      return { ...state, liquidityTransaction: action.data };
    default:
      return state;
  }
}

function setSessionStorage(key: string, value: string): void {
  sessionStorage.setItem(key, value);
}

function setlocalStorage(key: string, value: string): void {
  localStorage.setItem(key, JSON.stringify(value));
}
