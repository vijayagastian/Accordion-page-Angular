import { Component, ElementRef, Input, OnInit, ViewChild, input} from "@angular/core";
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexChart,

} from "ng-apexcharts";
import { HttpClient } from "@angular/common/http";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
export type ChartOptions = {
 labels: string[];
 series:ApexNonAxisChartSeries;
 chart:ApexChart;
 stroke: any;
 dataLabels: any;



 grid: any;

 title: any;

};
export type ChartOptions1 = {
  labels: string[];
  series:ApexNonAxisChartSeries;
  chart:ApexChart
 
 };


@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrl: './piechart.component.css'
})
export class PiechartComponent {



  filteredChartData: { name: string, data: number }[] = [];

  options: string[] = ['Institution Code', 'Gender', 'Block', 'Pincode'];
  selectedOption: string = this.options[0];
  jsonData: any[] = [];
  chartData: { name: string, data: number }[] = [];
 
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: ChartOptions = {
    series: [],
    chart: {
      type: "pie",
      toolbar:{
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          
          customIcons: []
        },
        export: {
         
          svg: {
            filename: undefined,
          },
          png: {
            filename: undefined,
          }
        },
        autoSelected: 'zoom' 
      },
    },
    labels: [],
    stroke: {
      width: 5,
      curve: "straight",
      dashArray: [0, 8, 5]
    },
    title: {
     
      align: "left"
    },
  
    dataLabels:{
      enabled:true,
      onItemClick: {
        toggleDataSeries: true
    },
    onItemHover: {
      highlightDataSeries: true
  },
    },
    
    grid: {
      borderColor: "#f1f1f1"
    }
  };
  searchTerm: string = '';

  constructor(private http: HttpClient, private elementRef: ElementRef) {}

  ngOnInit() {
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

    this.chartOptions.series = this.chartData.map(item => item.data);
    this.chartOptions.labels = this.chartData.map(item => item.name);

    // To trigger the chart update
    if (this.chart) {
      this.chart.updateOptions(this.chartOptions);
    }

    // Initially show all data
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
      event.target.blur(); // Remove focus from the input after Enter is pressed
      return; // Do not filter if Enter key is pressed
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

