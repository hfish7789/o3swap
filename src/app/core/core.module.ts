import { APP_INITIALIZER, NgModule } from '@angular/core';

import { StartupService } from './startup/startup.service';
export function StartupServiceFactory(startupService: StartupService): any {
  return () => startupService.load();
}
const APPINIT_PROVIDES = [
  StartupService,
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true,
  },
];

//#region services
import { ApiService } from './api/api.service';
import { CommonService } from './util/common.service';
import { SwapService } from './util/swap.service';
import { MetaMaskWalletApiService } from './util/walletApi/metamask';
import { NeolineWalletApiService } from './util/walletApi/neoline';
import { O3NeoWalletApiService } from './util/walletApi/o3-neo';
import { O3EthWalletApiService } from './util/walletApi/o3-eth';
import { VaultdMetaMaskWalletApiService } from './util/walletApi/vault-metamask';

const SERVICES = [
  ApiService,
  CommonService,
  SwapService,
  MetaMaskWalletApiService,
  NeolineWalletApiService,
  O3NeoWalletApiService,
  O3EthWalletApiService,
  VaultdMetaMaskWalletApiService,
];
//#endregion

@NgModule({
  providers: [...SERVICES, ...APPINIT_PROVIDES],
})
export class CoreModule {}
