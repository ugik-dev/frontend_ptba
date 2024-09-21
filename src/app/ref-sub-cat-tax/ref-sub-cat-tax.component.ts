import { Component, inject, TemplateRef } from '@angular/core';
import { RefSubTaxService } from './../services/refsubtax.service';
import { RefService } from './../services/ref.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ref-sub-cat-tax',
  templateUrl: './ref-sub-cat-tax.component.html',
  styleUrl: './ref-sub-cat-tax.component.css'
})
export class RefSubCatTaxComponent {
  refsubtaxs: any[] = [];
  roles: any[] = [];
  refTaxs: any[] = [];
  private modalService = inject(NgbModal);
  closeResult = '';

  selectedRefSubTax: any = null;
  constructor(private refsubtaxService: RefSubTaxService, private refService: RefService,
  ) { }

  ngOnInit(): void {
    this.loadRefSubTaxs();
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

  loadRefSubTaxs(): void {
    this.refsubtaxService.get().subscribe(
      (data) => {
        this.refsubtaxs = data;
      },
      (error) => {
        console.error('Error fetching refsubtaxs', error);
      }
    );
  }

  create_new(content: TemplateRef<any>) {
    this.selectedRefSubTax = {};
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }
  editRefSubTax(refsubtax: any, content: TemplateRef<any>): void {
    this.selectedRefSubTax = { ...refsubtax, password: '' }; // Clone the refsubtax for editing
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  saveRefSubTax(modal: any): void {
    if (this.selectedRefSubTax.id) {
      console.log(this.selectedRefSubTax)
      this.refsubtaxService.update(this.selectedRefSubTax.id, this.selectedRefSubTax).subscribe(
        () => {
          this.loadRefSubTaxs();
          modal.close();
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error updating refsubtax:', error);
        }
      );
    } else {
      console.log(this.selectedRefSubTax)
      this.refsubtaxService.create(this.selectedRefSubTax).subscribe(
        () => {
          this.loadRefSubTaxs();
          modal.close();
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error creating refsubtax:', error);
        }
      );
    }
  }

  deleteRefSubTax(refsubtaxId: number): void {
    if (confirm('Are you sure you want to delete this refsubtax?')) {
      this.refsubtaxService.delete(refsubtaxId).subscribe(
        () => {
          this.refsubtaxs = this.refsubtaxs.filter(refsubtax => refsubtax.id !== refsubtaxId);
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error deleting refsubtax:', error);
        }
      );
    }
  }
}
