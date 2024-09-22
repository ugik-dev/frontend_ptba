import { Component, inject, TemplateRef } from '@angular/core';
import { DepositService } from './../services/deposit.service';
import { RefService } from './../services/ref.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate, formatHour, formatIDR } from '../utils/formater';


@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
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
  // filter = {
  //   startDate: '',
  //   endDate: ''
  // };
  constructor(
    private depositService: DepositService,
    private refService: RefService,
  ) { }

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
  editRegion(region: any, content: TemplateRef<any>): void {
    this.selectDeposit = { ...region }; // Clone the region for editing
    this.onCategoryChange();
    this.onRefTaxChange();
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
