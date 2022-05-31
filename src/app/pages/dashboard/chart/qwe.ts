import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
	selector: "app-chart",
	templateUrl: "./chart.component.html"
})

export class ChartsComponent implements OnInit, OnDestroy {
	options: any;
	updateOptions: any;

	private oneDay = 24 * 3600 * 1000;
	private now: Date;
	private d: Date;
	private value: number;
	private data: any[];
	private timer: any;

	ngOnInit(): void {
		this.data = [];
		const d = new Date();
		d.setDate(d.getDate() - 30);
		this.now=d;
		
		for (let i = 0; i < 30; i++) {
			this.data.push(this.randomData());
		}

		this.options = {
			tooltip: {
				trigger: 'axis',
				formatter: (params) => {
					params = params[0];
					const date = new Date(params.name);
					return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
				},
				axisPointer: {
					animation: false
				}
			},
			xAxis: {
				type: 'time',
				splitLine: {
					show: false
				}
			},
			yAxis: {
				type: 'value',
				axisLabel: {
					formatter: '{value}M'
				},
				boundaryGap: [0, '20%'],
				splitLine: {
					show: false
				}
			},
			series: [{
				name: 'Mocking Data',
				type: 'line',
				smooth: true,
				symbol: "none",
				lineStyle:{
					color:"#5470c6",
					width:2
				},
				areaStyle:{
					color:"#18241c"
				},
				data: this.data
			}]
		};

		// Mock dynamic data:
		this.timer = setInterval(() => {
			for (let i = 0; i < 1; i++) {
				this.data.shift();
				this.data.push(this.randomData());
			}

			// update series data:
			this.updateOptions = {
				series: [{
					data: this.data
				}]
			};
		}, 24 * 3600 * 1000);
	}

	ngOnDestroy() {
		clearInterval(this.timer);
	}

	randomData() {
		this.now = new Date(this.now.getTime() + this.oneDay);
		this.value = 10+Math.random() * 40;
		return {
			name: this.now.toString(),
			value: [
				[this.now.getFullYear(), this.now.getMonth() + 1, this.now.getDate()].join('/'),
				Math.round(this.value)
			]
		};
	}
}