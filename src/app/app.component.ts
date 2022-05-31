import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import {
  NeolineWalletApiService,
  MetaMaskWalletApiService,
  VaultdMetaMaskWalletApiService,
  O3NeoWalletApiService,
  ApiService,
} from '@core';
import { RiskWarningComponent } from '@shared';
import { NzModalService } from 'ng-zorro-antd/modal';
import { interval, Unsubscribable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currentPage = this.router.url;
  isHome = true;
  showRisk = true;

  updateRatesInterval: Unsubscribable;

  constructor(
    private router: Router,
    private metaMaskWalletApiService: MetaMaskWalletApiService,
    private neolineWalletApiService: NeolineWalletApiService,
    private o3NeoWalletApiService: O3NeoWalletApiService,
    private vaultdMetaMaskWalletApiService: VaultdMetaMaskWalletApiService,
    private modal: NzModalService,
    private apiService: ApiService
  ) {
    this.router.events.subscribe((res: RouterEvent) => {
      if (res instanceof NavigationEnd) {
        this.currentPage = res.urlAfterRedirects || res.url;
        this.isHome = this.isHomePage();
        if (
          sessionStorage.getItem(`${this.currentPage}WarningDialog`) !==
            'true' &&
          location.pathname !== '/' &&
          location.pathname !== '/home'
        ) {
          this.riskWarning();
        }
        this.updateRates();
      }
    });
  }

  ngOnInit(): void {
    this.apiService.getRates();
    const sessionShowRisk = sessionStorage.getItem('showRisk');
    if (sessionShowRisk !== undefined) {
      this.showRisk = sessionShowRisk === 'false' ? false : true;
    }
    if (location.pathname !== '/' && location.pathname !== '/home') {
      this.neolineWalletApiService.init();
      this.metaMaskWalletApiService.init();
      this.vaultdMetaMaskWalletApiService.init();
      this.o3NeoWalletApiService.init();
    }
  }

  updateRates(): void {
    if (!this.isHome) {
      if (this.updateRatesInterval) {
        return;
      }
      this.updateRatesInterval = interval(60000).subscribe(() => {
        this.apiService.getRates();
      });
    } else {
      if (this.updateRatesInterval) {
        this.updateRatesInterval.unsubscribe();
      }
    }
  }

  closeRisk(): void {
    this.showRisk = false;
    sessionStorage.setItem('showRisk', this.showRisk ? 'true' : 'false');
  }

  isHomePage(): boolean {
    if (this.currentPage === '/' || this.currentPage === '/home') {
      return true;
    }
    return false;
  }

  riskWarning(): void {
    const modal = this.modal.create({
      nzContent: RiskWarningComponent,
      nzFooter: null,
      nzTitle: null,
      nzClosable: false,
      nzMaskClosable: false,
      nzClassName: 'custom-modal',
    });
    modal.afterClose.subscribe(() => {
      sessionStorage.setItem(`${this.currentPage}WarningDialog`, 'true');
    });
  }
}
