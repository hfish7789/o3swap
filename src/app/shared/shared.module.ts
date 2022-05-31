import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LoadingComponent } from './component/loading/loading.component';
import { TxProgressComponent } from './component/tx-progress/tx-progress.component';
import { LongBalanceComponent } from './component/long-balance/long-balance.component';
import { ExchartLiquidfillComponent } from './component/echarts-liquidfill/echarts-liquidfill.component';
import {
  HeaderConnectComponent,
  HeaderConnectItemComponent,
  WalletConnectComponent,
  WalletConnectItemComponent,
  VaultWalletConnectComponent,
  VaultHeaderConnectComponent,
} from './component/header';

import { SwapSettingComponent } from './modal/swap-setting/swap-setting.component';
import { SwapExchangeComponent } from './modal/swap-exchange/swap-exchange.component';
import { SwapTokenComponent } from './modal/swap-token/swap-token.component';
import { VaultStakeComponent } from './modal/vault-stake/vault-stake.component';
import { ApproveComponent } from './modal/approve/approve.component';
import { RiskWarningComponent } from './modal/risk-warning/risk-warning.component';

import { ShortAddressPipe } from './pipes/short-address.pipe';
import { TransNumberPipe } from './pipes/trans-number.pipe';
import { TranslatePipe } from './pipes/translate.pipe';

import { ErrSrcDirective } from './directive/err-src.directive';

import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzElementPatchModule } from 'ng-zorro-antd/core/element-patch';
import { LottieModule } from 'ngx-lottie';
import { NgxEchartsModule } from 'ngx-echarts';

const COMPONENTS = [
  LoadingComponent,
  SwapSettingComponent,
  SwapExchangeComponent,
  SwapTokenComponent,
  VaultStakeComponent,
  TxProgressComponent,
  ApproveComponent,
  ExchartLiquidfillComponent,
  HeaderConnectComponent,
  HeaderConnectItemComponent,
  WalletConnectComponent,
  WalletConnectItemComponent,
  VaultWalletConnectComponent,
  VaultHeaderConnectComponent,
  LongBalanceComponent,
  RiskWarningComponent,
];
const PIPES = [ShortAddressPipe, TransNumberPipe, TranslatePipe];
const DIRECTIVES = [ErrSrcDirective];
const THIRD_MODULES = [
  NzNotificationModule,
  NzMessageModule,
  NzToolTipModule,
  NzButtonModule,
  NzModalModule,
  NzProgressModule,
  LottieModule,
  NgxEchartsModule,
  NzElementPatchModule,
];

@NgModule({
  declarations: [...PIPES, ...COMPONENTS, ...DIRECTIVES],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...THIRD_MODULES],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...PIPES,
    ...THIRD_MODULES,
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
})
export class SharedModule {}
