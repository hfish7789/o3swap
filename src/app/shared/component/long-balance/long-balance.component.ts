import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BigNumber } from 'bignumber.js';

@Component({
  selector: 'app-long-balance',
  templateUrl: './long-balance.component.html',
  styleUrls: ['./long-balance.component.scss'],
})
export class LongBalanceComponent implements OnInit, OnChanges {
  @Input() defaultValue = '0';
  @Input() length = 12;
  @Input() balance: string;

  displayBalance: string;
  showTooltip = false;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.handleBalance();
  }

  ngOnInit(): void {}

  handleBalance(): void {
    this.showTooltip = false;
    if (!this.balance || new BigNumber(this.balance).isNaN()) {
      return;
    }
    const stringValue = this.balance.toString();
    const dataGroup = stringValue.split('.');
    if (dataGroup[0].length >= this.length) {
      this.displayBalance = dataGroup[0];
      this.showTooltip = true;
    } else if (stringValue.length > this.length) {
      this.displayBalance = stringValue.substring(0, this.length);
      this.showTooltip = true;
    }
  }
}
