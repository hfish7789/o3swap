import { Component, Input, OnInit } from '@angular/core';
import { Token } from '@lib';
import { interval, Unsubscribable } from 'rxjs';
import { O3EthWalletApiService, MetaMaskWalletApiService } from '@core';
import { NzModalRef } from 'ng-zorro-antd/modal';
@Component({
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss'],
})
export class ApproveComponent implements OnInit {
  @Input() aggregator?: string;
  @Input() fromToken: Token;
  @Input() fromAddress: string;
  @Input() walletName: string;

  isApproveLoading = false;
  approveInterval: Unsubscribable;

  constructor(
    private o3EthWalletApiService: O3EthWalletApiService,
    private metaMaskWalletApiService: MetaMaskWalletApiService,
    private modal: NzModalRef
  ) {}

  ngOnInit(): void {}

  approve(): void {
    if (this.approveInterval) {
      this.approveInterval.unsubscribe();
    }
    this.isApproveLoading = true;
    const swapApi = this.getEthDapiService();
    swapApi
      .approve(this.fromToken, this.fromAddress, this.aggregator)
      .then((hash) => {
        if (hash) {
          this.approveInterval = interval(5000).subscribe(async () => {
            const receipt = await swapApi.getReceipt(
              hash,
              this.fromToken.chain
            );
            if (receipt !== null) {
              this.approveInterval.unsubscribe();
              this.isApproveLoading = false;
              this.close();
            }
          });
        } else {
          this.isApproveLoading = false;
        }
      });
  }

  getEthDapiService(): any {
    return this.walletName === 'MetaMask' || !this.walletName
      ? this.metaMaskWalletApiService
      : this.o3EthWalletApiService;
  }

  close(): void {
    this.modal.close();
  }
}
