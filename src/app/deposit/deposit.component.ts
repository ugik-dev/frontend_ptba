import { Component, inject, TemplateRef } from '@angular/core';
import { DepositService } from './../services/deposit.service';
import { RefService } from './../services/ref.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent {
  depositData: any[] = [];
  refTaxs: any[] = [];
  private modalService = inject(NgbModal);
  closeResult = '';

  selectedDeposit: any = null;
  constructor(private depositService: DepositService, private refService: RefService,
  ) { }

  ngOnInit(): void {
    this.loadDeposit();
    this.loadRefTaxs();
  }
  loadRefTaxs(): void {
    this.refService.getTax().subscribe(
      (data) => {
        this.refTaxs = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }

  loadDeposit(): void {
    this.depositService.get().subscribe(
      (data) => {
        this.depositData = data;
      },
      (error) => {
        console.error('Error fetching deposits', error);
      }
    );
  }

  create_new(content: TemplateRef<any>) {
    this.selectedDeposit = {};
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    );
  }
  editDeposit(deposit: any, content: TemplateRef<any>): void {
    this.selectedDeposit = { ...deposit, password: '' }; // Clone the deposit for editing
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(

    );
  }

  saveDeposit(modal: any): void {
    if (this.selectedDeposit.id) {
      console.log(this.selectedDeposit)
      this.depositService.update(this.selectedDeposit.id, this.selectedDeposit).subscribe(
        () => {
          this.loadDeposit();
          modal.close();
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error updating deposit:', error);
        }
      );
    } else {
      console.log(this.selectedDeposit)
      this.depositService.create(this.selectedDeposit).subscribe(
        () => {
          this.loadDeposit();
          modal.close();
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error creating deposit:', error);
        }
      );
    }
  }

  deleteDeposit(depositId: number): void {
    if (confirm('Are you sure you want to delete this deposit?')) {
      this.depositService.delete(depositId).subscribe(
        () => {
          this.depositData = this.depositData.filter(deposit => deposit.id !== depositId);
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error deleting deposit:', error);
        }
      );
    }
  }
}
