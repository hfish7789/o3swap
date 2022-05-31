import { NETWORK } from './network';

export const NEO_NNEO_CONTRACT_HASH =
  NETWORK === 'MainNet'
    ? 'f46719e2d16bf50cddcef9d4bbfece901f73cbb6'
    : '17da3881ab2d050fea414c80b3fa8324d756f60e';

export const NEO_SWAP_CONTRACT_HASH =
  NETWORK === 'MainNet'
    ? '89fa00d894c9a1475f8f94e84c79724b3faf64db'
    : '812d7291e2f0c89255cf355c1027872257d1ca37';

// from ETH (usdt, busd, husd 互转，添加去除流动性)
export const ETH_CROSS_SWAP_CONTRACT_HASH = {
  ETH:
    NETWORK === 'MainNet'
      ? '0x02e20ca05e38cbdf1a6235a7acdd34efc0434caa'
      : '0x8Baa27e659F55249bb36113346980BFFABC53AeF',
  BSC:
    NETWORK === 'MainNet'
      ? '0x3ec481143d688442E581aD7116Bf1ECC76669cfa'
      : '0x51FfD5196e3945c4CE25101eEB7f4062b97B9A1A',
  HECO:
    NETWORK === 'MainNet'
      ? '0x70f4d1176f9276ab4B31658f58F7473858F2b550'
      : '0x0488ADd7e3D4C58acb8DF7c487dAfC48e3224833',
};

export const SWAP_CONTRACT_CHAIN_ID = {
  BSC: NETWORK === 'MainNet' ? 6 : 79,
  HECO: NETWORK === 'MainNet' ? 7 : 7,
  ETH: NETWORK === 'MainNet' ? 2 : 2,
};

export const POLY_HOST_ADDRESS =
  NETWORK === 'MainNet'
    ? '0xa6157DaBDda80F8c956962AB7739f17F54BAAB7F'
    : '0x0687e6392de735B83ed2808797c92051B5dF5618';

export const AGGREGATOR_CONTRACT = {
  BSC: {
    Pancakeswap:
      NETWORK === 'MainNet'
        ? '0xeCBF96Dd4fBfD666A849252EC022Bf311A4cA002'
        : '0xA78a195E6DCDa3eC2074CF8d0b8392602783107B',
  },
  ETH: {
    Uniswap:
      NETWORK === 'MainNet'
        ? '0x96cFA408CA039d9Afea0b8227be741Ef52e8a037'
        : '0x1296300290e32a24E0c8d3428DAcB8aC0f3B67d3',
  },
  HECO: {
    'Mdex-Heco':
      NETWORK === 'MainNet'
        ? '0xecbf96dd4fbfd666a849252ec022bf311a4ca002'
        : '0x77ddcf68bece64049adf7a261a432b344885381f',
  },
};
