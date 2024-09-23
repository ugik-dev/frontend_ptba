import { Component, inject, TemplateRef, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { DepositService } from './../services/deposit.service';
import { RefService } from './../services/ref.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate, formatHour, formatIDR } from '../utils/formater';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
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
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css',
  // standalone: true,
})

export class DepositComponent {
  regions: any[] = [];
  roles: any[] = [];
  refRegions: any[] = [];
  refTaxs: any[] = [];
  refSubTaxs: any[] = [];
  refSubRegions: any[] = [];
  rawAmount: number = 0;
  private modalService = inject(NgbModal);
  closeResult = '';
  selectDeposit: any = { amount: '' };
  selectFilter: any = {
    startDate: '',
    endDate: '',
    refTax: '',
    refRegion: ''
  };
  displayedColumns: string[] =
    ['id', 'dateCreate', 'hourCreate', 'amount',
      'ref_tax_abbr', 'ref_sub_tax_name',
      'ref_region_name', 'region_name',
      'action'];
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
    // const users = Array.from({ length: 1 }, (_, k) => createNewUser(k + 1))];
    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);
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
  onCategoryChange() {
    this.refService.getRegion(this.selectDeposit.ref_region_id).subscribe(
      (data) => {
        this.refSubRegions = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }
  onRefTaxChange() {
    this.refService.getSubTax(this.selectDeposit.ref_tax_id).subscribe(
      (data) => {
        this.refSubTaxs = data;
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
        // this.dataSource.data = this.regions;
        // this.dataSource = new MatTableDataSource(data);

      },
      (error) => {
        console.error('Error fetching regions', error);
      }
    );
  }

  create_new(content: TemplateRef<any>) {
    this.selectDeposit = {};
    this.refSubTaxs = [];
    this.refSubRegions = [];
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    );
  }
  async editRegion(region: any, content: TemplateRef<any>): Promise<void> {
    this.selectDeposit = { ...region }; // Clone the region for editing
    await this.onCategoryChange();
    await this.onRefTaxChange();
    this.selectDeposit.region_id = region.region_id;
    console.log('Selected Region ID:', this.selectDeposit.region_id);
    this.selectDeposit.amount = formatIDR(this.selectDeposit.amount)
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    );
  }

  saveRegion(modal: any): void {
    if (this.selectDeposit.id) {
      console.log(this.selectDeposit)
      this.depositService.update(this.selectDeposit.id, this.selectDeposit).subscribe(
        () => {
          this.loadDeposit();
          // this.loadRefProvince();

          modal.close();
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error updating region:', error);
        }
      );
    } else {
      console.log(this.selectDeposit)
      this.depositService.create(this.selectDeposit).subscribe(
        () => {
          this.loadDeposit();
          // this.loadRefProvince();

          modal.close();
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error creating region:', error);
        }
      );
    }
  }

  deleteRegion(regionId: number): void {
    if (confirm('Are you sure you want to delete this region?')) {
      this.depositService.delete(regionId).subscribe(
        () => {
          this.regions = this.regions.filter(region => region.id !== regionId);
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error deleting region:', error);
        }
      );
    }
  }

  onAmountChange(event: any) {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    const numericValue = inputValue ? Number(inputValue) : 0;
    this.selectDeposit.amount = this.formatAmount(numericValue);
  }

  formatAmount(amount: number, prefix = true): string {
    return formatIDR(amount, prefix);
  }

  onBlur() {
    if (!this.selectDeposit.amount || this.selectDeposit.amount === 'Rp 0,00') {
      this.selectDeposit.amount = this.formatAmount(0);
    }
  }

  formatRegionDate(date: any): string {
    return formatDate(date);
  }

  formatRegionHour(date: any): string {
    return formatHour(date);
  }
}

