import { Injectable } from '@angular/core';
import {
  ConnectChainType,
  EthWalletName,
  RESET_VAULT_WALLET,
  UPDATE_VAULT_WALLET,
} from '@lib';
import { Store } from '@ngrx/store';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable } from 'rxjs';
import { CommonService } from '../common.service';
import { SwapService } from '../swap.service';
import Web3 from 'web3';
import { VaultWallet } from 'src/app/_lib/vault';
interface State {
  vault: any;
}
@Injectable()
export class VaultdMetaMaskWalletApiService {
  myWalletName: EthWalletName = 'MetaMask';

  vault$: Observable<any>;
  vaultWallet: VaultWallet;

  ethereum;
  web3: Web3;

  constructor(
    private store: Store<State>,
    private nzMessage: NzMessageService,
    private swapService: SwapService,
    private commonService: CommonService
  ) {
    this.vault$ = store.select('vault');
    this.vault$.subscribe((state) => {
      this.vaultWallet = state.vaultWallet;
    });
  }

  //#region connect
  init(): void {
    setTimeout(() => {
      if ((window as any).ethereum && (window as any).ethereum.isConnected()) {
        (window as any).ethereum
          .request({ method: 'eth_accounts' })
          .then((result) => {
            if (result.length === 0) {
              return;
            }
            const localVaultWallet = JSON.parse(
              sessionStorage.getItem('valueWallet')
            );
            if (
              localVaultWallet &&
              localVaultWallet.walletName === 'MetaMask'
            ) {
              this.vaultConnect(localVaultWallet.chain, false);
            }
          });
      }
    }, 1000);
  }
  vaultConnect(chain: string, showMessage = true): Promise<VaultWallet> {
    if (!(window as any).ethereum) {
      this.swapService.toDownloadWallet(this.myWalletName);
      return;
    }
    this.web3 = new Web3((window as any).ethereum);
    this.ethereum = (window as any).ethereum;
    return this.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((result) => {
        if (result.length <= 0) {
          return;
        }
        this.commonService.log(result);
        if (showMessage) {
          this.nzMessage.success('Connection succeeded!');
        }
        this.vaultWallet = {
          walletName: this.myWalletName,
          address: result[0],
          chain: chain as ConnectChainType,
        };
        this.store.dispatch({
          type: UPDATE_VAULT_WALLET,
          data: this.vaultWallet,
        });
        this.addListener();
        return this.vaultWallet;
      })
      .catch((error) => {
        this.handleDapiError(error);
      });
  }

  //#region private function
  private handleDapiError(error): void {
    this.commonService.log(error);
    switch (error.code) {
      case 4001:
        this.nzMessage.error('The request was rejected by the user');
        break;
      case -32602:
        this.nzMessage.error('The parameters were invalid');
        break;
      case -32603:
        this.nzMessage.error('Internal error'); // transaction underpriced
        break;
    }
  }

  private addListener(): void {
    this.ethereum.on('accountsChanged', (accounts) => {
      if (
        this.vaultWallet &&
        this.vaultWallet.walletName === this.myWalletName
      ) {
        const accountAddress = accounts.length > 0 ? accounts[0] : null;
        if (accountAddress !== null) {
          this.vaultWallet.address = accountAddress;
          this.store.dispatch({
            type: UPDATE_VAULT_WALLET,
            data: this.vaultWallet,
          });
        } else {
          this.store.dispatch({ type: RESET_VAULT_WALLET });
        }
      }
    });
  }
  //#endregion
}
