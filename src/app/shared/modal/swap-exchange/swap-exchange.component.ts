import { Component, Input, OnInit } from '@angular/core';
import { Token, AssetQueryResponse } from '@lib';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  templateUrl: './swap-exchange.component.html',
  styleUrls: ['./swap-exchange.component.scss'],
})
export class SwapExchangeComponent implements OnInit {
  @Input() chooseSwapPathIndex: number;
  @Input() receiveSwapPathArray: AssetQueryResponse;
  TOKENS: Token[] = []; // 所有的 tokens

  toTokenSymbol: string;

  constructor(private modal: NzModalRef) {}

  ngOnInit(): void {
    const swapPath = this.receiveSwapPathArray[0].swapPath;
    this.toTokenSymbol = swapPath[swapPath.length - 1];
  }

  changeSwapPath(index: number): void {
    this.modal.close(index);
  }

  close(): void {
    this.modal.close();
  }
}
