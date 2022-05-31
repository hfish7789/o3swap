import { NETWORK } from './network';
export interface Token {
  symbol: string;
  logo?: string;
  assetID: string;
  amount: string;
  decimals: number;
  chain: CHAINS;
  type?: string;
  maxAmount?: string;
}
export type CHAINS = 'ALL' | 'NEO' | 'ETH' | 'BSC' | 'HECO';

//#region some token
export const SOURCE_TOKEN_SYMBOL = {
  ETH: 'ETH',
  HECO: 'HT',
  BSC: 'BNB',
};
export const ETH_SOURCE_ASSET_HASH =
  '0x0000000000000000000000000000000000000000';
export const WETH_ASSET_HASH = {
  ETH: {
    standardTokenSymbol: 'ETH',
    symbol: 'WETH',
    assetID:
      NETWORK === 'MainNet'
        ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        : '0xc778417e063141139fce010982780140aa0cd5ab',
  },
  BSC: {
    standardTokenSymbol: 'BNB',
    symbol: 'WBNB',
    assetID:
      NETWORK === 'MainNet'
        ? '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
        : '0x094616f0bdfb0b526bd735bf66eca0ad254ca81f',
  },
  HECO: {
    standardTokenSymbol: 'HT',
    symbol: 'WHT',
    assetID:
      NETWORK === 'MainNet'
        ? '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
        : '0x2550d9439a1c19f91f19316b5bd343180c12e315',
  },
};
export const ETH_PUSDT_ASSET = {
  ETH: {
    assetID:
      NETWORK === 'MainNet'
        ? '0x061a87Aac7695b9cf9482043175fd3bE3374AB66'
        : '0x63799851696CDE43c2305dccd7208a03272BA591',
    decimals: 6,
  },
  BSC: {
    assetID:
      NETWORK === 'MainNet'
        ? '0xBFC0457548BB90D54123a71a7310BaDa8f4662c0'
        : '0x78Ec09343122737925f9839d7794de49FeB6B083',
    decimals: 18,
  },
  HECO: {
    assetID:
      NETWORK === 'MainNet'
        ? '0x0926B2DB9D053E0022419093CCd57b92301fB736'
        : '0xbdd265FC4D5b7E7a937608B91EDAFc38F27E4479',
    decimals: NETWORK === 'MainNet' ? 8 : 18,
  },
};
// NEO swap standard token(mainnet)
export const FUSDT_ASSET_HASH =
  NETWORK === 'MainNet'
    ? '1aa893170b1babfefba973e9a9183990d792c2a7'
    : 'b55026d49bb5b585e1d2f9820efdc969f4b8cde6';
export const NNEO_TOKEN: Token = {
  assetID:
    NETWORK === 'MainNet'
      ? 'f46719e2d16bf50cddcef9d4bbfece901f73cbb6'
      : '17da3881ab2d050fea414c80b3fa8324d756f60e',
  symbol: 'nNEO',
  decimals: 8,
  amount: '0',
  chain: 'NEO',
  logo:
    NETWORK === 'MainNet'
      ? `https://img.o3.network/logo/neo2/f46719e2d16bf50cddcef9d4bbfece901f73cbb6.png`
      : 'https://img.o3.network/logo/neo2/17da3881ab2d050fea414c80b3fa8324d756f60e.png',
};
export const NEO_TOKEN: Token = {
  assetID: '0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
  symbol: 'NEO',
  decimals: 0,
  amount: '0',
  chain: 'NEO',
  logo:
    'https://img.o3.network/logo/neo2/0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b.png',
};
//#endregion

export const CONST_BRIDGE_TOKENS: Token[] = [
  {
    symbol: 'WBTC',
    decimals: 8,
    assetID: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    chain: 'ETH',
    type: 'ERC-20',
    amount: '0',
    logo:
      'https://img.o3.network/logo/eth/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png',
  },
  {
    symbol: 'ETH',
    decimals: 18,
    assetID: '0x0000000000000000000000000000000000000000',
    chain: 'ETH',
    amount: '0',
    logo:
      'https://img.o3.network/logo/eth/0x0000000000000000000000000000000000000000.png',
  },
];

//#region liquidity page
export const USD_TOKENS: Token[] = [
  {
    assetID:
      NETWORK === 'MainNet'
        ? '0xdac17f958d2ee523a2206206994597c13d831ec7'
        : '0x74a7f2a3afa8b0cb577985663b5811901a860619',
    symbol: 'USDT',
    decimals: 6,
    amount: '0',
    chain: 'ETH',
    type: 'ERC-20',
    logo:
      NETWORK === 'MainNet'
        ? `https://img.o3.network/logo/eth/0xdac17f958d2ee523a2206206994597c13d831ec7.png`
        : 'https://img.o3.network/logo/eth/0x74a7f2a3afa8b0cb577985663b5811901a860619.png',
  },
  {
    assetID:
      NETWORK === 'MainNet'
        ? '0xe9e7cea3dedca5984780bafc599bd69add087d56'
        : '0x74a7f2a3afa8b0cb577985663b5811901a860619',
    symbol: NETWORK === 'MainNet' ? 'BUSD' : 'BUSDT',
    decimals: 18,
    amount: '0',
    chain: 'BSC',
    type: 'BEP-20',
    logo:
      NETWORK === 'MainNet'
        ? `https://img.o3.network/logo/bsc/0xe9e7cea3dedca5984780bafc599bd69add087d56.png`
        : 'https://img.o3.network/logo/bsc/0x74a7f2a3afa8b0cb577985663b5811901a860619.png',
  },
  {
    assetID:
      NETWORK === 'MainNet'
        ? '0x0298c2b32eae4da002a15f36fdf7615bea3da047'
        : '0x77e8ebd5b2d7cd984e6ae05a809409c795bf9b04',
    symbol: NETWORK === 'MainNet' ? 'HUSD' : 'HUSDT',
    decimals: NETWORK === 'MainNet' ? 8 : 18,
    amount: '0',
    chain: 'HECO',
    type: 'HRC-20',
    logo:
      NETWORK === 'MainNet'
        ? `https://img.o3.network/logo/heco/0x0298c2b32eae4da002a15f36fdf7615bea3da047.png`
        : 'https://img.o3.network/logo/heco/0x77e8ebd5b2d7cd984e6ae05a809409c795bf9b04.png',
  },
];
export const LP_TOKENS: Token[] = [
  {
    assetID:
      NETWORK === 'MainNet'
        ? '0x61415f9060b1a81bbda3b79baa11acd27cddd83d'
        : '0xd5d63dce45e0275ca76a8b2e9bd8c11679a57d0d',
    symbol: 'LP',
    decimals: 18,
    amount: '0',
    chain: 'ETH',
    logo: '/assets/images/tokens/lp-eth.png',
  },
  {
    assetID:
      NETWORK === 'MainNet'
        ? '0xAEA207661e36F4f51468B0d8a0b78Da521FA9D36'
        : '0xd5d63dce45e0275ca76a8b2e9bd8c11679a57d0d',
    symbol: 'LP',
    decimals: 18,
    amount: '0',
    chain: 'BSC',
    logo: '/assets/images/tokens/lp-bsc.png',
  },
  {
    assetID:
      NETWORK === 'MainNet'
        ? '0x2Ec96Bb06E6af8C8Ac20f93C34ea2ab663E40d62'
        : '0x74a7f2a3afa8b0cb577985663b5811901a860619',
    symbol: 'LP',
    decimals: 18,
    amount: '0',
    chain: 'HECO',
    logo: '/assets/images/tokens/lp-heco.png',
  },
];
//#endregion

//#region chain tokens
const CHAIN_TOKENS_MAINNET = {
  ETH: [
    {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      chain: 'ETH',
    },
    {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      chain: 'ETH',
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      chain: 'ETH',
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      chain: 'ETH',
    },
    {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      decimals: 18,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      chain: 'ETH',
    },
    {
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      chain: 'ETH',
    },
    {
      name: 'Binance USD',
      symbol: 'BUSD',
      decimals: 18,
      address: '0x4fabb145d64652a948d72533023f6e7a623c7c53',
      chain: 'ETH',
    },
    {
      name: 'TrueUSD',
      symbol: 'TUSD',
      decimals: 18,
      address: '0x0000000000085d4780b73119b644ae5ecd22b376',
      chain: 'ETH',
    },
    {
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      chain: 'ETH',
    },
    {
      name: 'Aave Token',
      symbol: 'AAVE',
      decimals: 18,
      address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
      chain: 'ETH',
    },
    {
      name: '1INCH Token',
      symbol: '1INCH',
      decimals: 18,
      address: '0x111111111117dc0aa78b770fa6a738034120c302',
      chain: 'ETH',
    },
    {
      name: 'Compound',
      symbol: 'COMP',
      decimals: 18,
      address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
      chain: 'ETH',
    },
    {
      name: 'Curve DAO Token',
      symbol: 'CRV',
      decimals: 18,
      address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
      chain: 'ETH',
    },
    {
      name: 'Enjin Coin',
      symbol: 'ENJ',
      decimals: 18,
      address: '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
      chain: 'ETH',
    },
    {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      address: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
      chain: 'ETH',
    },
    {
      name: 'HuobiToken',
      symbol: 'HT',
      decimals: 18,
      address: '0x6f259637dcd74c767781e37bc6133cd6a68aa161',
      chain: 'ETH',
    },
    {
      name: 'ChainLink Token',
      symbol: 'LINK',
      decimals: 18,
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      chain: 'ETH',
    },
    {
      name: 'Maker',
      symbol: 'MKR',
      decimals: 18,
      address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
      chain: 'ETH',
    },
    {
      name: 'OMGToken',
      symbol: 'OMG',
      decimals: 18,
      address: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
      chain: 'ETH',
    },
    {
      name: 'SushiToken',
      symbol: 'SUSHI',
      decimals: 18,
      address: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
      chain: 'ETH',
    },
    {
      name: 'yearn.finance',
      symbol: 'YFI',
      decimals: 18,
      address: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
      chain: 'ETH',
    },
    {
      name: '0x Protocol Token',
      symbol: 'ZRX',
      decimals: 18,
      address: '0xe41d2489571d322189246dafa5ebde1f4699f498',
      chain: 'ETH',
    },
    {
      name: 'Bancor Network Token',
      symbol: 'BNT',
      decimals: 18,
      address: '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
      chain: 'ETH',
    },
    {
      name: 'Graph Token',
      symbol: 'GRT',
      decimals: 18,
      address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
      chain: 'ETH',
    },
    {
      name: 'Synthetix Network Token',
      symbol: 'SNX',
      decimals: 18,
      address: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
      chain: 'ETH',
    },
    {
      name: 'Matic Token',
      symbol: 'MATIC',
      decimals: 18,
      address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
      chain: 'ETH',
    },
    {
      name: 'LoopringCoin V2',
      symbol: 'LRC',
      decimals: 18,
      address: '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
      chain: 'ETH',
    },
    {
      name: 'Kyber Network Crystal',
      symbol: 'KNC',
      decimals: 18,
      address: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
      chain: 'ETH',
    },
    {
      name: 'DODO bird',
      symbol: 'DODO',
      decimals: 18,
      address: '0x43dfc4159d86f3a37a5a4b3d4580b888ad7d4ddd',
      chain: 'ETH',
    },
    {
      name: 'SKALE',
      symbol: 'SKL',
      decimals: 18,
      address: '0x00c83aecc790e8a4453e5dd3b0b4b3680501a7a7',
      chain: 'ETH',
    },
    {
      name: 'BandToken',
      symbol: 'BAND',
      decimals: 18,
      address: '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
      chain: 'ETH',
    },
    {
      name: 'Perpetual',
      symbol: 'PERP',
      decimals: 18,
      address: '0xbc396689893d065f41bc2c6ecbee5e0085233447',
      chain: 'ETH',
    },
  ],
  BSC: [
    {
      name: 'Wrapped BNB',
      symbol: 'WBNB',
      decimals: 18,
      address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      chain: 'BSC',
    },
    {
      name: 'BUSD Token',
      symbol: 'BUSD',
      decimals: 18,
      address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      chain: 'BSC',
    },
    {
      name: 'PancakeSwap Token',
      symbol: 'Cake',
      decimals: 18,
      address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      chain: 'BSC',
    },
    {
      name: 'Ethereum Token',
      symbol: 'ETH',
      decimals: 18,
      address: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      chain: 'BSC',
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 18,
      address: '0x55d398326f99059ff775485246999027b3197955',
      chain: 'BSC',
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      chain: 'BSC',
    },
    {
      name: 'Wrapped UST Token',
      symbol: 'UST',
      decimals: 18,
      address: '0x23396cf899ca06c4472205fc903bdb4de249d6fc',
      chain: 'BSC',
    },
    {
      name: 'yearn.finance',
      symbol: 'YFI',
      decimals: 18,
      address: '0x88f1a5ae2a3bf98aeaf342d26b30a79438c9142e',
      chain: 'BSC',
    },
    {
      name: 'Cardano Token',
      symbol: 'ADA',
      decimals: 18,
      address: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
      chain: 'BSC',
    },
    {
      name: 'ALICE',
      symbol: 'ALICE',
      decimals: 6,
      address: '0xe7b91602ce96a537cb729f484b8ddb3c1fecbb45',
      chain: 'BSC',
    },
    {
      name: 'AlphaToken',
      symbol: 'ALPHA',
      decimals: 18,
      address: '0xa1faa113cbe53436df28ff0aee54275c13b40975',
      chain: 'BSC',
    },
    {
      name: 'Cosmos Token',
      symbol: 'ATOM',
      decimals: 18,
      address: '0x0eb3a705fc54725037cc9e008bdede697f62f335',
      chain: 'BSC',
    },
  ],
  HECO: [
    {
      name: 'Heco-Peg HUSD Token',
      symbol: 'HUSD',
      decimals: 18,
      address: '0x0298c2b32eae4da002a15f36fdf7615bea3da047',
      chain: 'HECO',
    },
  ],
  NEO: [
    {
      name: 'NEO',
      symbol: 'NEO',
      decimals: 0,
      address:
        '0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
      chain: 'NEO',
    },
    {
      name: 'NEO NEP5',
      symbol: 'nNEO',
      decimals: 8,
      address: 'f46719e2d16bf50cddcef9d4bbfece901f73cbb6',
      chain: 'NEO',
    },
    {
      name: 'pnWETH NEP5',
      symbol: 'pnWETH',
      decimals: 12,
      address: '0df563008be710f3e0130208f8adc95ed7e5518d',
      chain: 'NEO',
    },
    {
      name: 'pONT NEP5',
      symbol: 'pONT',
      decimals: 9,
      address: 'c277117879af3197fbef92c71e95800aa3b89d9a',
      chain: 'NEO',
    },
    {
      name: 'pnUSDT NEP5',
      symbol: 'pnUSDT',
      decimals: 6,
      address: '282e3340d5a1cd6a461d5f558d91bc1dbc02a07b',
      chain: 'NEO',
    },
    {
      name: 'pnWBTC NEP5',
      symbol: 'pnWBTC',
      decimals: 8,
      address: '534dcac35b0dfadc7b2d716a7a73a7067c148b37',
      chain: 'NEO',
    },
    {
      name: 'Flamingo',
      symbol: 'FLM',
      decimals: 8,
      address: '4d9eab13620fe3569ba3b0e56e2877739e4145e3',
      chain: 'NEO',
    },
    {
      name: 'Switcheo',
      symbol: 'SWTH',
      decimals: 8,
      address: '3e09e602eeeb401a2fec8e8ea137d59aae54a139',
      chain: 'NEO',
    },
    {
      name: 'fWETH NEP5',
      symbol: 'fWETH',
      decimals: 12,
      address: '179a0db04a130dec6060cd9569d7ee7d7e8eccdc',
      chain: 'NEO',
    },
    {
      name: 'fWBTC NEP5',
      symbol: 'fWBTC',
      decimals: 8,
      address: '36a8f669d55bbfe99a3e9f7953745736bfa5453c',
      chain: 'NEO',
    },
    {
      name: 'fUSDT NEP5',
      symbol: 'fUSDT',
      decimals: 6,
      address: '1aa893170b1babfefba973e9a9183990d792c2a7',
      chain: 'NEO',
    },
  ],
  recommend: [
    {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      chain: 'ETH',
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      chain: 'ETH',
    },
    {
      name: 'NEO NEP5',
      symbol: 'nNEO',
      decimals: 8,
      address: 'f46719e2d16bf50cddcef9d4bbfece901f73cbb6',
      chain: 'NEO',
    },
    {
      name: 'BUSD Token',
      symbol: 'BUSD',
      decimals: 18,
      address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      chain: 'BSC',
    },
    {
      name: 'Heco-Peg USDT Token',
      symbol: 'USDT',
      decimals: 18,
      address: '0xa71edc38d189767582c38a3145b5873052c3e47a',
      chain: 'HECO',
    },
  ],
};

const CHAIN_TOKENS_TESTNET = {
  ETH: [
    {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      chain: 'ETH',
    },
    {
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
      address: '0x74a7f2a3afa8b0cb577985663b5811901a860619',
      chain: 'ETH',
    },
    {
      name: 'DAI',
      symbol: 'DAI',
      decimals: 18,
      address: '0xad6d458402f60fd3bd25163575031acdce07538d',
      chain: 'ETH',
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: '0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c',
      chain: 'ETH',
    },
    {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      address: '0xc778417e063141139fce010982780140aa0cd5ab',
      chain: 'ETH',
    },
  ],
  BSC: [
    {
      name: 'BUSDT',
      symbol: 'BUSDT',
      decimals: 18,
      address: '0x74a7f2a3afa8b0cb577985663b5811901a860619',
      chain: 'BSC',
    },
  ],
  HECO: [
    {
      name: 'HUSDT',
      symbol: 'HUSDT',
      decimals: 18,
      address: '0x77e8ebd5b2d7cd984e6ae05a809409c795bf9b04',
      chain: 'HECO',
    },
  ],
  NEO: [
    {
      name: 'NEO',
      symbol: 'NEO',
      decimals: 0,
      address:
        '0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b',
      chain: 'NEO',
    },
    {
      name: 'NEP5 NEO',
      symbol: 'nNEO',
      decimals: 8,
      address: '17da3881ab2d050fea414c80b3fa8324d756f60e',
      chain: 'NEO',
    },
    {
      name: 'Neo Ether',
      symbol: 'pnETH',
      decimals: 12,
      address: '23535b6fd46b8f867ed010bab4c2bd8ef0d0c64f',
      chain: 'NEO',
    },
    {
      name: 'Neo ONTD',
      symbol: 'pONTD',
      decimals: 9,
      address: '658cabf9c1f71ba0fa64098a7c17e52b94046ece',
      chain: 'NEO',
    },
    {
      name: 'Neo USDT',
      symbol: 'pnUSDT',
      decimals: 6,
      address: 'b8f78d43ea9fe006c85a26b9aff67bcf69dd4fe1',
      chain: 'NEO',
    },
    {
      name: 'Neo WBTC',
      symbol: 'pnWBTC',
      decimals: 8,
      address: '69c57a716567a0f6910a0b3c1d4508fa163eb927',
      chain: 'NEO',
    },
    {
      name: 'Flamingo',
      symbol: 'FLM',
      decimals: 8,
      address: '083ea8071188c7fe5b5e4af96ded222670d76663',
      chain: 'NEO',
    },
    {
      name: 'Switcheo',
      symbol: 'SWTH',
      decimals: 8,
      address: '806f018810c6f74c22d1b27fe4da2feec7298c58',
      chain: 'NEO',
    },
    {
      name: 'FWETH NEP5',
      symbol: 'FWETH',
      decimals: 12,
      address: '9b2446d658859a96a7c40204d027bf5f9ca896e5',
      chain: 'NEO',
    },
    {
      name: 'fWBTC NEP5',
      symbol: 'fWBTC',
      decimals: 8,
      address: 'aa94bb6ff87660da94bbe57c34e0373163b7ac93',
      chain: 'NEO',
    },
    {
      name: 'fUSDT NEP5',
      symbol: 'fUSDT',
      decimals: 6,
      address: 'b55026d49bb5b585e1d2f9820efdc969f4b8cde6',
      chain: 'NEO',
    },
  ],
  recommend: [
    {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      address: '0x0000000000000000000000000000000000000000',
      chain: 'ETH',
    },
    {
      name: 'USDT',
      symbol: 'USDT',
      decimals: 6,
      address: '0x74a7f2a3afa8b0cb577985663b5811901a860619',
      chain: 'ETH',
    },
    {
      name: 'NEP5 NEO',
      symbol: 'nNEO',
      decimals: 8,
      address: '17da3881ab2d050fea414c80b3fa8324d756f60e',
      chain: 'NEO',
    },
    {
      name: 'BUSDT',
      symbol: 'BUSDT',
      decimals: 18,
      address: '0x74a7f2a3afa8b0cb577985663b5811901a860619',
      chain: 'BSC',
    },
    {
      name: 'HUSDT',
      symbol: 'HUSDT',
      decimals: 18,
      address: '0x77e8ebd5b2d7cd984e6ae05a809409c795bf9b04',
      chain: 'HECO',
    },
  ],
};

export const CHAIN_TOKENS =
  NETWORK === 'MainNet' ? CHAIN_TOKENS_MAINNET : CHAIN_TOKENS_TESTNET;
//#endregion
