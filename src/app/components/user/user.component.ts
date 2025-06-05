import { Component, inject, OnInit, signal } from '@angular/core';
import { User } from '../../models/user.model';
import { SidePanelComponent } from '../dashboard/side-panel/side-panel.component';
import { LoginService } from '../../services/login.service';
import { NgClass, NgIf } from '@angular/common';
import { UserTableComponent } from './user-table/user-table.component';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { UserModalComponent } from './user-modal/user-modal.component';

@Component({
  selector: 'app-user',
  imports: [NgIf, SidePanelComponent, UserTableComponent, UserModalComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  loginService = inject(LoginService);

  userService = inject(UserService);
  users = signal<User[]>([]);

  currentUser = signal<User | null>(null);

  subscription: Subscription | null = null;

  ngOnInit(): void {
    this.getUsers();
  }

  addUser() {
    const newUser = new User();
    this.currentUser.set(newUser);
  }

  closeModal() {
    this.getUsers();
  }

  getUsers() {
    this.subscription = this.userService.getAllUsers().subscribe((res) => {
      const users_ = res.map((u) => Object.assign(new User(), u));

      this.users.set(users_);
      this.currentUser.set(null);
    });
  }

  edit(user: User) {
    this.currentUser.set(user);
  }
}
