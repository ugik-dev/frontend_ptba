import { Component, inject, TemplateRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DepositService } from './../services/deposit.service';
import { RefService } from './../services/ref.service';
import { formatDate, formatHour, formatIDR } from '../utils/formater';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

export interface DepositData {
  alocation_amount: string;
  alocation_percentage: number;
  amount: string;
  createdAt: string;
  id: number;
  ref_region_id: number;
  ref_region_name: string;
  ref_sub_tax_id: number;
  ref_sub_tax_name: string;
  ref_tax_abbr: string;
  ref_tax_id: number;
  region_id: number;
  region_name: string;
  updatedAt: string;
  user_id: number;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css'
})
export class SummaryComponent {
  regions: any[] = [];
  roles: any[] = [];
  refRegions: any[] = [];
  refTaxs: any[] = [];
  refSubTaxs: any[] = [];
  refSubRegions: any[] = [];
  rawAmount: number = 0;
  closeResult = '';
  selectDeposit: any = { amount: '' };
  selectFilter: any = {
    startDate: '',
    endDate: '',
    refTax: '',
    refRegion: ''
  };
  displayedColumns: string[] =
    ['id', 'dateCreate', 'hourCreate',
      'amount', 'percentage', 'alocation',
      'ref_tax_abbr', 'ref_sub_tax_name',
      'ref_region_name', 'region_name',
    ];
  dataSource = new MatTableDataSource<DepositData>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  exportToExcel() {
    let dataToExport = this.dataSource.filteredData
      .map(x => ({
        id: x.id,
        Name: x.createdAt,
        Nominal: x.amount,
        Persentasi: x.alocation_percentage,
        Alokasi: x.alocation_amount,
        Jenis: x.ref_tax_abbr,
        Sub_Jenis: x.ref_sub_tax_name,
        Wilayah: x.ref_region_name,
        Sub_Wilayah: x.region_name,
      }));

    let workSheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport, <XLSX.Table2SheetOpts>{ sheet: 'Sheet 1' });
    let workBook: XLSX.WorkBook = XLSX.utils.book_new();

    // Adjust column width
    var wscols = [
      { wch: 5 },
      { wch: 25 },
      { wch: 10 },
      { wch: 5 },
      { wch: 10 },
      { wch: 5 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];

    workSheet["!cols"] = wscols;

    XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
    XLSX.writeFile(workBook, `report.xlsx`);
  }

  constructor(
    private depositService: DepositService,
    private refService: RefService,
  ) {
  }
  ngAfterViewInit() {
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.loadDeposit();
    this.loadReference();
  }

  loadReference(): void {
    this.refService.getTax().subscribe(
      (data) => {
        this.refTaxs = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
    this.refService.getRegion().subscribe(
      (data) => {
        this.refRegions = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }


  loadDeposit(): void {
    console.log(this.selectFilter)
    this.depositService.get(this.selectFilter).subscribe(
      (data) => {
        this.regions = data;
        this.dataSource.data = this.regions;
      },
      (error) => {
        console.error('Error fetching regions', error);
      }
    );
  }

  formatAmount(amount: number, prefix = true): string {
    return formatIDR(amount, prefix);
  }

  formatRegionDate(date: any): string {
    return formatDate(date);
  }

  formatRegionHour(date: any): string {
    return formatHour(date);
  }
}
