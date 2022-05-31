import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CHAINS } from '@lib';
import { CommonService } from '@core';

@Component({
  selector: 'app-header-connect-item',
  templateUrl: './header-connect-item.component.html',
  styleUrls: ['./header-connect-item.component.scss'],
})
export class HeaderConnectItemComponent implements OnInit {
  @Input() chain: CHAINS;
  @Input() walletName: string;
  @Input() accountAddress: string;
  @Output() changeWallet = new EventEmitter();
  @Output() disConnect = new EventEmitter();

  isShowModal = false;
  showModalTimeOut;

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {}

  showModal(): void {
    clearTimeout(this.showModalTimeOut);
    this.isShowModal = true;
  }

  hideModal(): void {
    this.showModalTimeOut = setTimeout(() => {
      this.isShowModal = false;
    }, 200);
  }

  copy(value: string): void {
    this.commonService.copy(value);
  }

  toDisConnect(): void {
    this.isShowModal = false;
    this.disConnect.emit();
  }

  toChangeWallet(): void {
    this.isShowModal = false;
    this.changeWallet.emit();
  }
}
