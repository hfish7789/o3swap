import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import rootReducer from './reduers';
import { GoogleChartsModule } from 'angular-google-charts';
import {
  HomeComponent,
  SwapComponent,
  // SwapHomeComponent,
  // SwapResultComponent,
  VaultComponent,
  HubComponent,
  HubPoolComponent,
  LiquidityComponent,
  DashComponent,
  ChartsComponent,
  ChartVolumnComponent
} from './pages';

const PAGECOMPONENTS = [
  HomeComponent,
  SwapComponent,
  // SwapHomeComponent,
  // SwapResultComponent,
  VaultComponent,
  HubComponent,
  HubPoolComponent,
  LiquidityComponent,
  DashComponent,
  ChartsComponent,
  ChartVolumnComponent
];

//#region ng-zorro-antd
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NgApexchartsModule } from "ng-apexcharts";
registerLocaleData(en);
//#endregion

// #region Http Interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptor } from '@core';
const INTERCEPTOR_PROVIDES = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptor,
    multi: true,
  },
];
// #endregion

//#region lottie
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

//#region echarts
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';
// Note we need a separate function as it's required
// by the AOT compiler.
function playerFactory(): any {
  return player;
}
//#endregion

@NgModule({
  declarations: [AppComponent, ...PAGECOMPONENTS],
  imports: [
    BrowserModule,
    NgApexchartsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    LottieModule.forRoot({ player: playerFactory }),
    StoreModule.forRoot(rootReducer, {
      runtimeChecks: {
        strictActionImmutability: false,
        strictStateImmutability: false,
      },
    }),
    NgxEchartsModule.forRoot({ echarts }),
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, ...INTERCEPTOR_PROVIDES],
  bootstrap: [AppComponent],
})
export class AppModule {}
