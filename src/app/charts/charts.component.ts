import { Component, ElementRef, ViewChild } from "@angular/core";
import ApexCharts from "apexcharts";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: any;
  chart: any;
  xaxis: any;
  stroke: any;
  dataLabels: any;
  markers: any;
  tooltip: any; // ApexTooltip;
  yaxis: any;
  grid: any;
  legend: any;
  title: any;
};

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent {

  @ViewChild("chart") chart: ChartComponent | undefined;

  @ViewChild('chart') chart2: ElementRef | undefined;
  public chartOptions: Partial<ChartOptions>;

  dataHigh = [10, 22, 33, 44, 55, 11]

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Session Duration",
          data: this.dataHigh
        },
        {
          name: "Page Views",
          data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
        },
        {
          name: "Total Visits",
          data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
        }
      ],
      chart: {
        height: 350,
        type: "line"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 5,
        curve: "straight",
        dashArray: [0, 8, 5]
      },
      title: {
        text: "Page Statistics",
        align: "left"
      },
      legend: {
        tooltipHoverFormatter: function (val: string, opts: { w: { globals: { series: { [x: string]: { [x: string]: string; }; }; }; }; seriesIndex: string | number; dataPointIndex: string | number; }) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        labels: {
          trim: false
        },
        categories: [
          "01 Jan",
          "02 Jan",
          "03 Jan",
          "04 Jan",
          "05 Jan",
          "06 Jan",
          "07 Jan",
          "08 Jan",
          "09 Jan",
          "10 Jan",
          "11 Jan",
          "12 Jan"
        ]
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val:any) {
                return val + " (mins)";
              }
            }
          },
          {
            title: {
              formatter: function (val:any) {
                return val + " per session";
              }
            }
          },
          {
            title: {
              formatter: function (val:any) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: "#f1f1f1"
      }
    };
  }

  change() {
  
      if (this.chart) {
        this.chart.updateOptions({
          chart: {
            type: "bar",
            height: 350 
          }
        });
      }
    }
  }
