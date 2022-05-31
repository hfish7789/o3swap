import { NETWORK } from './network';
import { environment } from '@env/environment';

export const CROSS_CHAIN_SWAP_DETAIL_HOST =
  NETWORK === 'MainNet'
    ? 'https://bridge.poly.network/v1'
    : 'https://bridge.poly.network/testnet/v1';

export const UTXO_HOST =
  NETWORK === 'MainNet'
    ? 'https://fapi.ngd.network/api/web'
    : 'http://52.230.21.178:10020/web';

export const POLY_HOST =
  NETWORK === 'MainNet'
    ? 'https://swap.poly.network'
    : 'http://138.91.6.226:9999';

let inquiryHost;
if (environment.testSite) {
  inquiryHost =
    NETWORK === 'MainNet'
      ? 'http://47.110.14.167:8081'
      : 'http://47.110.14.167:8082';
} else {
  inquiryHost =
    NETWORK === 'MainNet'
      ? 'https://aggregator.api.o3swap.com'
      : 'http://47.110.14.167:8082';
}

export const INQUIRY_HOST = inquiryHost;
