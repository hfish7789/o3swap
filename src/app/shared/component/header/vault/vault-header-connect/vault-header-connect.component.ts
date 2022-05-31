import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ConnectChainType, RESET_VAULT_WALLET } from '@lib';
import { CommonService } from '@core';
import { Store } from '@ngrx/store';
import { Observable, Unsubscribable } from 'rxjs';
import { VaultWallet } from 'src/app/_lib/vault';

interface State {
  vault: any;
}

@Component({
  selector: 'app-vault-header-connect',
  templateUrl: './vault-header-connect.component.html',
  styleUrls: ['../../header-connect.scss'],
})
export class VaultHeaderConnectComponent implements OnInit, OnDestroy {
  connectChainType: ConnectChainType = 'ETH';
  showConnectModal = false; // connect wallet modal

  vault$: Observable<any>;
  vaultUnScribe: Unsubscribable;
  vaultWallet: VaultWallet;

  constructor(
    private store: Store<State>,
    private commonService: CommonService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.vault$ = store.select('vault');
  }

  ngOnInit(): void {
    this.vaultUnScribe = this.vault$.subscribe((state) => {
      this.vaultWallet = state.vaultWallet;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.vaultUnScribe) {
      this.vaultUnScribe.unsubscribe();
    }
  }

  showConnect(): void {
    this.commonService.log('---');
    this.showConnectModal = true;
  }

  copy(value: string): void {
    this.commonService.copy(value);
  }

  //#region account modal
  disConnect(): void {
    this.store.dispatch({ type: RESET_VAULT_WALLET });
  }

  changeWallet(): void {
    this.connectChainType = this.vaultWallet.chain;
    this.showConnectModal = true;
  }
  //#endregion
}
