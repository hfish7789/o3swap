import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import {
  SwapStateType,
  CHAINS,
  NNEO_TOKEN,
  USD_TOKENS,
  ChainTokens,
  NEO_TOKEN,
} from '@lib';
import { Token } from '@lib';
import { Observable, Unsubscribable } from 'rxjs';
import { Store } from '@ngrx/store';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ApiService } from '@core';
interface State {
  swap: SwapStateType;
  tokens: any;
}
@Component({
  templateUrl: './swap-token.component.html',
  styleUrls: ['./swap-token.component.scss'],
})
export class SwapTokenComponent implements OnInit, OnDestroy {
  MYNNEO_TOKEN;
  MYCHAIN_TOKENS;
  @Input() isFrom: boolean;
  @Input() fromToken: Token;
  @Input() toToken: Token;

  activeToken: Token;
  hideToken: Token;
  hideNeoToken = false; // from 或 to 不是 NNEO 时不显示 NEO
  showOnlyNNeo = false; // from 或 to 是 NEO 时只显示 NNEO
  showOnlyNeoChain = false;

  swap$: Observable<any>;
  tokenBalance = { NEO: {}, ETH: {}, BSC: {}, HECO: {} }; // 账户的 tokens
  swapUnScribe: Unsubscribable;

  tokensUnScribe: Unsubscribable;
  tokens$: Observable<any>;
  chainTokens = new ChainTokens();

  chain: CHAINS = 'ETH';
  allTokens: Token[] = []; // 所有的 tokens, 排除了 fromToken 或 toToken
  displayTokens: any[] = []; // 最终展示的 tokens, search 结果
  isfocusSearchInput = false;

  constructor(
    private store: Store<State>,
    private changeDetectorRef: ChangeDetectorRef,
    private modal: NzModalRef,
    private apiService: ApiService
  ) {
    this.swap$ = store.select('swap');
    this.tokens$ = store.select('tokens');
    this.tokensUnScribe = this.tokens$.subscribe((state) => {
      this.chainTokens = state.chainTokens;
    });
  }
  ngOnDestroy(): void {
    if (this.swapUnScribe) {
      this.swapUnScribe.unsubscribe();
    }
    if (this.tokensUnScribe) {
      this.tokensUnScribe.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.getChainType();
    this.cloneTokens();
    this.checkShowOnlyNNeo();
    this.checkHideNeo();
    this.activeToken = this.isFrom ? this.fromToken : this.toToken;
    this.hideToken = this.isFrom ? this.toToken : this.fromToken;
    this.getTokens();
    this.swapUnScribe = this.swap$.subscribe((state) => {
      this.receiveTokenBalance(state);
      this.changeDetectorRef.detectChanges();
    });
    if (this.fromToken) {
      this.changeChain(this.fromToken.chain);
    }
  }

  cloneTokens(): void {
    this.MYCHAIN_TOKENS = {};
    this.MYCHAIN_TOKENS.ALL = JSON.parse(JSON.stringify(this.chainTokens.ALL));
    this.MYCHAIN_TOKENS.NEO = JSON.parse(JSON.stringify(this.chainTokens.NEO));
    this.MYCHAIN_TOKENS.ETH = JSON.parse(JSON.stringify(this.chainTokens.ETH));
    this.MYCHAIN_TOKENS.BSC = JSON.parse(JSON.stringify(this.chainTokens.BSC));
    this.MYCHAIN_TOKENS.HECO = JSON.parse(
      JSON.stringify(this.chainTokens.HECO)
    );
    this.MYNNEO_TOKEN = [JSON.parse(JSON.stringify(NNEO_TOKEN))];
  }

  close(): void {
    this.modal.close();
  }

  changeChain(chain: CHAINS): void {
    if (this.chain === chain) {
      return;
    }
    this.chain = chain;
    const tokens = this.showOnlyNNeo
      ? this.MYNNEO_TOKEN
      : this.MYCHAIN_TOKENS[this.chain];
    this.allTokens = tokens;
    if (this.hideToken && this.hideToken.chain === this.chain) {
      this.allTokens = this.allTokens.filter(
        (item) => item.assetID !== this.hideToken.assetID
      );
    }
    if (this.hideNeoToken && this.chain === 'NEO') {
      this.allTokens = this.allTokens.filter(
        (item) => item.assetID !== NEO_TOKEN.assetID
      );
    }
    this.displayTokens = this.allTokens;
  }

  isDisableToken(token: Token): boolean {
    if (
      !this.isFrom &&
      this.fromToken.chain !== this.chain &&
      USD_TOKENS.findIndex((usdItem) => usdItem.assetID === token.assetID) < 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  selectThisToken(token: Token): void {
    if (this.isDisableToken(token)) {
      return;
    }
    this.modal.close(token);
  }

  search($event): void {
    let value: string = $event.target.value;
    value = value.trim().toLowerCase();
    if (value === '') {
      this.displayTokens = this.allTokens;
      return;
    }
    const tempTokens = this.allTokens.filter((item) =>
      item.symbol.toLowerCase().startsWith(value)
    );
    this.allTokens.forEach((item) => {
      if (
        item.symbol.toLowerCase().includes(value) &&
        !item.symbol.toLowerCase().startsWith(value)
      ) {
        tempTokens.push(item);
      }
    });
    this.displayTokens = tempTokens;
  }

  //#region
  getChainType(): void {
    if (this.isFrom) {
      if (this.toToken) {
        this.chain = this.toToken.chain;
      }
    } else {
      if (this.fromToken) {
        this.chain = this.fromToken.chain;
      }
    }
  }
  getTokens(): void {
    const tokens = this.showOnlyNNeo
      ? this.MYNNEO_TOKEN
      : this.MYCHAIN_TOKENS[this.chain];
    this.allTokens = tokens;
    if (this.hideToken && this.hideToken.chain === this.chain) {
      this.allTokens = this.allTokens.filter(
        (item) => item.assetID !== this.hideToken.assetID
      );
    }
    if (this.hideNeoToken && this.chain === 'NEO') {
      this.allTokens = this.allTokens.filter(
        (item) => item.assetID !== NEO_TOKEN.assetID
      );
    }
    this.displayTokens = this.allTokens;
  }
  checkShowOnlyNNeo(): void {
    const showOnlyNNeoTo =
      this.isFrom === false &&
      this.fromToken &&
      this.fromToken.chain === 'NEO' &&
      this.fromToken.assetID === NEO_TOKEN.assetID;
    const showOnlyNNeoFrom =
      this.isFrom &&
      this.toToken &&
      this.toToken.chain === 'NEO' &&
      this.toToken.assetID === NEO_TOKEN.assetID;
    if (showOnlyNNeoFrom || showOnlyNNeoTo) {
      this.showOnlyNNeo = true;
    } else {
      this.showOnlyNNeo = false;
    }
    if (!this.isFrom && this.fromToken.chain === 'NEO') {
      this.showOnlyNeoChain = true;
    } else {
      this.showOnlyNeoChain = false;
    }
  }
  checkHideNeo(): void {
    if (
      this.isFrom &&
      this.toToken &&
      this.toToken.chain === 'NEO' &&
      this.toToken.assetID !== NNEO_TOKEN.assetID
    ) {
      this.hideNeoToken = true;
    }
    if (
      !this.isFrom &&
      this.fromToken &&
      this.fromToken.chain === 'NEO' &&
      this.fromToken.assetID !== NNEO_TOKEN.assetID
    ) {
      this.hideNeoToken = true;
    }
  }
  receiveTokenBalance(state): void {
    this.tokenBalance.NEO = state.balances;
    this.tokenBalance.ETH = state.ethBalances;
    this.tokenBalance.BSC = state.bscBalances;
    this.tokenBalance.HECO = state.hecoBalances;
    this.handleTokenAmount();
  }
  handleTokenAmount(): void {
    if (this.tokenBalance.NEO[this.MYNNEO_TOKEN[0].assetID]) {
      this.MYNNEO_TOKEN[0].amount = this.tokenBalance.NEO[
        this.MYNNEO_TOKEN[0].assetID
      ].amount;
    }
    // chainType tokens
    Object.keys(this.MYCHAIN_TOKENS).forEach((key) => {
      this.MYCHAIN_TOKENS[key].forEach((tokenItem, index) => {
        const chainBalance = this.tokenBalance[tokenItem.chain];
        if (
          chainBalance[tokenItem.assetID] &&
          chainBalance[tokenItem.assetID].symbol === // 资产id相同且symbol相同
            tokenItem.symbol
        ) {
          this.MYCHAIN_TOKENS[key][index].amount =
            chainBalance[tokenItem.assetID].amount;
        }
      });
      this.MYCHAIN_TOKENS[key] = this.sortTokens(this.MYCHAIN_TOKENS[key]);
    });
    // alltokens
    this.allTokens.forEach((tokenItem, index) => {
      const chainBalance = this.tokenBalance[tokenItem.chain];
      if (
        chainBalance[tokenItem.assetID] &&
        chainBalance[tokenItem.assetID].symbol === // 资产id相同且symbol相同
          tokenItem.symbol
      ) {
        this.allTokens[index].amount = chainBalance[tokenItem.assetID].amount;
      }
    });
    this.allTokens = this.sortTokens(this.allTokens);
    // display tokens
    this.displayTokens.forEach((tokenItem, index) => {
      const chainBalance = this.tokenBalance[tokenItem.chain];
      if (
        chainBalance[tokenItem.assetID] &&
        chainBalance[tokenItem.assetID].symbol === // 资产id相同且symbol相同
          tokenItem.symbol
      ) {
        this.displayTokens[index].amount =
          chainBalance[tokenItem.assetID].amount;
      }
    });
    this.displayTokens = this.sortTokens(this.displayTokens);
  }
  sortTokens(tokens: Token[]): Token[] {
    const targetTokens = [];
    const noMoneyTokens = [];
    tokens.forEach((item) => {
      if (item.amount !== '0') {
        targetTokens.push(item);
      } else {
        noMoneyTokens.push(item);
      }
    });
    return targetTokens.concat(...noMoneyTokens);
  }
  //#endregion
}
