import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonService } from '@core';
import { ConnectChainType } from '@lib';
import { environment } from '@env/environment';

@Component({
  selector: 'app-wallet-connect-item',
  templateUrl: './wallet-connect-item.component.html',
  styleUrls: ['./wallet-connect-item.component.scss'],
})
export class WalletConnectItemComponent implements OnInit {
  @Input() walletList: any[];
  @Input() chain: ConnectChainType;
  @Input() walletName: string;
  @Input() walletChain?: ConnectChainType;
  @Input() walletAddress: string;
  @Output() connect = new EventEmitter();

  disableEthO3 = true;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    if (environment.testSite === true) {
      this.disableEthO3 = false;
    }
  }

  copy(value: string): void {
    this.commonService.copy(value);
  }

  connectWallet(wallet): void {
    this.connect.emit(wallet);
  }
}
