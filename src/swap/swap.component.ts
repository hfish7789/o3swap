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
export class SwapComponent{}
