import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService, MetaMaskWalletApiService } from '@core';
import { ChainTokens, CHAIN_TOKENS, NNEO_TOKEN, Token, USD_TOKENS } from '@lib';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Unsubscribable, Observable } from 'rxjs';

interface State {
  tokens: any;
}

type PageStatus = 'home' | 'result';
@Component({
  selector: 'app-swap',
  templateUrl: './swap.component.html',
  styleUrls: ['./swap.component.scss'],
})
export class SwapComponent implements OnInit, OnDestroy {
  pageStatus: PageStatus = 'home';

  fromToken: Token;
  toToken: Token;
  inputAmount: string; // 支付的 token 数量

  initResultData;

  tokensUnScribe: Unsubscribable;
  tokens$: Observable<any>;
  chainTokens = new ChainTokens();
  constructor(
    private store: Store<State>,
    private apiService: ApiService,
    private metaMaskWalletApiService: MetaMaskWalletApiService,
    private nzMessage: NzMessageService
  ) {
    this.tokens$ = store.select('tokens');
    this.tokensUnScribe = this.tokens$.subscribe((state) => {
      this.chainTokens = state.chainTokens;
    });
  }

  async ngOnInit(): Promise<void> {
    const chain = this.metaMaskWalletApiService.getChain();
    if (chain) {
      await this.apiService.getTokens();
      this.fromToken = Object.assign({}, this.chainTokens[chain][0]);
    } else {
      this.fromToken = USD_TOKENS[0];
    }
  }

  ngOnDestroy(): void {
    if (this.tokensUnScribe) {
      this.tokensUnScribe.unsubscribe();
    }
  }

  //#region home
  toInquiryPage({ inputAmount, fromToken, toToken }): void {
    this.initResultData = null;
    this.inputAmount = inputAmount;
    this.fromToken = fromToken;
    this.toToken = toToken;
    this.pageStatus = 'result';
  }
  toResultPage(): void {
    this.pageStatus = 'result';
  }
  //#endregion

  //#endregion result
  closeResultPage(initData: any): void {
    if (initData) {
      this.initResultData = initData;
    } else {
      this.fromToken = null;
      this.toToken = null;
      this.inputAmount = '';
      this.initResultData = null;
    }
    this.pageStatus = 'home';
  }
  swapFail(): void {
    this.pageStatus = 'home';
    this.initResultData = null;
    this.nzMessage.error('Did not get the quotation, please get it again');
  }
  //#region
}
