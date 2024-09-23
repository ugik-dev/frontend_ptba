import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { SummaryService } from './../services/summary.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  selectFilter: any = {
    year: '2024',
  };
  dataSummary: any = [];

  constructor(
    private summaryService: SummaryService,
  ) {
  }
  ngOnInit(): void {
    this.loadSummary();
  }
  changeYear() {
    console.log("call", this.selectFilter)
    this.loadSummary();
  }
  renderChart(dataset) {
    const chartDom = document.getElementById('chart') as HTMLDivElement; // Cast ke HTMLDivElement
    const myChart = echarts.init(chartDom);
    console.log(dataset.source)
    let option = {
      legend: {},
      tooltip: {},
      dataset: {
        dataset
      },
      xAxis: { type: 'category' },
      yAxis: {},
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
    };
    myChart.setOption({
      title: {
        text: 'Chart Berdasarkan Penerimaan Tahun ' + this.selectFilter.year
      },
      dataset: {
        source: dataset.source
      },
      tooltip: {},
      xAxis: { type: 'category' },
      yAxis: {},
      series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]

    });
  }

  loadSummary(): void {
    this.summaryService.get(this.selectFilter).subscribe(
      (data) => {
        this.dataSummary = data;
        this.renderChart(data);
      },
      (error) => {
        console.error('Error fetching regions', error);
      }
    );
  }

}
