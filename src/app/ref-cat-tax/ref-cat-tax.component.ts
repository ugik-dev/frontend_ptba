import { Component, inject, TemplateRef } from '@angular/core';
import { RefTaxService } from './../services/reftax.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ref-cat-tax',
  templateUrl: './ref-cat-tax.component.html',
  styleUrl: './ref-cat-tax.component.css'
})
export class RefCatTaxComponent {
  reftaxs: any[] = [];
  roles: any[] = [];
  private modalService = inject(NgbModal);
  closeResult = '';

  selectedRefTax: any = null;
  constructor(private reftaxService: RefTaxService,
  ) { }

  ngOnInit(): void {
    this.loadRefTaxs();
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  loadRefTaxs(): void {
    this.reftaxService.get().subscribe(
      (data) => {
        this.reftaxs = data;
      },
      (error) => {
        console.error('Error fetching reftaxs', error);
      }
    );
  }

  create_new(content: TemplateRef<any>) {
    this.selectedRefTax = {};
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }
  editRefTax(reftax: any, content: TemplateRef<any>): void {
    this.selectedRefTax = { ...reftax, password: '' }; // Clone the reftax for editing
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  saveRefTax(modal: any): void {
    if (this.selectedRefTax.id) {
      console.log(this.selectedRefTax)
      this.reftaxService.update(this.selectedRefTax.id, this.selectedRefTax).subscribe(
        () => {
          this.loadRefTaxs();
          modal.close();
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error updating reftax:', error);
        }
      );
    } else {
      console.log(this.selectedRefTax)
      this.reftaxService.create(this.selectedRefTax).subscribe(
        () => {
          this.loadRefTaxs();
          modal.close();
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error creating reftax:', error);
        }
      );
    }
  }

  deleteRefTax(reftaxId: number): void {
    if (confirm('Are you sure you want to delete this reftax?')) {
      this.reftaxService.delete(reftaxId).subscribe(
        () => {
          this.reftaxs = this.reftaxs.filter(reftax => reftax.id !== reftaxId);
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error deleting reftax:', error);
        }
      );
    }
  }
}
