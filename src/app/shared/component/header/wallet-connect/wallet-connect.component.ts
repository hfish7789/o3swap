import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import {
  ETH_WALLETS,
  NEO_WALLETS,
  BSC_WALLETS,
  HECO_WALLETS,
  NeoWalletName,
  EthWalletName,
  SwapStateType,
  NeoWallet,
  EthWallet,
} from '@lib';
import {
  CommonService,
  ApiService,
  MetaMaskWalletApiService,
  NeolineWalletApiService,
  O3EthWalletApiService,
  O3NeoWalletApiService,
} from '@core';
import { Store } from '@ngrx/store';
import { Observable, Unsubscribable } from 'rxjs';
import { environment } from '@env/environment';

export type ConnectChainType = 'ETH' | 'NEO' | 'BSC' | 'HECO';
interface State {
  swap: SwapStateType;
}

@Component({
  selector: 'app-wallet-connect',
  templateUrl: './wallet-connect.component.html',
  styleUrls: ['../wallet-connect.scss'],
})
export class WalletConnectComponent implements OnInit, OnDestroy {
  NEO_WALLETS = NEO_WALLETS;
  ETH_WALLETS = ETH_WALLETS;
  BSC_WALLETS = BSC_WALLETS;
  HECO_WALLETS = HECO_WALLETS;
  @Input() show: boolean;
  @Input() connectOne?: boolean;
  @Input() connectChainType: ConnectChainType;
  @Output() closePage = new EventEmitter();

  swap$: Observable<any>;
  swapUnScribe: Unsubscribable;
  neoAccountAddress: string;
  ethAccountAddress: string;
  bscAccountAddress: string;
  hecoAccountAddress: string;
  neoWalletName: NeoWalletName;
  ethWalletName: EthWalletName;
  bscWalletName: EthWalletName;
  hecoWalletName: EthWalletName;

  constructor(
    store: Store<State>,
    private commonService: CommonService,
    public apiService: ApiService,
    private o3NeoWalletApiService: O3NeoWalletApiService,
    private o3EthWalletApiService: O3EthWalletApiService,
    private neolineWalletApiService: NeolineWalletApiService,
    private metaMaskWalletApiService: MetaMaskWalletApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.swap$ = store.select('swap');
  }
  ngOnDestroy(): void {
    if (this.swapUnScribe) {
      this.swapUnScribe.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.swapUnScribe = this.swap$.subscribe((state) => {
      this.neoAccountAddress = state.neoAccountAddress;
      this.ethAccountAddress = state.ethAccountAddress;
      this.bscAccountAddress = state.bscAccountAddress;
      this.hecoAccountAddress = state.hecoAccountAddress;
      this.neoWalletName = state.neoWalletName;
      this.ethWalletName = state.ethWalletName;
      this.bscWalletName = state.bscWalletName;
      this.hecoWalletName = state.hecoWalletName;
      // this.changeDetectorRef.detectChanges();
    });
  }

  copy(value: string): void {
    this.commonService.copy(value);
  }

  close(): void {
    this.closePage.emit();
  }

  //#region connect wallet modal
  async connectNeoWallet(wallet: NeoWallet): Promise<void> {
    if (this.neoWalletName === wallet.name) {
      return;
    }
    let connectRes;
    switch (wallet.name) {
      case 'NeoLine':
        connectRes = await this.neolineWalletApiService.connect();
        break;
      case 'O3':
        connectRes = await this.o3NeoWalletApiService.connect();
        break;
    }
    if (this.connectOne && connectRes) {
      this.close();
    }
  }

  async connectEthWallet(wallet: EthWallet): Promise<void> {
    let connectRes;
    if (environment.testSite === false && wallet.name === 'O3') {
      return;
    }
    switch (this.connectChainType) {
      case 'ETH':
        if (this.ethWalletName === wallet.name) {
          return;
        }
        break;
      case 'BSC':
        if (this.bscWalletName === wallet.name) {
          return;
        }
        break;
      case 'HECO':
        if (this.hecoWalletName === wallet.name) {
          return;
        }
        break;
      default:
        break;
    }
    switch (wallet.name) {
      case 'MetaMask':
        connectRes = await this.metaMaskWalletApiService.connect(
          this.connectChainType
        );
        break;
      case 'O3':
        connectRes = await this.o3EthWalletApiService.connect(
          this.connectChainType
        );
        break;
    }
    if (this.connectOne && connectRes) {
      this.close();
    }
  }
  //#endregion
}
