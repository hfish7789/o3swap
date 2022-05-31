import { NETWORK } from './network';

export const POLY_TX_PAGES_PREFIX =
  NETWORK === 'MainNet'
    ? 'https://explorer.poly.network/tx'
    : 'https://explorer.poly.network/testnet/tx';

export const TX_PAGES_PREFIX = {
  NEO:
    NETWORK === 'MainNet'
      ? 'https://neotube.io/transaction/0x'
      : 'https://testnet.neotube.io/transaction/0x',
  ETH:
    NETWORK === 'MainNet'
      ? 'https://etherscan.io/tx/0x'
      : 'https://ropsten.etherscan.io/tx/0x',
  BSC:
    NETWORK === 'MainNet'
      ? 'https://bscscan.com/tx/0x'
      : 'https://testnet.bscscan.com/tx/0x',
  HECO:
    NETWORK === 'MainNet'
      ? 'https://hecoinfo.com/tx/0x'
      : 'https://testnet.hecoinfo.com/tx/0x',
};
