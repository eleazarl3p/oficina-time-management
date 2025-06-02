import {
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
} from "@angular/core";
import { User } from "../../../models/user.model";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgIf } from "@angular/common";
import { LoginService } from "../../../services/login.service";
import { UserService } from "../../../services/user.service";

@Component({
  selector: "app-user-modal",
  imports: [FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: "./user-modal.component.html",
  styleUrl: "./user-modal.component.css",
})
export class UserModalComponent implements OnInit {
  loginService = inject(LoginService);
  userService = inject(UserService);
  user = input.required<User>();

  fb = inject(FormBuilder);
  @Output() close = new EventEmitter<void>();

  userForm: FormGroup = this.fb.group({
    _id: 0,
    first_name: ["", Validators.required],
    last_name: ["", Validators.required],
    username: ["", Validators.required],
    password: ["", Validators.required],
    // password: ["", Validators.required],
    role: ["", Validators.required],
  });

  closeModal() {
    this.close.emit();
  }

  ngOnInit(): void {
    const pp = this.user().password;
    this.userForm.patchValue({
      _id: this.user()._id,
      first_name: this.user().first_name,
      last_name: this.user().last_name,
      username: this.user().username,
      password: this.user().password,
      role: this.user().role,
    });
  }

  cancel() {
    this.closeModal();
  }

  delete(id: number) {
    this.userService.delete(id).subscribe((res) => {
      this.closeModal();
    });
  }

  submit() {
    const user = Object.assign(new User(), this.userForm.value);

    if (user._id == 0) {
      this.userService.create(user).subscribe((res) => {
        this.closeModal();
      });
    } else {
      this.userService.update(user).subscribe((res) => {
        this.closeModal();
      });
    }
  }

  resetPassword(id: number) {
    this.userService.resetPassword(id).subscribe((res) => {
      this.closeModal();
    });
  }
}
