import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexLegend,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexPlotOptions,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexFill
} from "ng-apexcharts";
import { HttpClient } from "@angular/common/http";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export type ChartOptions = {
  series: ApexNonAxisChartSeries | ApexAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  legend: ApexLegend;
  tooltip: ApexTooltip;
  plotOptions?: ApexPlotOptions;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  fill?: ApexFill;
};

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.css']
})
export class LinechartComponent implements OnInit {
  filteredChartData: { name: string, data: number }[] = [];
  selectedChart: string = 'pie';

  options: string[] = ['Institution Code', 'Gender', 'Block', 'Pincode'];
  selectedOption: string = this.options[0];
  jsonData: any[] = [];
  chartData: { name: string, data: number }[] = [];

  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'pie',
      height: 350
    },
    labels: [],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "K";
        }
      }
    },
  };

  searchTerm: string = '';

  constructor(private http: HttpClient, private elementRef: ElementRef) {}

  ngOnInit() {
    this.selectedOption = 'Institution Code';
    this.fetchData();
  }

  fetchData() {
    this.http.get<any>("assets/data.json").subscribe(response => {
      console.log('Fetched Data:', response);
      this.jsonData = response;
      this.updateChart();
    });
  }

  onOptionChange() {
    this.updateChart();
  }

  updateChart() {
    this.chartData = [];
    const selectedKey = this.getSelectedKey();
    const groupedData = this.groupBy(this.jsonData, selectedKey);

    for (const key in groupedData) {
      if (groupedData.hasOwnProperty(key)) {
        this.chartData.push({ name: key, data: groupedData[key].length });
      }
    }

    console.log('Chart Data:', this.chartData);

    if (this.selectedChart === 'bar' || this.selectedChart === 'line') {
      this.chartOptions.series = [{
        name: this.selectedOption,
        data: this.chartData.map(item => item.data)
      }];
      this.chartOptions.chart.type = this.selectedChart;
      this.chartOptions['xaxis'] = {
        categories: this.chartData.map(item => item.name)
      };
      this.chartOptions['plotOptions'] = {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        }
      };
      this.chartOptions['dataLabels'] = { enabled: false };
      this.chartOptions['stroke'] = {
        show: true,
        width: 2,
        colors: ["transparent"]
      };
      this.chartOptions['fill'] = { opacity: 1 };
    } else {
      this.chartOptions.series = this.chartData.map(item => item.data);
      this.chartOptions.labels = this.chartData.map(item => item.name);
      this.chartOptions.chart.type = 'pie';
      delete this.chartOptions['xaxis'];
      delete this.chartOptions['plotOptions'];
      delete this.chartOptions['dataLabels'];
      delete this.chartOptions['stroke'];
      delete this.chartOptions['fill'];
    }

    if (this.chart) {
      this.chart.updateOptions(this.chartOptions);
    }

    this.filteredChartData = [...this.chartData];
  }

  getSelectedKey(): string {
    switch (this.selectedOption) {
      case 'Institution Code':
        return 'institutionalId';
      case 'Gender':
        return 'gender';
      case 'Block':
        return 'block';
      case 'Pincode':
        return 'pincode';
      default:
        return 'institutionalId';
    }
  }

  groupBy(array: any[], key: string) {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  }

  onChartTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedChart = selectElement.value;
    this.updateChart();
  }

  exportData() {
    const csvData = this.convertToCSV(this.chartData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chart-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  convertToCSV(data: { name: string, data: number }[]): string {
    const header = 'Category,Count\n';
    const rows = data.map(item => `${item.name},${item.data}`).join('\n');
    return header + rows;
  }

  exportDataAsPDF(tableData: { name: string; data: number }[], filename: string) {
    const doc = new jsPDF();
    const header = [['Category', 'Count']];
    const data = tableData.map(item => [item.name, item.data]);

    (doc as any).autoTable({
      head: header,
      body: data,
    });

    doc.save(filename + '.pdf');
  }

  pdfData() {
    this.exportDataAsPDF(this.chartData, 'chart-data');
  }

  printTable() {
    const printContents = document.getElementById('dataTable')?.outerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents ?? '';
    window.print();
    document.body.innerHTML = originalContents;
  }

  filterTable(event: any): void {
    if (event.key === 'Enter') {
      event.target.blur();
      return;
    }
    this.searchTerm = event.target.value.toLowerCase();
    if (this.searchTerm) {
      this.filteredChartData = this.chartData.filter(item => 
        item.name.toLowerCase().includes(this.searchTerm) ||
        item.data.toString().includes(this.searchTerm)
      );
    } else {
      this.filteredChartData = [...this.chartData];
    }
  }

  copyData() {
    const table = document.getElementById('dataTable') as HTMLElement;
    const range = document.createRange();
    range.selectNode(table);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    try {
      document.execCommand('copy');
      console.log('Table data copied successfully');
      window.alert('Table data copied successfully');
    } catch (error) {
      console.error('Unable to copy table data to clipboard:', error);
      window.alert('Failed to copy table data to clipboard');
    }

    window.getSelection()?.removeAllRanges();
  }
}
