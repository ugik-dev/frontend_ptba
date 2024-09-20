import { Component } from '@angular/core';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {
  users: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data; // Simpan data ke dalam array users
      },
      (error) => {
        console.error('Error fetching users', error);
      }
    );
  }
}
