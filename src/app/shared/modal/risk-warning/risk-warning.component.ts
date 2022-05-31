import {
  Component,
  OnInit
} from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
@Component({
  templateUrl: './risk-warning.component.html',
  styleUrls: ['./risk-warning.component.scss'],
})
export class RiskWarningComponent implements OnInit {

  constructor(
    private modal: NzModalRef,
  ) {}

  ngOnInit(): void {
  }

  close(): void {
    this.modal.close();
  }
}
