import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Token } from '@lib';
import BigNumber from 'bignumber.js';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class CommonService {
  isProduction = environment.production;

  constructor(private nzMessage: NzMessageService) {}

  log(value: any): void {
    if (this.isProduction === false) {
      console.log(value);
    }
  }

  copy(value: string): void {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', value);
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      this.nzMessage.success('Copied Successfully');
    }
    document.body.removeChild(input);
  }

  decimalToInteger(value, decimals: number): string {
    if (new BigNumber(value).isNaN()) {
      return '';
    }
    return new BigNumber(value).shiftedBy(decimals).dp(0).toFixed();
  }

  isNeoAddress(address: string): boolean {
    const isAddressPattern = new RegExp(/^A([0-9a-zA-Z]{33})$/);
    return isAddressPattern.test(address);
  }

  getAssetRate(rates: {}, token: Token): string {
    let chain = token.chain.toLowerCase();
    if (chain === 'neo') {
      chain = 'neo2';
    }
    if (!rates[chain]) {
      return;
    }
    const tokenRate = rates[chain][token.symbol.toLowerCase()];
    if (tokenRate) {
      if (
        tokenRate.asset_id &&
        this.remove0xHash(tokenRate.asset_id).toLowerCase() ===
          this.remove0xHash(token.assetID).toLowerCase()
      ) {
        return tokenRate.price;
      }
      if (!tokenRate.asset_id) {
        return tokenRate.price;
      }
    }
    return;
  }

  add0xHash(hash: string): string {
    if (hash.startsWith('0x')) {
      return hash;
    } else {
      return `0x${hash}`;
    }
  }
  remove0xHash(hash: string): string {
    if (hash.startsWith('0x')) {
      return hash.slice(2);
    } else {
      return hash;
    }
  }
}
