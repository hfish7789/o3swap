import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import {
  ApiService,
  MetaMaskWalletApiService,
  O3EthWalletApiService,
  CommonService,
} from '@core';
import {
  BRIDGE_SLIPVALUE,
  EthWalletName,
  SwapStateType,
  Token,
  USD_TOKENS,
  SOURCE_TOKEN_SYMBOL,
  ConnectChainType,
  ETH_SOURCE_ASSET_HASH,
  CONST_BRIDGE_TOKENS,
  ChainTokens,
} from '@lib';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import BigNumber from 'bignumber.js';
import { interval, Observable, Unsubscribable } from 'rxjs';
import { ApproveComponent } from '@shared';

interface State {
  swap: SwapStateType;
  tokens: any;
  rates: any;
}
@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss'],
})
export class HubComponent implements OnInit, OnDestroy {
  CONST_BRIDGE_TOKENS = CONST_BRIDGE_TOKENS;
  SOURCE_TOKEN_SYMBOL = SOURCE_TOKEN_SYMBOL;
  BRIDGE_SLIPVALUE = BRIDGE_SLIPVALUE;
  USD_TOKENS = USD_TOKENS;
  fromToken: Token;
  toToken: Token;

  inputAmount: string;
  inputAmountFiat: string; // 支付的 token 美元价值
  inputAmountError: string;

  receiveAmount: string;
  receiveAmountFiat: string; // 支付的 token 美元价值

  swapUnScribe: Unsubscribable;
  swap$: Observable<any>;
  ethAccountAddress: string;
  bscAccountAddress: string;
  hecoAccountAddress: string;
  ethWalletName: EthWalletName;
  bscWalletName: EthWalletName;
  hecoWalletName: EthWalletName;
  tokenBalances = { ETH: {}, BSC: {}, HECO: {} };

  tokensUnScribe: Unsubscribable;
  tokens$: Observable<any>;
  chainTokens = new ChainTokens();

  ratesUnScribe: Unsubscribable;
  rates$: Observable<any>;
  rates = {};

  fromAddress: string;
  toAddress: string;
  bridgeRate: string;
  polyFee: string;

  showFromTokenList = false;
  showToTokenList = false;
  showFromTokenListModalTimeout;
  showToTokenListModalTimeout;
  showConnectWallet = false;
  connectChainType: ConnectChainType;

  constructor(
    public store: Store<State>,
    private apiService: ApiService,
    private modal: NzModalService,
    private nzMessage: NzMessageService,
    private metaMaskWalletApiService: MetaMaskWalletApiService,
    private changeDetectorRef: ChangeDetectorRef,
    private o3EthWalletApiService: O3EthWalletApiService,
    private commonService: CommonService
  ) {
    this.swap$ = store.select('swap');
    this.tokens$ = store.select('tokens');
    this.rates$ = store.select('rates');
  }
  ngOnDestroy(): void {
    if (this.swapUnScribe) {
      this.swapUnScribe.unsubscribe();
    }
    if (this.tokensUnScribe) {
      this.tokensUnScribe.unsubscribe();
    }
    if (this.ratesUnScribe) {
      this.ratesUnScribe.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.fromToken = JSON.parse(JSON.stringify(USD_TOKENS[0]));
    this.swapUnScribe = this.swap$.subscribe((state) => {
      this.ethAccountAddress = state.ethAccountAddress;
      this.bscAccountAddress = state.bscAccountAddress;
      this.hecoAccountAddress = state.hecoAccountAddress;
      this.ethWalletName = state.ethWalletName;
      this.bscWalletName = state.bscWalletName;
      this.hecoWalletName = state.hecoWalletName;
      this.getFromAndToAddress();
      this.handleAccountBalance(state);
    });
    this.tokensUnScribe = this.tokens$.subscribe((state) => {
      this.chainTokens = state.chainTokens;
    });
    this.ratesUnScribe = this.rates$.subscribe((state) => {
      this.rates = state.rates;
      this.calcutionInputAmountFiat();
      this.calcutionReceiveAmountFiat();
    });
  }

  showTokenListModal(type: 'from' | 'to'): void {
    if (type === 'from') {
      clearTimeout(this.showFromTokenListModalTimeout);
      this.showFromTokenList = true;
    } else {
      clearTimeout(this.showToTokenListModalTimeout);
      this.showToTokenList = true;
    }
  }

  hideTokenListModal(type: 'from' | 'to'): void {
    if (type === 'from') {
      this.showFromTokenListModalTimeout = setTimeout(() => {
        this.showFromTokenList = false;
      }, 200);
    } else {
      this.showToTokenListModalTimeout = setTimeout(() => {
        this.showToTokenList = false;
      }, 200);
    }
  }
  selectToken(type: 'from' | 'to', token: Token): void {
    this.showFromTokenList = false;
    this.showToTokenList = false;
    if (type === 'from') {
      this.fromToken = token;
      if (
        this.toToken &&
        this.toToken.assetID === token.assetID &&
        this.toToken.chain === token.chain
      ) {
        this.toToken = null;
        this.toAddress = null;
      }
      this.checkInputAmountDecimal();
      this.checkInputAmountLimit();
      this.calcutionInputAmountFiat();
      this.getFromTokenAmount();
    } else {
      this.toToken = token;
      if (
        this.fromToken &&
        this.fromToken.assetID === token.assetID &&
        this.fromToken.chain === token.chain
      ) {
        this.fromToken = null;
        this.fromAddress = null;
      }
    }
    this.getNetworkFee();
    this.getFromAndToAddress();
    this.calcutionReceiveAmount();
  }
  exchangeToken(): void {
    if (this.toToken || this.fromToken) {
      const temp = this.fromToken;
      this.fromToken = this.toToken;
      this.toToken = temp;
      this.checkInputAmountDecimal();
      this.checkInputAmountLimit();
      this.calcutionInputAmountFiat();
      this.calcutionReceiveAmount();
      this.getFromAndToAddress();
      this.getNetworkFee();
      this.getFromTokenAmount();
    }
  }

  allInputAmount(): void {
    this.inputAmountError = '';
    this.inputAmount = (this.fromToken && this.fromToken.amount) || '0';
    this.calcutionInputAmountFiat();
    this.calcutionReceiveAmount();
    this.checkInputAmountLimit();
  }

  changeInputAmount($event): void {
    this.inputAmount = $event.target.value;
    this.checkInputAmountDecimal();
    this.checkInputAmountLimit();
    this.calcutionInputAmountFiat();
    this.calcutionReceiveAmount();
  }

  checkCanInquiry(): boolean {
    if (!this.fromToken || !this.toToken || !this.inputAmount) {
      return false;
    }
    if (new BigNumber(this.inputAmount).comparedTo(0) <= 0) {
      return false;
    }
    if (this.checkInputAmountDecimal() === false) {
      return false;
    }
    if (this.checkInputAmountLimit() === false) {
      return false;
    }
    return true;
  }

  async swap(): Promise<void> {
    if (this.checkWalletConnect() === false) {
      return;
    }
    if (!this.fromAddress || !this.toAddress) {
      this.getFromAndToAddress();
    }
    const swapApi = this.getEthDapiService();
    if (swapApi.checkNetwork(this.fromToken) === false) {
      return;
    }
    if (this.checkBalance() === false) {
      return;
    }
    const showApprove = await this.checkShowApprove();
    if (showApprove === true) {
      this.showApproveModal();
      return;
    }
    const bigNumberReceive = new BigNumber(this.receiveAmount)
      .shiftedBy(this.toToken.decimals)
      .dp(0)
      .toFixed();
    swapApi
      .swapCrossChain(
        this.fromToken,
        this.toToken,
        this.inputAmount,
        this.fromAddress,
        this.toAddress,
        bigNumberReceive,
        BRIDGE_SLIPVALUE,
        this.polyFee,
        'bridge'
      )
      .then((res) => {
        if (res) {
          this.resetSwapData();
        }
      });
  }

  //#region
  async getNetworkFee(): Promise<void> {
    this.polyFee = '';
    if (this.fromToken && this.toToken) {
      this.polyFee = await this.apiService.getFromEthPolyFee(
        this.fromToken,
        this.toToken
      );
    }
  }
  showApproveModal(): void {
    let walletName: string;
    switch (this.fromToken.chain) {
      case 'ETH':
        walletName = this.ethWalletName;
        break;
      case 'BSC':
        walletName = this.bscWalletName;
        break;
      case 'HECO':
        walletName = this.hecoWalletName;
        break;
    }
    this.modal.create({
      nzContent: ApproveComponent,
      nzFooter: null,
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzClassName: 'custom-modal',
      nzComponentParams: {
        fromToken: this.fromToken,
        fromAddress: this.fromAddress,
        walletName,
      },
    });
  }
  resetSwapData(): void {
    this.fromToken = JSON.parse(JSON.stringify(USD_TOKENS[0]));
    this.toToken = null;
    this.inputAmount = null;
    this.inputAmountFiat = null;
    this.receiveAmount = null;
    this.receiveAmountFiat = null;
    this.fromAddress = null;
    this.toAddress = null;
    this.bridgeRate = null;
  }
  handleAccountBalance(state): void {
    this.tokenBalances.ETH = state.ethBalances;
    this.tokenBalances.BSC = state.bscBalances;
    this.tokenBalances.HECO = state.hecoBalances;
    this.getFromTokenAmount();
  }
  getFromTokenAmount(): void {
    if (!this.fromToken) {
      return;
    }
    this.fromToken.amount = '0';
    if (this.tokenBalances[this.fromToken.chain][this.fromToken.assetID]) {
      this.fromToken.amount = this.tokenBalances[this.fromToken.chain][
        this.fromToken.assetID
      ].amount;
    }
    this.changeDetectorRef.detectChanges();
  }
  checkWalletConnect(): boolean {
    if (
      (this.fromToken.chain === 'ETH' || this.toToken.chain === 'ETH') &&
      !this.ethAccountAddress
    ) {
      this.nzMessage.error('Please connect the ETH wallet first');
      this.showConnectWallet = true;
      this.connectChainType = 'ETH';
      return false;
    }
    if (
      (this.fromToken.chain === 'BSC' || this.toToken.chain === 'BSC') &&
      !this.bscAccountAddress
    ) {
      this.nzMessage.error('Please connect the BSC wallet first');
      this.showConnectWallet = true;
      this.connectChainType = 'BSC';
      return false;
    }
    if (
      (this.fromToken.chain === 'HECO' || this.toToken.chain === 'HECO') &&
      !this.hecoAccountAddress
    ) {
      this.nzMessage.error('Please connect the HECO wallet first');
      this.showConnectWallet = true;
      this.connectChainType = 'HECO';
      return false;
    }
    return true;
  }
  getFromAndToAddress(): void {
    switch (this.fromToken?.chain) {
      case 'ETH':
        this.fromAddress = this.ethAccountAddress;
        break;
      case 'BSC':
        this.fromAddress = this.bscAccountAddress;
        break;
      case 'HECO':
        this.fromAddress = this.hecoAccountAddress;
        break;
    }
    switch (this.toToken?.chain) {
      case 'ETH':
        this.toAddress = this.ethAccountAddress;
        break;
      case 'BSC':
        this.toAddress = this.bscAccountAddress;
        break;
      case 'HECO':
        this.toAddress = this.hecoAccountAddress;
        break;
    }
  }
  getEthDapiService(): any {
    let walletName;
    switch (this.fromToken?.chain) {
      case 'ETH':
        walletName = this.ethWalletName;
        break;
      case 'BSC':
        walletName = this.bscWalletName;
        break;
      case 'HECO':
        walletName = this.hecoWalletName;
        break;
    }
    return walletName === 'MetaMask' || !walletName
      ? this.metaMaskWalletApiService
      : this.o3EthWalletApiService;
  }
  async checkShowApprove(): Promise<boolean> {
    const swapApi = this.getEthDapiService();
    const balance = await swapApi.getAllowance(
      this.fromToken,
      this.fromAddress
    );
    if (
      new BigNumber(balance).comparedTo(new BigNumber(this.inputAmount)) >= 0
    ) {
      return false;
    } else {
      return true;
    }
  }
  checkInputAmountDecimal(): boolean {
    const decimalPart = this.inputAmount && this.inputAmount.split('.')[1];
    if (
      this.fromToken &&
      decimalPart &&
      decimalPart.length > this.fromToken.decimals
    ) {
      this.inputAmountError = `You've exceeded the decimal limit.`;
      return false;
    }
    this.inputAmountError = '';
    return true;
  }

  checkInputAmountLimit(): boolean {
    if (!this.fromToken) {
      this.inputAmountError = '';
      return;
    }
    const oneChainTokens: Token[] = this.chainTokens[this.fromToken.chain];
    const usdToken = oneChainTokens.find(
      (item) => item.assetID === this.fromToken.assetID
    );
    if (!usdToken) {
      this.inputAmountError = '';
      return;
    }
    const inputAmountBig = new BigNumber(this.inputAmount);
    const maxAmountBig = new BigNumber(usdToken.maxAmount);
    if (inputAmountBig.comparedTo(maxAmountBig) === 1) {
      this.inputAmountError = `You've exceeded the maximum limit`;
      return false;
    } else {
      return true;
    }
  }

  calcutionInputAmountFiat(): void {
    if (!this.fromToken) {
      this.inputAmountFiat = '';
      return;
    }
    const price = this.commonService.getAssetRate(this.rates, this.fromToken);
    if (this.inputAmount && price) {
      this.inputAmountFiat = new BigNumber(this.inputAmount)
        .multipliedBy(new BigNumber(price))
        .dp(2)
        .toFixed();
    } else {
      this.inputAmountFiat = '';
    }
  }

  calcutionReceiveAmountFiat(): void {
    if (!this.toToken) {
      this.receiveAmountFiat = '';
      return;
    }
    const price = this.commonService.getAssetRate(this.rates, this.fromToken);
    if (this.receiveAmount && price) {
      this.receiveAmountFiat = new BigNumber(this.receiveAmount)
        .multipliedBy(new BigNumber(price))
        .dp(2)
        .toFixed();
    } else {
      this.receiveAmountFiat = '';
    }
  }

  async calcutionReceiveAmount(): Promise<void> {
    this.getBridgeRate();
    if (!this.fromToken || !this.toToken || !this.inputAmount) {
      this.receiveAmount = '';
      return;
    }
    if (new BigNumber(this.inputAmount).comparedTo(0) <= 0) {
      this.receiveAmount = '';
      return;
    }
    this.receiveAmount = await this.apiService.getBridgeAmountOut(
      this.fromToken,
      this.toToken,
      this.inputAmount
    );
    this.calcutionReceiveAmountFiat();
    this.getBridgeRate();
  }
  getBridgeRate(): void {
    if (this.inputAmount && this.receiveAmount) {
      this.bridgeRate = new BigNumber(this.receiveAmount)
        .dividedBy(new BigNumber(this.inputAmount))
        .dp(4)
        .toFixed();
    } else {
      this.bridgeRate = '';
    }
  }
  checkBalance(): boolean {
    if (!this.tokenBalances || !this.tokenBalances[this.fromToken.chain]) {
      return false;
    }
    const chainBalances = this.tokenBalances[this.fromToken.chain];
    if (
      !chainBalances[this.fromToken.assetID] ||
      new BigNumber(chainBalances[this.fromToken.assetID].amount).comparedTo(
        new BigNumber(this.inputAmount)
      ) < 0
    ) {
      this.nzMessage.error('Insufficient balance');
      return false;
    }
    // 有 poly fee，转非原生资产
    if (
      this.polyFee &&
      (!chainBalances[ETH_SOURCE_ASSET_HASH] ||
        new BigNumber(chainBalances[ETH_SOURCE_ASSET_HASH].amount).comparedTo(
          new BigNumber(this.polyFee)
        ) < 0)
    ) {
      this.nzMessage.error(
        `Insufficient ${SOURCE_TOKEN_SYMBOL[this.fromToken.chain]} for poly fee`
      );
      return false;
    }
    return true;
  }
  //#endregion
}
