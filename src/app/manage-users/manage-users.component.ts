import { Component, inject, TemplateRef, Renderer2 } from '@angular/core';
import { UserService } from './../services/user.service';
import { RefService } from './../services/ref.service';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {
  users: any[] = [];
  roles: any[] = [];
  private modalService = inject(NgbModal);
  closeResult = '';

  selectedUser: any = null;
  constructor(private userService: UserService,
    private refService: RefService) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
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

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }
  loadRoles(): void {
    this.refService.getRoles().subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }
  create_new(content: TemplateRef<any>) {
    this.selectedUser = {};
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }
  editUser(user: any, content: TemplateRef<any>): void {
    this.selectedUser = { ...user, password: '' }; // Clone the user for editing
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  saveUser(modal: any): void {
    if (this.selectedUser.id) {
      console.log(this.selectedUser)
      this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(
        () => {
          this.loadUsers();
          modal.close();
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error updating user:', error);
        }
      );
    } else {
      console.log(this.selectedUser)
      this.userService.createUser(this.selectedUser).subscribe(
        () => {
          this.loadUsers();
          modal.close();
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error creating user:', error);
        }
      );
    }
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.users = this.users.filter(user => user.id !== userId);
        },
        (error) => {
          alert(error.error.message ?? "Something error");
          console.error('Error deleting user:', error);
        }
      );
    }
  }
}
