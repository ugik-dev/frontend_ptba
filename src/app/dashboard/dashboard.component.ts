import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
    this.loadChart();
  }

  loadChart() {
    // const chartDom = document.getElementById('chart') as HTMLDivElement; // Cast ke HTMLDivElement
    // const myChart = echarts.init(chartDom);

    // myChart.setOption({
    //   title: {
    //     text: 'ECharts Getting Started Example'
    //   },
    //   tooltip: {},
    //   xAxis: {
    //     data: ['shirt', 'cardigan', 'chiffon', 'pants', 'heels', 'socks']
    //   },
    //   yAxis: {},
    //   series: [
    //     {
    //       name: 'sales',
    //       type: 'bar',
    //       data: [5, 20, 36, 10, 10, 20]
    //     }
    //   ]
    // });
  }
}
