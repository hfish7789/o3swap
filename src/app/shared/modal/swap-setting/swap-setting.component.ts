import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DEFAULT_DEADLINE, DEFAULT_SLIPVALUE, UPDATE_SETTING } from '@lib';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { CommonService } from '@core';
import { Observable, Unsubscribable } from 'rxjs';
import { Store } from '@ngrx/store';
interface State {
  setting: any;
}

@Component({
  selector: 'app-swap-setting',
  templateUrl: './swap-setting.component.html',
  styleUrls: ['./swap-setting.component.scss'],
})
export class SwapSettingComponent implements OnInit, OnDestroy {
  // setting modal
  setting$: Observable<any>;
  settingUnScribe: Unsubscribable;
  slipValue: any;
  isCustomSlip: boolean; // 自定义滑点
  deadline: number;

  // setting slip
  slipValueGroup = [0.1, 0.5, 1, 2];
  slipValueError: string;

  constructor(
    private modal: NzModalRef,
    private commonService: CommonService,
    public store: Store<State>
  ) {
    this.setting$ = store.select('setting');
  }

  ngOnInit(): void {
    this.checkSlipValue();
    this.settingUnScribe = this.setting$.subscribe((state) => {
      this.slipValue = state.slipValue;
      this.deadline = state.deadline;
      this.isCustomSlip = state.isCustomSlip;
    });
  }

  ngOnDestroy(): void {
    if (this.settingUnScribe) {
      this.settingUnScribe.unsubscribe();
    }
  }

  selectSlipValue(value: number): void {
    this.slipValue = value;
    this.isCustomSlip = false;
    this.checkSlipValue();
    this.updateSettingData();
  }
  clickCustomSlipValue(): void {
    if (this.isCustomSlip === false) {
      this.slipValue = '';
    }
    this.isCustomSlip = true;
  }
  inputSlipValue(event): void {
    this.slipValue = event.target.value;
    this.isCustomSlip = true;
    this.updateSettingData();
  }
  inputDeadline(event): void {
    this.deadline = event.target.value;
    this.updateSettingData();
  }
  close(): void {
    this.updateSettingData();
    this.modal.close();
  }
  updateDeadline(): void {
    this.deadline = this.getDeadline();
  }
  updateSlipValue(): void {
    this.slipValue = this.getSlipValue();
  }

  //#region
  updateSettingData(): any {
    const settingObj = {
      deadline: this.getDeadline(),
      slipValue: this.getSlipValue(),
      isCustomSlip: this.isCustomSlip,
    };
    this.store.dispatch({ type: UPDATE_SETTING, data: settingObj });
  }
  checkSlipValue(): void {
    const tempSlip = Number(this.slipValue);
    if (Number.isNaN(tempSlip) || tempSlip <= 0) {
      return;
    }
    if (this.slipValue < 0.5) {
      this.slipValueError = 'Your transaction may fail';
    } else if (this.slipValue > 5) {
      this.slipValueError = 'Your transaction may be frontrun';
    } else if (this.slipValue >= 100) {
      this.slipValueError = 'Enter a valid slippage percentage';
    } else {
      this.slipValueError = '';
    }
  }
  getDeadline(): any {
    let tempDeadline = Math.floor(Number(this.deadline));
    if (Number.isNaN(tempDeadline) || tempDeadline <= 0) {
      tempDeadline = DEFAULT_DEADLINE;
    }
    return tempDeadline;
  }
  getSlipValue(): any {
    let tempSlip = Number(this.slipValue);
    if (Number.isNaN(tempSlip) || tempSlip <= 0 || tempSlip >= 100) {
      // this.isCustomSlip = false;
      tempSlip = DEFAULT_SLIPVALUE;
    }
    return tempSlip;
  }
  //#endregion
}
