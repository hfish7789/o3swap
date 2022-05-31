export interface CommonHttpResponse {
  status: 'success' | 'error';
  data?: any;
  error_msg?: string;
  error_code?: number;
}

export interface AssetQueryResponseItem {
  amount: any[];
  swapPath: string[];
  assetHashPath?: string[];
  fiat?: string;
  receiveAmount?: number | string;
  swapPathLogo?: string[];
  aggregator?: string;
}
export type AssetQueryResponse = AssetQueryResponseItem[];
