import { Component, inject, TemplateRef } from '@angular/core';
import { RegionService } from './../services/region.service';
import { RefService } from './../services/ref.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-regions',
  templateUrl: './manage-regions.component.html',
  styleUrl: './manage-regions.component.css'
})

export class ManageRegionsComponent {
  regions: any[] = [];
  roles: any[] = [];
  refRegions: any[] = [];
  refProvinces: any[] = [];
  private modalService = inject(NgbModal);
  closeResult = '';
  selectedRegion: any = {
    ref_region_id: '',
    name: '',
    parent_id: null,  // Nilai awal parent_id
  };

  // selectedRegion: any = null;
  constructor(private regionService: RegionService, private refService: RefService,
  ) { }

  ngOnInit(): void {
    this.loadRegions();
    this.loadRefRegion();
    this.loadRefProvince();
  }
  loadRefRegion(): void {
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
    console.log("onCategoryChange")
    if (this.selectedRegion.ref_region_id == '3') {
      console.log("onCategoryChange 3")
      // this.selectedRegion.parent_id = null; // reset nilai province
    } else {
      console.log("onCategoryChange 12")

      this.selectedRegion.parent_id = null;
    }
  }
  loadRefProvince(): void {
    this.refService.getProvince().subscribe(
      (data) => {
        this.refProvinces = data;
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

  loadRegions(): void {
    this.regionService.get().subscribe(
      (data) => {
        this.regions = data;
      },
      (error) => {
        console.error('Error fetching regions', error);
      }
    );
  }

  create_new(content: TemplateRef<any>) {
    this.selectedRegion = {};
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    );
  }
  editRegion(region: any, content: TemplateRef<any>): void {
    this.selectedRegion = { ...region }; // Clone the region for editing
    this.onCategoryChange();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    );
  }

  saveRegion(modal: any): void {
    if (this.selectedRegion.id) {
      console.log(this.selectedRegion)
      this.regionService.update(this.selectedRegion.id, this.selectedRegion).subscribe(
        () => {
          this.loadRegions();
          modal.close();
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error updating region:', error);
        }
      );
    } else {
      console.log(this.selectedRegion)
      this.regionService.create(this.selectedRegion).subscribe(
        () => {
          this.loadRegions();
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
      this.regionService.delete(regionId).subscribe(
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
}
