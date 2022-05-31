import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { NEO_TOKEN, NNEO_TOKEN, SwapStateType, Token } from '@lib';
import BigNumber from 'bignumber.js';
import { SwapSettingComponent, SwapTokenComponent } from '@shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Store } from '@ngrx/store';
import { Observable, Unsubscribable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService, ApiService } from '@core';

interface State {
  setting: any;
  swap: SwapStateType;
  rates: any;
}

@Component({
  selector: 'app-swap-home',
  templateUrl: './swap-home.component.html',
  styleUrls: ['../common.scss', './swap-home.component.scss'],
})
export class SwapHomeComponent implements OnInit, OnDestroy, OnChanges {
  @Input() fromToken: Token;
  @Input() toToken: Token;
  @Input() chooseSwapPath;
  @Input() inputAmount: string; 
  @Output() toInquiryPage = new EventEmitter<{
    inputAmount: string;
    fromToken: Token;
    toToken: Token;
  }>();
  @Output() toResultPage = new EventEmitter();

  swap$: Observable<any>;
  neoAccountAddress: string;
  ethAccountAddress: string;
  bscAccountAddress: string;
  hecoAccountAddress: string;
  tokenBalance = { ETH: {}, NEO: {}, BSC: {}, HECO: {} };
  swapUnScribe: Unsubscribable;

  // setting modal
  setting$: Observable<any>;
  settingUnScribe: Unsubscribable;
  slipValue: number;
  deadline: number;

  ratesUnScribe: Unsubscribable;
  rates$: Observable<any>;
  rates = {};

  changeData = false;
  inputAmountFiat: string; // 支付的 token 美元价值
  inputAmountError: string;

  constructor(
    private modal: NzModalService,
    public store: Store<State>,
    private nzMessage: NzMessageService,
    private commonService: CommonService,
    private apiService: ApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.setting$ = store.select('setting');
    this.swap$ = store.select('swap');
    this.rates$ = store.select('rates');
  }

  ngOnInit(): void {
    this.settingUnScribe = this.setting$.subscribe((state) => {
      this.slipValue = state.slipValue;
      this.deadline = state.deadline;
    });
    this.checkInputAmountDecimal();
    this.checkInputAmountLimit();
    this.calcutionInputAmountFiat();
    this.swapUnScribe = this.swap$.subscribe((state) => {
      this.neoAccountAddress = state.neoAccountAddress;
      this.ethAccountAddress = state.ethAccountAddress;
      this.bscAccountAddress = state.bscAccountAddress;
      this.hecoAccountAddress = state.hecoAccountAddress;
      this.handleTokenAmountBalance(state);
      this.changeDetectorRef.detectChanges();
    });
    this.ratesUnScribe = this.rates$.subscribe((state) => {
      this.rates = state.rates;
      this.calcutionInputAmountFiat();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fromToken) {
      const currentFromToken: Token = changes.fromToken.currentValue;
      if (
        currentFromToken &&
        this.tokenBalance[this.fromToken.chain][this.fromToken.assetID]
      ) {
        this.fromToken.amount = this.tokenBalance[this.fromToken.chain][
          this.fromToken.assetID
        ].amount;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.swapUnScribe) {
      this.swapUnScribe.unsubscribe();
    }
    if (this.settingUnScribe) {
      this.settingUnScribe.unsubscribe();
    }
    if (this.ratesUnScribe) {
      this.ratesUnScribe.unsubscribe();
    }
  }

  showTokens(type: 'from' | 'to'): void {
    const modal = this.modal.create({
      nzContent: SwapTokenComponent,
      nzFooter: null,
      nzTitle: null,
      nzClosable: false,
      nzClassName: 'custom-modal',
      nzComponentParams: {
        isFrom: type === 'from' ? true : false,
        fromToken: this.fromToken,
        toToken: this.toToken,
      },
    });
    modal.afterClose.subscribe((res: Token) => {
      if (res) {
        this.resetSwapData();
        if (
          type === 'from' &&
          (!this.fromToken ||
            res.assetID !== this.fromToken.assetID ||
            res.chain !== this.fromToken.chain)
        ) {
          if (this.fromToken && this.fromToken.chain !== res.chain) {
            this.toToken = null;
          }
          this.inputAmount = '';
          this.fromToken = res;
          this.checkInputAmountDecimal();
          this.checkInputAmountLimit();
          this.calcutionInputAmountFiat();
        }
        if (type !== 'from') {
          this.toToken = res;
        }
      }
    });
  }

  exchangeToken(): void {
    if (
      this.toToken &&
      this.fromToken &&
      this.toToken.chain !== this.fromToken.chain
    ) {
      return;
    }
    if (this.toToken || this.fromToken) {
      const temp = this.fromToken;
      this.fromToken = this.toToken;
      this.toToken = temp;
      this.resetSwapData();
      this.checkInputAmountDecimal();
      this.checkInputAmountLimit();
      this.calcutionInputAmountFiat();
    }
  }

  changeInputAmount($event): void {
    this.inputAmount = $event.target.value;
    this.resetSwapData();
    this.checkInputAmountDecimal();
    this.checkInputAmountLimit();
    this.calcutionInputAmountFiat();
  }

  allInputAmount(): void {
    this.inputAmountError = '';
    this.inputAmount = (this.fromToken && this.fromToken.amount) || '0';
    this.resetSwapData();
    this.checkInputAmountLimit();
    this.calcutionInputAmountFiat();
  }

  inquiry(): void {
    // if (this.checkWalletConnect() === false) {
    //   return;
    // }
    this.toInquiryPage.emit({
      inputAmount: this.inputAmount,
      fromToken: this.fromToken,
      toToken: this.toToken,
    });
  }

  backToResultPage(): void {
    this.toResultPage.emit();
  }

  showSetting(): void {
    this.modal.create({
      nzContent: SwapSettingComponent,
      nzFooter: null,
      nzTitle: null,
      nzClosable: false,
      nzClassName: 'custom-modal',
    });
  }
  //#region
  handleTokenAmountBalance(state): void {
    this.tokenBalance.NEO = state.balances;
    this.tokenBalance.ETH = state.ethBalances;
    this.tokenBalance.BSC = state.bscBalances;
    this.tokenBalance.HECO = state.hecoBalances;
    if (this.fromToken) {
      this.fromToken.amount = '0';
    }
    if (
      this.fromToken &&
      this.tokenBalance[this.fromToken.chain][this.fromToken.assetID]
    ) {
      this.fromToken.amount = this.tokenBalance[this.fromToken.chain][
        this.fromToken.assetID
      ].amount;
      this.fromToken.amount = this.tokenBalance[this.fromToken.chain][
        this.fromToken.assetID
      ].amount;
    }
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
  checkWalletConnect(): boolean {
    if (
      (this.fromToken.chain === 'NEO' || this.toToken.chain === 'NEO') &&
      !this.neoAccountAddress
    ) {
      this.nzMessage.error('Please connect the NEO wallet first');
      return false;
    }
    if (
      (this.fromToken.chain === 'ETH' || this.toToken.chain === 'ETH') &&
      !this.ethAccountAddress
    ) {
      this.nzMessage.error('Please connect the ETH wallet first');
      return false;
    }
    if (
      (this.fromToken.chain === 'BSC' || this.toToken.chain === 'BSC') &&
      !this.bscAccountAddress
    ) {
      this.nzMessage.error('Please connect the BSC wallet first');
      return false;
    }
    if (
      (this.fromToken.chain === 'HECO' || this.toToken.chain === 'HECO') &&
      !this.hecoAccountAddress
    ) {
      this.nzMessage.error('Please connect the HECO wallet first');
      return false;
    }
    return true;
  }
  checkInputAmountLimit(): boolean {
    try {
      const inputAmountBig = new BigNumber(this.inputAmount);
      const maxAmountBig = new BigNumber(this.fromToken.maxAmount);
      if (inputAmountBig.comparedTo(maxAmountBig) === 1) {
        this.inputAmountError = `You've exceeded the maximum limit`;
        return false;
      } else {
        return true;
      }
    } catch (error) {
      // this.commonService.log(error);
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
    // neo nneo 互换只能整单位
    if (
      this.fromToken &&
      this.fromToken.chain === 'NEO' &&
      this.fromToken.assetID === NNEO_TOKEN.assetID &&
      this.toToken &&
      this.toToken.chain === 'NEO' &&
      this.toToken.assetID === NEO_TOKEN.assetID &&
      decimalPart &&
      decimalPart.length > 0
    ) {
      this.inputAmountError = `You've exceeded the decimal limit.`;
      return false;
    }
    this.inputAmountError = '';
    return true;
  }
  resetSwapData(): void {
    this.changeData = true;
    this.chooseSwapPath = {};
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
  //#endregion
}
