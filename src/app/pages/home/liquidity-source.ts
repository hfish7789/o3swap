interface SourceItem {
  name: string;
  url: string;
  logo: string;
}
interface LiquiditySourceType {
  eth: SourceItem[];
  bsc: SourceItem[];
  neo: SourceItem[];
  heco: SourceItem[];
}
const logoPrefix = '/assets/images/home/exchanges/';
const ethSource: SourceItem[] = [
  {
    name: 'Uniswap',
    url: 'https://uniswap.org/',
    logo: `${logoPrefix}uniswap.png`,
  },
  {
    name: 'SushiSwap',
    url: 'https://sushi.com/',
    logo: `${logoPrefix}sushi.png`,
  },
  {
    name: 'Curve',
    url: 'https://curve.fi/',
    logo: `${logoPrefix}curve.png`,
  },
  {
    name: 'Balancer',
    url: 'https://balancer.finance/',
    logo: `${logoPrefix}balancer.png`,
  },
  {
    name: 'Bancor',
    url: 'https://app.bancor.network/eth/data',
    logo: `${logoPrefix}bancor.png`,
  },
  {
    name: '1inch',
    url: 'https://1inch.exchange/#/',
    logo: `${logoPrefix}1inch.jpg`,
  },
  {
    name: 'Paraswap',
    url: 'https://paraswap.io/#/',
    logo: `${logoPrefix}paraswap.png`,
  },
  {
    name: '0x Protocol',
    url: 'https://0x.org/',
    logo: `${logoPrefix}0x.png`,
  },
];
const bscSource: SourceItem[] = [
  {
    name: 'PancakeSwap',
    url: 'https://pancakeswap.finance/',
    logo: `${logoPrefix}pancakeswap.png`,
  },
  {
    name: 'BakerySwap',
    url: 'https://www.bakeryswap.org/#/home',
    logo: `${logoPrefix}bakeryswap.png`,
  },
  {
    name: 'DODO',
    url: 'https://dodoex.io/',
    logo: `${logoPrefix}dodoex.png`,
  },
  {
    name: 'JulSwap',
    url: 'https://julswap.com/#/swap',
    logo: `${logoPrefix}julswap.png`,
  },
  {
    name: 'ApeSwap',
    url: 'https://apeswap.finance/',
    logo: `${logoPrefix}apeswap.jpg`,
  },
  {
    name: 'BSCswap',
    url: 'https://trade.bscswap.com/#/swap',
    logo: `${logoPrefix}bscswap.png`,
  },
];
const neoSource: SourceItem[] = [
  {
    name: 'Flamingo',
    url: 'https://flamingo.finance/',
    logo: `${logoPrefix}flamingo.png`,
  },
  {
    name: 'Nash',
    url: 'https://nash.io/',
    logo: `${logoPrefix}nash.png`,
  },
  {
    name: 'Switcheo',
    url: 'https://switcheo.network/',
    logo: `${logoPrefix}switcheo.png`,
  },
];
const hecoSource: SourceItem[] = [
  {
    name: 'MDEX',
    url: 'https://ht.mdex.com/#/swap',
    logo: `${logoPrefix}mdex.png`,
  },
  {
    name: 'LAVAswap',
    url: 'https://lavaswap.com/',
    logo: `${logoPrefix}lavaswap.png`,
  },
  {
    name: 'Anyswap',
    url: 'https://huobi.anyswap.exchange/dashboard',
    logo: `${logoPrefix}anyswap.png`,
  },
  {
    name: 'Depth',
    url: 'https://depth.fi/',
    logo: `${logoPrefix}depth.png`,
  },
  {
    name: 'Chocoswap',
    url: 'https://www.chocoswap.org/',
    logo: `${logoPrefix}chocoswap.png`,
  },
];

export const LiquiditySource: LiquiditySourceType = {
  eth: ethSource,
  bsc: bscSource,
  neo: neoSource,
  heco: hecoSource,
};
