import { Component, EventEmitter, inject, input, Output } from "@angular/core";
import { UserService } from "../../../services/user.service";
import { User } from "../../../models/user.model";

@Component({
  selector: "app-user-table",
  imports: [],
  templateUrl: "./user-table.component.html",
  styleUrl: "./user-table.component.css",
})
export class UserTableComponent {
  users = input.required<User[]>();

  @Output() editUser = new EventEmitter<User>();
}
