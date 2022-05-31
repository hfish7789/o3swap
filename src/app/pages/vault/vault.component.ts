import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from '@core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { VaultStakeComponent } from '@shared';


@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss'],
})
export class VaultComponent implements OnInit {
  constructor(
    private modal: NzModalService,
    private nzMessage: NzMessageService
  ) {}

  ngOnInit(): void {}

  showStake(): void {
    const modal = this.modal.create({
      nzContent: VaultStakeComponent,
      nzFooter: null,
      nzTitle: null,
      nzClosable: false,
      nzClassName: 'custom-modal custom-stake-modal',
    });
    modal.afterClose.subscribe((res) => {
      if (res) {
      }
    });
  }
}
