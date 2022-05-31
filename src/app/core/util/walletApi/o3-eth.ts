import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import o3dapi from 'o3-dapi-core';
import { ETH, BSC, HECO } from 'o3-dapi-eth';
import { CommonService } from '../common.service';
import { SwapService } from '../swap.service';
import {
  NeoWalletName,
  UPDATE_ETH_ACCOUNT,
  UPDATE_ETH_WALLET_NAME,
  SwapStateType,
  UPDATE_BSC_ACCOUNT,
  UPDATE_BSC_WALLET_NAME,
  UPDATE_HECO_ACCOUNT,
  UPDATE_HECO_WALLET_NAME,
  EthWalletName,
  ETH_CROSS_SWAP_CONTRACT_HASH,
  SWAP_CONTRACT_CHAIN_ID,
  Token,
  UPDATE_BSC_BALANCES,
  UPDATE_ETH_BALANCES,
  UPDATE_HECO_BALANCES,
  UPDATE_PENDING_TX,
  SwapTransaction,
  ETH_SOURCE_ASSET_HASH,
  USD_TOKENS,
  CHAINS,
  TxAtPage,
  UPDATE_BRIDGE_PENDING_TX,
  UPDATE_LIQUIDITY_PENDING_TX,
  WETH_ASSET_HASH,
  AGGREGATOR_CONTRACT,
  AssetQueryResponseItem,
  BRIDGE_SLIPVALUE,
  O3_AGGREGATOR_SLIPVALUE,
  ChainTokens,
} from '@lib';
import BigNumber from 'bignumber.js';
import { Unsubscribable, Observable, of, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import Web3 from 'web3';
import { ApiService } from '../../api/api.service';

interface State {
  swap: SwapStateType;
  tokens: any;
}

@Injectable()
export class O3EthWalletApiService {
  myWalletName: NeoWalletName = 'O3';
  accountAddress = { ETH: '', BSC: '', HECO: '' };
  requestTxStatusInterval: Unsubscribable;

  swap$: Observable<any>;
  ethWalletName: EthWalletName;
  bscWalletName: EthWalletName;
  hecoWalletName: EthWalletName;
  transaction: SwapTransaction;
  bridgeeTransaction: SwapTransaction;
  liquidityTransaction: SwapTransaction;

  tokens$: Observable<any>;
  chainTokens = new ChainTokens();

  isConnected: boolean;
  web3 = new Web3();
  wEthJson;
  swapperJson;
  ethErc20Json;
  aggregatorSwapJson = {
    BSC: {
      Pancakeswap: null,
    },
    ETH: {
      Uniswap: null,
    },
    HECO: {
      'Mdex-Heco': null,
    },
  };

  constructor(
    private http: HttpClient,
    private store: Store<State>,
    private nzMessage: NzMessageService,
    private swapService: SwapService,
    private commonService: CommonService,
    private apiService: ApiService
  ) {
    o3dapi.initPlugins([ETH]);
    o3dapi.initPlugins([BSC]);
    o3dapi.initPlugins([HECO]);
    this.swap$ = store.select('swap');
    this.tokens$ = store.select('tokens');
    this.swap$.subscribe((state) => {
      this.ethWalletName = state.ethWalletName;
      this.bscWalletName = state.bscWalletName;
      this.hecoWalletName = state.hecoWalletName;
      this.transaction = Object.assign({}, state.transaction);
      this.bridgeeTransaction = Object.assign({}, state.bridgeeTransaction);
      this.liquidityTransaction = Object.assign({}, state.liquidityTransaction);
    });
    this.tokens$.subscribe((state) => {
      this.chainTokens = state.chainTokens;
    });
  }

  connect(chain: string): Promise<string> {
    return o3dapi[chain]
      .request({ method: 'eth_requestAccounts' })
      .then((response) => {
        if (response.result) {
          const addressArr = response.result;
          if (addressArr.length <= 0) {
            return;
          }
          this.accountAddress[chain] = addressArr[0];
        } else {
          if (response.length <= 0) {
            return;
          }
          this.accountAddress[chain] = response[0].address;
        }
        this.getBalance(chain as CHAINS);
        let dispatchAccountType;
        let dispatchWalletNameType;
        switch (chain) {
          case 'ETH':
            dispatchAccountType = UPDATE_ETH_ACCOUNT;
            dispatchWalletNameType = UPDATE_ETH_WALLET_NAME;
            break;
          case 'BSC':
            dispatchAccountType = UPDATE_BSC_ACCOUNT;
            dispatchWalletNameType = UPDATE_BSC_WALLET_NAME;
            break;
          case 'HECO':
            dispatchAccountType = UPDATE_HECO_ACCOUNT;
            dispatchWalletNameType = UPDATE_HECO_WALLET_NAME;
            break;
        }
        this.store.dispatch({
          type: dispatchAccountType,
          data: this.accountAddress[chain],
        });
        this.store.dispatch({
          type: dispatchWalletNameType,
          data: this.myWalletName,
        });
        return this.accountAddress[chain];
      })
      .catch((error) => {
        this.handleDapiError(error);
      });
  }

  checkNetwork(fromToken: Token): boolean {
    return true;
  }

  //#region balance
  async getBalance(chain: CHAINS): Promise<boolean> {
    this.commonService.log('getBalance-----------');
    let dispatchBalanceType;
    let tempTokenBalance: Token[];
    return new Promise(async (resolve) => {
      switch (chain) {
        case 'ETH':
          dispatchBalanceType = UPDATE_ETH_BALANCES;
          tempTokenBalance = JSON.parse(JSON.stringify(this.chainTokens.ETH));
          break;
        case 'BSC':
          dispatchBalanceType = UPDATE_BSC_BALANCES;
          tempTokenBalance = JSON.parse(JSON.stringify(this.chainTokens.BSC));
          break;
        case 'HECO':
          dispatchBalanceType = UPDATE_HECO_BALANCES;
          tempTokenBalance = JSON.parse(JSON.stringify(this.chainTokens.HECO));
          break;
      }
      const result = {};
      for (const item of tempTokenBalance) {
        const tempAmount = await this.getBalancByHash(item);
        if (tempAmount) {
          result[item.assetID] = JSON.parse(JSON.stringify(item));
          result[item.assetID].amount = tempAmount;
          this.store.dispatch({
            type: dispatchBalanceType,
            data: result,
          });
        }
      }
      this.commonService.log(result);
      resolve(true);
    });
  }

  async getBalancByHash(token: Token): Promise<string> {
    if (token.assetID !== ETH_SOURCE_ASSET_HASH) {
      const json = await this.getEthErc20Json();
      const ethErc20Contract = new this.web3.eth.Contract(json, token.assetID);
      const data = await ethErc20Contract.methods
        .balanceOf(this.accountAddress[token.chain])
        .encodeABI();
      return o3dapi[token.chain]
        .request({
          method: 'eth_call',
          params: [
            this.getSendTransactionParams(
              this.accountAddress[token.chain],
              token.assetID,
              data
            ),
            'latest',
          ],
        })
        .then((response) => {
          const balance = response.result;
          if (
            balance &&
            !new BigNumber(balance).isNaN() &&
            new BigNumber(balance).comparedTo(0) > 0
          ) {
            return new BigNumber(balance).shiftedBy(-token.decimals).toFixed();
          }
        })
        .catch((error) => {
          this.commonService.log(error);
        });
    } else {
      return o3dapi[token.chain]
        .request({
          method: 'eth_getBalance',
          params: [this.accountAddress[token.chain], 'latest'],
        })
        .then((response) => {
          const balance = response.result;
          if (
            balance &&
            !new BigNumber(balance).isNaN() &&
            new BigNumber(balance).comparedTo(0) > 0
          ) {
            return new BigNumber(balance, 16)
              .shiftedBy(-token.decimals)
              .toFixed();
          }
        })
        .catch((error) => {
          this.commonService.log(error);
        });
    }
  }
  //#endregion

  //#region ETH<=>WETH HT<=>WHT BNB<=>WBNB swap
  async depositWEth(
    fromToken: Token, // eth
    toToken: Token, // weth
    inputAmount: string,
    fromAddress: string
  ): Promise<any> {
    this.commonService.log(`\u001b[32m  ✓ eth swap weth \u001b[0m`);
    const json = await this.getWEthJson();
    const swapContract = new this.web3.eth.Contract(
      json,
      WETH_ASSET_HASH[fromToken.chain].assetID
    );
    const data = swapContract.methods.deposit().encodeABI();
    const value = new BigNumber(inputAmount)
      .shiftedBy(fromToken.decimals)
      .toFixed();
    return o3dapi[fromToken.chain]
      .request({
        method: 'eth_sendTransaction',
        params: [
          this.getSendTransactionParams(
            fromAddress,
            WETH_ASSET_HASH[fromToken.chain].assetID,
            data,
            value
          ),
        ],
      })
      .then((response) => {
        const hash = response.result;
        this.commonService.log(hash);
        this.handleTx(
          fromToken,
          toToken,
          inputAmount,
          new BigNumber(inputAmount).shiftedBy(toToken.decimals).toFixed(),
          hash,
          'swap',
          false
        );
        return hash;
      })
      .catch((error) => {
        this.commonService.log(error);
        this.handleDapiError(error);
      });
  }

  async withdrawalWeth(
    fromToken: Token, // weth
    toToken: Token, // eth
    inputAmount: string,
    fromAddress: string
  ): Promise<any> {
    this.commonService.log(`\u001b[32m  ✓ eth swap weth \u001b[0m`);
    const json = await this.getWEthJson();
    const swapContract = new this.web3.eth.Contract(
      json,
      WETH_ASSET_HASH[fromToken.chain].assetID
    );
    const data = swapContract.methods
      .withdraw(
        new BigNumber(inputAmount).shiftedBy(fromToken.decimals).toFixed()
      )
      .encodeABI();
    return o3dapi[fromToken.chain]
      .request({
        method: 'eth_sendTransaction',
        params: [
          this.getSendTransactionParams(
            fromAddress,
            WETH_ASSET_HASH[fromToken.chain].assetID,
            data
          ),
        ],
      })
      .then((response) => {
        const hash = response.result;
        this.commonService.log(hash);
        this.handleTx(
          fromToken,
          toToken,
          inputAmount,
          new BigNumber(inputAmount).shiftedBy(toToken.decimals).toFixed(),
          hash,
          'swap',
          false
        );
        return hash;
      })
      .catch((error) => {
        this.commonService.log(error);
        this.handleDapiError(error);
      });
  }
  //#endregion

  //#region USDT BUSD PUSD swap
  async swapCrossChain(
    fromToken: Token,
    toToken: Token,
    inputAmount: string,
    fromAddress: string,
    toAddress: string,
    receiveAmount: string,
    slipValue: number,
    polyFee: string,
    txAtPage: TxAtPage
  ): Promise<string> {
    this.commonService.log('poly swap');
    const json = await this.getSwapperJson();
    const swapContract = new this.web3.eth.Contract(
      json,
      ETH_CROSS_SWAP_CONTRACT_HASH[fromToken.chain]
    );
    const bigNumberPolyFee = new BigNumber(polyFee)
      .shiftedBy(18)
      .dp(0)
      .toFixed();
    const params = {
      fromAssetHash: this.commonService.add0xHash(fromToken.assetID),
      toPoolId: 1,
      toChainId: SWAP_CONTRACT_CHAIN_ID[toToken.chain],
      toAssetHash: this.commonService.add0xHash(toToken.assetID),
      toAddress,
      amount: new BigNumber(inputAmount)
        .shiftedBy(fromToken.decimals)
        .toFixed(),
      minOutAmount: this.swapService.getMinAmountOut(receiveAmount, slipValue),
      fee: bigNumberPolyFee,
      id: 1,
    };
    this.commonService.log(params);
    this.commonService.log(`value: ${bigNumberPolyFee}`);
    const data = swapContract.methods
      .swap(
        params.fromAssetHash,
        params.toPoolId,
        params.toChainId,
        params.toAssetHash,
        params.toAddress,
        params.amount,
        params.minOutAmount,
        params.fee,
        params.id
      )
      .encodeABI();
    return o3dapi[fromToken.chain]
      .request({
        method: 'eth_sendTransaction',
        params: [
          this.getSendTransactionParams(
            fromAddress,
            ETH_CROSS_SWAP_CONTRACT_HASH[fromToken.chain],
            data,
            bigNumberPolyFee
          ),
        ],
      })
      .then((response) => {
        const hash = response.result;
        this.handleTx(
          fromToken,
          toToken,
          inputAmount,
          receiveAmount,
          hash,
          txAtPage
        );
        return hash;
      })
      .catch((error) => {
        this.commonService.log(error);
        this.handleDapiError(error);
      });
  }
  //#endregion

  //#region aggregator contract swap
  async swapExactTokensForETH(
    fromToken: Token,
    toToken: Token,
    chooseSwapPath: AssetQueryResponseItem,
    inputAmount: string,
    fromAddress: string,
    toAddress: string,
    deadline: number,
    slipValue: number
  ): Promise<any> {
    this.commonService.log(
      `\u001b[32m  ✓ ${chooseSwapPath.aggregator} \u001b[0m`
    );
    this.commonService.log('swapExactTokensForETH');
    const json = await this.getAggregatorSwapJson(
      fromToken.chain,
      chooseSwapPath.aggregator
    );
    const swapContract = new this.web3.eth.Contract(
      json,
      AGGREGATOR_CONTRACT[fromToken.chain][chooseSwapPath.aggregator]
    );
    const receiveAmount =
      chooseSwapPath.amount[chooseSwapPath.amount.length - 1];
    const params = {
      amountIn: new BigNumber(inputAmount)
        .shiftedBy(fromToken.decimals)
        .toFixed(),
      swapAmountOutMin: this.swapService.getMinAmountOut(
        receiveAmount,
        slipValue
      ),
      path: chooseSwapPath.assetHashPath,
      to: toAddress,
      deadline: Math.floor(Date.now() / 1000 + deadline * 60),
    };
    this.commonService.log(params);
    const data = swapContract.methods
      .swapExactTokensForETHSupportingFeeOnTransferTokens(
        params.amountIn,
        params.swapAmountOutMin,
        params.path,
        params.to,
        params.deadline
      )
      .encodeABI();
    return o3dapi[fromToken.chain]
      .request({
        method: 'eth_sendTransaction',
        params: [
          this.getSendTransactionParams(
            fromAddress,
            AGGREGATOR_CONTRACT[fromToken.chain][chooseSwapPath.aggregator],
            data
          ),
        ],
      })
      .then((response) => {
        const hash = response.result;
        this.commonService.log(hash);
        this.handleTx(
          fromToken,
          toToken,
          inputAmount,
          receiveAmount,
          hash,
          'swap',
          false
        );
        return hash;
      })
      .catch((error) => {
        this.commonService.log(error);
        this.handleDapiError(error);
      });
  }

  async swapExactETHForTokens(
    fromToken: Token,
    toToken: Token,
    chooseSwapPath: AssetQueryResponseItem,
    inputAmount: string,
    fromAddress: string,
    toAddress: string,
    deadline: number,
    slipValue: number
  ): Promise<any> {
    this.commonService.log(
      `\u001b[32m  ✓ ${chooseSwapPath.aggregator} \u001b[0m`
    );
    this.commonService.log('swapExactETHForTokens');
    const json = await this.getAggregatorSwapJson(
      fromToken.chain,
      chooseSwapPath.aggregator
    );
    const swapContract = new this.web3.eth.Contract(
      json,
      AGGREGATOR_CONTRACT[fromToken.chain][chooseSwapPath.aggregator]
    );
    const receiveAmount =
      chooseSwapPath.amount[chooseSwapPath.amount.length - 1];
    const params = {
      swapAmountOutMin: this.swapService.getMinAmountOut(
        receiveAmount,
        slipValue
      ),
      path: chooseSwapPath.assetHashPath,
      to: toAddress,
      deadline: Math.floor(Date.now() / 1000 + deadline * 60),
    };
    this.commonService.log(params);
    const value = new BigNumber(inputAmount)
      .shiftedBy(fromToken.decimals)
      .toFixed();
    this.commonService.log(`value: ${value}`);
    const data = swapContract.methods
      .swapExactETHForTokensSupportingFeeOnTransferTokens(
        params.swapAmountOutMin,
        params.path,
        params.to,
        params.deadline
      )
      .encodeABI();
    return o3dapi[fromToken.chain]
      .request({
        method: 'eth_sendTransaction',
        params: [
          this.getSendTransactionParams(
            fromAddress,
            AGGREGATOR_CONTRACT[fromToken.chain][chooseSwapPath.aggregator],
            data,
            value
          ),
        ],
      })
      .then((response) => {
        const hash = response.result;
        this.commonService.log(hash);
        this.handleTx(
          fromToken,
          toToken,
          inputAmount,
          receiveAmount,
          hash,
          'swap',
          false
        );
        return hash;
      })
      .catch((error) => {
        this.commonService.log(error);
        this.handleDapiError(error);
      });
  }

  async swapExactTokensForTokens(
    fromToken: Token,
    toToken: Token,
    chooseSwapPath: AssetQueryResponseItem,
    inputAmount: string,
    fromAddress: string,
    toAddress: string,
    deadline: number,
    slipValue: number
  ): Promise<any> {
    this.commonService.log(
      `\u001b[32m  ✓ ${chooseSwapPath.aggregator} \u001b[0m`
    );
    this.commonService.log('swapExactTokensForTokens');
    const json = await this.getAggregatorSwapJson(
      fromToken.chain,
      chooseSwapPath.aggregator
    );
    const swapContract = new this.web3.eth.Contract(
      json,
      AGGREGATOR_CONTRACT[fromToken.chain][chooseSwapPath.aggregator]
    );
    const receiveAmount =
      chooseSwapPath.amount[chooseSwapPath.amount.length - 1];
    const params = {
      amountIn: new BigNumber(inputAmount)
        .shiftedBy(fromToken.decimals)
        .dp(0)
        .toFixed(),
      swapAmountOutMin: this.swapService.getMinAmountOut(
        receiveAmount,
        slipValue
      ),
      path: chooseSwapPath.assetHashPath,
      to: toAddress,
      deadline: Math.floor(Date.now() / 1000 + deadline * 60),
    };
    this.commonService.log(params);
    const data = swapContract.methods
      .swapExactTokensForTokensSupportingFeeOnTransferTokens(
        params.amountIn,
        params.swapAmountOutMin,
        params.path,
        params.to,
        params.deadline
      )
      .encodeABI();
    return o3dapi[fromToken.chain]
      .request({
        method: 'eth_sendTransaction',
        params: [
          this.getSendTransactionParams(
            fromAddress,
            AGGREGATOR_CONTRACT[fromToken.chain][chooseSwapPath.aggregator],
            data
          ),
        ],
      })
      .then((response) => {
        const hash = response.result;
        this.commonService.log(hash);
        this.handleTx(
          fromToken,
          toToken,
          inputAmount,
          receiveAmount,
          hash,
          'swap',
          false
        );
        return hash;
      })
      .catch((error) => {
        this.commonService.log(error);
        this.handleDapiError(error);
      });
  }

  async swapExactETHForTokensCrossChain(
    fromToken: Token,
    toToken: Token,
    chooseSwapPath: AssetQueryResponseItem,
    inputAmount: string,
    fromAddress: string,
    toAddress: string,
    slipValue: number,
    polyFee: string,
    deadline: number
  ): Promise<string> {
    this.commonService.log(
      `\u001b[32m  ✓ ${chooseSwapPath.aggregator} \u001b[0m`
    );
    this.commonService.log('swapExactETHForTokensCrossChain');
    const json = await this.getAggregatorSwapJson(
      fromToken.chain,
      chooseSwapPath.aggregator
    );
    const swapContract = new this.web3.eth.Contract(
      json,
      AGGREGATOR_CONTRACT[fromToken.chain][chooseSwapPath.aggregator]
    );
    const amountOutA = chooseSwapPath.amount[chooseSwapPath.amount.length - 2];
    const bigNumberPolyFee = new BigNumber(polyFee)
      .shiftedBy(18)
      .dp(0)
      .toFixed();
    const receiveAmount =
      chooseSwapPath.amount[chooseSwapPath.amount.length - 1];
    const params = {
      swapAmountOutMin: this.swapService.getMinAmountOut(
        amountOutA,
        O3_AGGREGATOR_SLIPVALUE
      ),
      path: chooseSwapPath.assetHashPath,
      to: toAddress,
      deadline: Math.floor(Date.now() / 1000 + deadline * 60),
      toPoolId: 1,
      toChainId: SWAP_CONTRACT_CHAIN_ID[toToken.chain],
      toAssetHash: this.commonService.add0xHash(toToken.assetID),
      polyMinOutAmount: this.swapService.getMinAmountOut(
        receiveAmount,
        slipValue
      ),
      fee: bigNumberPolyFee,
    };
    this.commonService.log(params);
    const value = new BigNumber(inputAmount)
      .shiftedBy(fromToken.decimals)
      .plus(new BigNumber(bigNumberPolyFee))
      .dp(0)
      .toFixed();
    this.commonService.log(`value: ${value}`);
    const data = swapContract.methods
      .swapExactETHForTokensSupportingFeeOnTransferTokensCrossChain(
        params.swapAmountOutMin,
        params.path,
        params.to,
        params.deadline,
        params.toPoolId,
        params.toChainId,
        params.toAssetHash,
        params.polyMinOutAmount,
        params.fee
      )
      .encodeABI();
    return o3dapi[fromToken.chain]
      .request({
        method: 'eth_sendTransaction',
        params: [
          this.getSendTransactionParams(
            fromAddress,
            AGGREGATOR_CONTRACT[fromToken.chain][chooseSwapPath.aggregator],
            data,
            value
          ),
        ],
      })
      .then((response) => {
        const hash = response.result;
        this.commonService.log(hash);
        this.handleTx(
          fromToken,
          toToken,
          inputAmount,
          receiveAmount,
          hash,
          'swap'
        );
        return hash;
      })
      .catch((error) => {
        this.commonService.log(error);
        this.handleDapiError(error);
      });
  }

  async swapExactTokensForTokensCrossChain(
    fromToken: Token,
    toToken: Token,
    chooseSwapPath: AssetQueryResponseItem,
    inputAmount: string,
    fromAddress: string,
    toAddress: string,
    slipValue: number,
    polyFee: string,
    deadline: number
  ): Promise<string> {
    this.commonService.log(
      `\u001b[32m  ✓ ${chooseSwapPath.aggregator} \u001b[0m`
    );
    this.commonService.log('swapExactTokensForTokensCrossChain');
    const json = await this.getAggregatorSwapJson(
      fromToken.chain,
      chooseSwapPath.aggregator
    );
    const swapContract = new this.web3.eth.Contract(
      json,
      AGGREGATOR_CONTRACT[fromToken.chain][chooseSwapPath.aggregator]
    );
    const amountOutA = chooseSwapPath.amount[chooseSwapPath.amount.length - 2];
    const bigNumberPolyFee = new BigNumber(polyFee)
      .shiftedBy(18)
      .dp(0)
      .toFixed();
    const receiveAmount =
      chooseSwapPath.amount[chooseSwapPath.amount.length - 1];
    const params = {
      amountIn: new BigNumber(inputAmount)
        .shiftedBy(fromToken.decimals)
        .dp(0)
        .toFixed(),
      swapAmountOutMin: this.swapService.getMinAmountOut(
        amountOutA,
        O3_AGGREGATOR_SLIPVALUE
      ),
      path: chooseSwapPath.assetHashPath,
      to: toAddress,
      deadline: Math.floor(Date.now() / 1000 + deadline * 60),
      toPoolId: 1,
      toChainId: SWAP_CONTRACT_CHAIN_ID[toToken.chain],
      toAssetHash: this.commonService.add0xHash(toToken.assetID),
      polyMinOutAmount: this.swapService.getMinAmountOut(
        receiveAmount,
        slipValue
      ),
      fee: bigNumberPolyFee,
    };
    this.commonService.log(params);
    this.commonService.log(`value: ${bigNumberPolyFee}`);
    const data = swapContract.methods
      .swapExactTokensForTokensSupportingFeeOnTransferTokensCrossChain(
        params.amountIn,
        params.swapAmountOutMin,
        params.path,
        params.to,
        params.deadline,
        params.toPoolId,
        params.toChainId,
        params.toAssetHash,
        params.polyMinOutAmount,
        params.fee
      )
      .encodeABI();
    return o3dapi[fromToken.chain]
      .request({
        method: 'eth_sendTransaction',
        params: [
          this.getSendTransactionParams(
            fromAddress,
            AGGREGATOR_CONTRACT[fromToken.chain][chooseSwapPath.aggregator],
            data,
            bigNumberPolyFee
          ),
        ],
      })
      .then((response) => {
        const hash = response.result;
        this.commonService.log(hash);
        this.handleTx(
          fromToken,
          toToken,
          inputAmount,
          receiveAmount,
          hash,
          'swap'
        );
        return hash;
      })
      .catch((error) => {
        this.commonService.log(error);
        this.handleDapiError(error);
      });
  }
  //#endregion

  //#region liquidity
  async addLiquidity(
    fromToken: Token,
    toToken: Token,
    inputAmount: string,
    address: string,
    toChainId: number,
    receiveAmount: string,
    fee: string
  ): Promise<string> {
    this.commonService.log('add liquidity');
    const json = await this.getSwapperJson();
    const swapContract = new this.web3.eth.Contract(
      json,
      ETH_CROSS_SWAP_CONTRACT_HASH[fromToken.chain]
    );
    const bigNumberPolyFee = new BigNumber(fee).shiftedBy(18).dp(0).toFixed();
    const params = {
      fromAssetHash: this.commonService.add0xHash(fromToken.assetID),
      toPoolId: 1,
      toChainId,
      toAddress: address,
      amount: new BigNumber(inputAmount)
        .shiftedBy(fromToken.decimals)
        .toFixed(),
      minOutAmount: this.swapService.getMinAmountOut(
        receiveAmount,
        BRIDGE_SLIPVALUE
      ),
      fee: bigNumberPolyFee,
      id: 1,
    };
    this.commonService.log(params);
    this.commonService.log(`value: ${bigNumberPolyFee}`);
    const data = swapContract.methods
      .add_liquidity(
        params.fromAssetHash,
        params.toPoolId,
        params.toChainId,
        params.toAddress,
        params.amount,
        params.minOutAmount,
        params.fee,
        params.id
      )
      .encodeABI();
    return o3dapi[fromToken.chain]
      .request({
        method: 'eth_sendTransaction',
        params: [
          this.getSendTransactionParams(
            address,
            ETH_CROSS_SWAP_CONTRACT_HASH[fromToken.chain],
            data,
            bigNumberPolyFee
          ),
        ],
      })
      .then((response) => {
        const hash = response.result;
        this.commonService.log(hash);
        this.handleTx(
          fromToken,
          toToken,
          inputAmount,
          receiveAmount,
          hash,
          'liquidity'
        );
        return hash;
      })
      .catch((error) => {
        this.handleDapiError(error);
      });
  }

  async removeLiquidity(
    fromToken: Token, // LP token
    inputAmount: string,
    address: string,
    toChainId: number,
    receiveAmount: string,
    fee: string
  ): Promise<string> {
    this.commonService.log('remove liquidity');
    const json = await this.getSwapperJson();
    const swapContract = new this.web3.eth.Contract(
      json,
      ETH_CROSS_SWAP_CONTRACT_HASH[fromToken.chain]
    );
    const usdtToken = USD_TOKENS.find((item) => item.chain === fromToken.chain);
    const bigNumberPolyFee = new BigNumber(fee).shiftedBy(18).dp(0).toFixed();
    const params = {
      fromAssetHash: this.commonService.add0xHash(fromToken.assetID),
      toPoolId: 1,
      toChainId,
      toAssetHash: this.commonService.add0xHash(usdtToken.assetID),
      toAddress: address,
      amount: new BigNumber(inputAmount)
        .shiftedBy(fromToken.decimals)
        .toFixed(),
      minOutAmount: this.swapService.getMinAmountOut(
        receiveAmount,
        BRIDGE_SLIPVALUE
      ),
      fee: bigNumberPolyFee,
      id: 1,
    };
    this.commonService.log(params);
    this.commonService.log(`value: ${bigNumberPolyFee}`);
    const data = swapContract.methods
      .remove_liquidity(
        params.fromAssetHash,
        params.toPoolId,
        params.toChainId,
        params.toAssetHash,
        params.toAddress,
        params.amount,
        params.minOutAmount,
        params.fee,
        params.id
      )
      .encodeABI();
    return o3dapi[fromToken.chain]
      .request({
        method: 'eth_sendTransaction',
        params: [
          this.getSendTransactionParams(
            address,
            ETH_CROSS_SWAP_CONTRACT_HASH[fromToken.chain],
            data,
            bigNumberPolyFee
          ),
        ],
      })
      .then((response) => {
        const hash = response.result;
        this.commonService.log(hash);
        this.handleTx(
          fromToken,
          usdtToken,
          inputAmount,
          receiveAmount,
          hash,
          'liquidity'
        );
        return hash;
      })
      .catch((error) => {
        this.handleDapiError(error);
      });
  }
  //#endregion

  //#region approve
  async getAllowance(
    fromToken: Token,
    fromAddress: string,
    aggregator?: string
  ): Promise<string> {
    this.commonService.log('\u001b[32m  ✓ start get allowance \u001b[0m');
    let tokenhash = fromToken.assetID;
    if (fromToken.assetID === ETH_SOURCE_ASSET_HASH) {
      tokenhash = WETH_ASSET_HASH[fromToken.chain].assetID;
    }
    const json = await this.getEthErc20Json();
    const ethErc20Contract = new this.web3.eth.Contract(json, tokenhash);
    let contract = ETH_CROSS_SWAP_CONTRACT_HASH[fromToken.chain];
    if (aggregator) {
      contract = AGGREGATOR_CONTRACT[fromToken.chain][aggregator];
    }
    const data = ethErc20Contract.methods
      .allowance(fromAddress, contract)
      .encodeABI();
    return o3dapi[fromToken.chain]
      .request({
        method: 'eth_call',
        params: [
          this.getSendTransactionParams(fromAddress, tokenhash, data),
          'latest',
        ],
      })
      .then((response) => {
        const balance = response.result;
        this.commonService.log('allowance: ' + balance);
        this.commonService.log('aggregator: ' + aggregator);
        if (new BigNumber(balance, 16).isNaN()) {
          return 0;
        }
        return new BigNumber(balance, 16)
          .shiftedBy(-fromToken.decimals)
          .toFixed();
      })
      .catch((error) => {
        this.handleDapiError(error);
      });
  }

  async approve(
    fromToken: Token,
    fromAddress: string,
    aggregator?: string
  ): Promise<any> {
    let tokenhash = fromToken.assetID;
    if (fromToken.assetID === ETH_SOURCE_ASSET_HASH) {
      tokenhash = WETH_ASSET_HASH[fromToken.chain].assetID;
    }
    let contract = ETH_CROSS_SWAP_CONTRACT_HASH[fromToken.chain];
    if (aggregator) {
      contract = AGGREGATOR_CONTRACT[fromToken.chain][aggregator];
    }
    const json = await this.getEthErc20Json();
    const ethErc20Contract = new this.web3.eth.Contract(json, tokenhash);
    const data = ethErc20Contract.methods
      .approve(
        contract,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      )
      .encodeABI();
    try {
      const response = await o3dapi[fromToken.chain].request({
        method: 'eth_sendTransaction',
        params: [this.getSendTransactionParams(fromAddress, tokenhash, data)],
      });
      return response.result;
    } catch (error) {
      this.handleDapiError(error);
      this.commonService.log(error);
    }
  }

  getReceipt(hash: string, chain: CHAINS): Promise<any> {
    return o3dapi[chain]
      .request({
        method: 'eth_getTransactionReceipt',
        params: [hash],
      })
      .then((response) => {
        const receipt = response.result;
        if (receipt) {
          if (new BigNumber(receipt.status, 16).isZero()) {
            return false;
          } else {
            return true;
          }
        }
        return null;
      })
      .catch((error) => {
        this.commonService.log(error);
      });
  }
  //#endregion

  //#region private function
  private handleTx(
    fromToken: Token,
    toToken: Token,
    inputAmount: string,
    receiveAmount: string,
    txHash: string,
    txAtPage: TxAtPage,
    hasCrossChain = true
  ): void {
    const pendingTx: SwapTransaction = {
      txid: this.commonService.remove0xHash(txHash),
      isPending: true,
      isFailed: false,
      min: false,
      fromToken,
      toToken,
      amount: inputAmount,
      receiveAmount: new BigNumber(receiveAmount)
        .shiftedBy(-toToken.decimals)
        .toFixed(),
      walletName: 'O3',
    };
    if (hasCrossChain) {
      pendingTx.progress = {
        step1: { hash: '', status: 1 },
        step2: { hash: '', status: 0 },
        step3: { hash: '', status: 0 },
      };
    }
    let dispatchType: string;
    switch (txAtPage) {
      case 'swap':
        dispatchType = UPDATE_PENDING_TX;
        this.transaction = this.transaction;
        break;
      case 'bridge':
        dispatchType = UPDATE_BRIDGE_PENDING_TX;
        this.bridgeeTransaction = this.bridgeeTransaction;
        break;
      case 'liquidity':
        dispatchType = UPDATE_LIQUIDITY_PENDING_TX;
        this.liquidityTransaction = this.liquidityTransaction;
        break;
    }
    this.store.dispatch({ type: dispatchType, data: pendingTx });
    this.listerTxReceipt(
      txHash,
      dispatchType,
      hasCrossChain,
      fromToken.chain,
      toToken.chain,
      txAtPage
    );
  }

  private listerTxReceipt(
    txHash: string,
    dispatchType: string,
    hasCrossChain = true,
    fromChain: CHAINS,
    toChain: CHAINS,
    txAtPage: TxAtPage
  ): void {
    if (this.requestTxStatusInterval) {
      this.requestTxStatusInterval.unsubscribe();
    }
    this.requestTxStatusInterval = interval(5000).subscribe(() => {
      let currentTx: SwapTransaction;
      switch (txAtPage) {
        case 'swap':
          currentTx = this.transaction;
          break;
        case 'bridge':
          currentTx = this.bridgeeTransaction;
          break;
        case 'liquidity':
          currentTx = this.liquidityTransaction;
          break;
      }
      o3dapi[fromChain]
        .request({
          method: 'eth_getTransactionReceipt',
          params: [txHash],
        })
        .then((response) => {
          const receipt = response.result;
          this.commonService.log(receipt);
          if (receipt) {
            this.requestTxStatusInterval.unsubscribe();
            if (new BigNumber(receipt.status, 16).isZero()) {
              currentTx.isPending = false;
              currentTx.isFailed = true;
              this.store.dispatch({ type: dispatchType, data: currentTx });
            } else {
              if (hasCrossChain === false) {
                this.getBalance(fromChain);
                currentTx.isPending = false;
                this.store.dispatch({ type: dispatchType, data: currentTx });
              }
            }
          }
        })
        .catch((error) => {
          this.requestTxStatusInterval.unsubscribe();
          this.handleDapiError(error);
        });
    });
  }

  private getSendTransactionParams(
    from: string,
    to: string,
    data: string,
    value?: string,
    gas?: string,
    gasPrice?: string
  ): object {
    if (value && !value.startsWith('0x')) {
      value = '0x' + new BigNumber(value).toString(16);
    }
    to = this.commonService.add0xHash(to);
    return {
      from,
      to,
      value,
      gas,
      gasPrice,
      data,
    };
  }

  private handleDapiError(error): void {
    this.commonService.log(error);
    switch (error.type) {
      case 'NO_PROVIDER':
        this.swapService.toDownloadWallet(this.myWalletName);
        break;
      case 4001:
        this.nzMessage.error('The request was rejected by the user');
        break;
      case -32602:
        this.nzMessage.error('The parameters were invalid');
        break;
      case -32603:
        this.nzMessage.error('Internal error'); // transaction underpriced
        break;
    }
  }

  private getAggregatorSwapJson(
    chain: CHAINS,
    aggregator: string
  ): Promise<any> {
    if (this.aggregatorSwapJson[chain][aggregator]) {
      return of(this.aggregatorSwapJson[chain][aggregator]).toPromise();
    }
    return this.http
      .get(`assets/contracts-json/O3Swap${chain}${aggregator}Bridge.json`)
      .pipe(
        map((res) => {
          this.aggregatorSwapJson[chain][aggregator] = res;
          return res;
        })
      )
      .toPromise();
  }

  private getWEthJson(): Promise<any> {
    if (this.wEthJson) {
      return of(this.wEthJson).toPromise();
    }
    return this.http
      .get('assets/contracts-json/weth.json')
      .pipe(
        map((res) => {
          this.wEthJson = res;
          return res;
        })
      )
      .toPromise();
  }

  private getEthErc20Json(): Promise<any> {
    if (this.ethErc20Json) {
      return of(this.ethErc20Json).toPromise();
    }
    return this.http
      .get('assets/contracts-json/eth-erc20.json')
      .pipe(
        map((res) => {
          this.ethErc20Json = res;
          return res;
        })
      )
      .toPromise();
  }

  private getSwapperJson(): Promise<any> {
    if (this.swapperJson) {
      return of(this.swapperJson).toPromise();
    }
    return this.http
      .get('assets/contracts-json/eth-swapper.json')
      .pipe(
        map((res) => {
          this.swapperJson = res;
          return res;
        })
      )
      .toPromise();
  }

  //#endregion
}
