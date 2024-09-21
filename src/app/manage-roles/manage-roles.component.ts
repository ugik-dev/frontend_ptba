import { Component, inject, TemplateRef } from '@angular/core';
import { RoleService } from './../services/role.service';
import { RefService } from './../services/ref.service';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-roles',
  templateUrl: './manage-roles.component.html',
  styleUrl: './manage-roles.component.css'
})
export class ManageRolesComponent {
  roles: any[] = [];
  permissions: any[] = [];
  currentPermission = [];
  private modalService = inject(NgbModal);
  closeResult = '';

  selectedRole: any = null;
  constructor(private roleService: RoleService,
    private refService: RefService,
  ) { }

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermission();
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

  loadRoles(): void {
    this.roleService.get().subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => {
        console.error('Error fetching roles', error);
      }
    );
  }
  loadPermission(): void {
    this.refService.getPermission().subscribe(
      (data) => {
        this.permissions = data;
      },
      (error) => {
        console.error('Error fetching roles', error);
      }
    );
  }
  loadRolePermission(roleId: number): void {
    this.roleService.getRolePermission(roleId).subscribe(
      (data) => {
        this.currentPermission = data;
        this.selectedRole.permissions = this.currentPermission.reduce((acc: any, permission: any) => {
          if (permission) { // Check if permission is valid
            acc[permission.permission_id] = {
              show: permission.show === 'Y' ? 'Y' : 'N',
              can_create: permission.can_create === 'Y' ? 'Y' : 'N',
              can_update: permission.can_update === 'Y' ? 'Y' : 'N',
              can_delete: permission.can_delete === 'Y' ? 'Y' : 'N',
            };
          }

          this.currentPermission = acc
          return acc;
        }, {});
      },
      (error) => {
        console.error('Error fetching roles', error);
      }
    );
  }
  create_new(content: TemplateRef<any>) {
    this.selectedRole = {};
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }
  onPermissionChange(permissionId: number, key: string, event: Event): void {
    // Ensure the permissions object exists for the selectedRole
    if (!this.selectedRole?.permissions) {
      this.selectedRole.permissions = {};
    }

    if (!this.selectedRole.permissions[permissionId]) {
      this.selectedRole.permissions[permissionId] = {};
    }

    // Explicitly cast the event target as an HTMLInputElement to access 'checked'
    const inputElement = event.target as HTMLInputElement;

    // Set the permission value to 'Y' or 'N'
    this.selectedRole.permissions[permissionId][key] = inputElement.checked ? 'Y' : 'N';
  }

  async editRole(role: any, content: TemplateRef<any>): Promise<void> {
    await this.loadRolePermission(role.id)
    console.log('this.currentPermission', this.currentPermission)
    this.selectedRole = { ...role, password: '' }; // Clone the role for editing
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  saveRole(modal: any): void {
    if (this.selectedRole.id) {
      console.log(this.selectedRole)
      this.roleService.update(this.selectedRole.id, this.selectedRole).subscribe(
        () => {
          this.loadRoles();
          modal.close();
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error updating role:', error);
        }
      );
    } else {
      console.log(this.selectedRole)
      this.roleService.create(this.selectedRole).subscribe(
        () => {
          this.loadRoles(); // Refresh list pengguna setelah create
          modal.close(); // Tutup modal setelah submit
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error creating role:', error);
        }
      );
    }
  }

  deleteRole(roleId: number): void {
    if (confirm('Are you sure you want to delete this role?')) {
      this.roleService.delete(roleId).subscribe(
        () => {
          this.roles = this.roles.filter(role => role.id !== roleId);
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error deleting role:', error);
        }
      );
    }
  }
}
