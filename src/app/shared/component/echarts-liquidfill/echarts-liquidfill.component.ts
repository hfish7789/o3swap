import { Component, Input, OnInit } from '@angular/core';
import { Token, AssetQueryResponse } from '@lib';
import 'echarts-liquidfill/dist/echarts-liquidfill.min';

@Component({
  selector: 'app-echarts-liquidfill',
  templateUrl: './echarts-liquidfill.component.html',
  styleUrls: ['./echarts-liquidfill.component.scss'],
})
export class ExchartLiquidfillComponent implements OnInit {
  constructor() {}
  private progressRate: number;
  @Input() set ProgressRate(value: number) {
    this.progressRate = value;
    this.chartOption = {
      series: [
        {
          type: 'liquidFill',
          data: [this.progressRate],
          color: ['#6162ef'],
          backgroundStyle: {
            color: '#4a4a4a'
        },
          outline: {
            show: false
          },
          label: {
            normal: {
                show: false
             }
          }
        },
      ],
    };
  }
  chartOption = {};
  ngOnInit(): void {
  }
}
