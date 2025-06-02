import { Component, inject, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Credentials, LoginService } from "../../services/login.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { User } from "../../models/user.model";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-login",
  imports: [ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnDestroy {
  private loginService = inject(LoginService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  private loginSubscription: Subscription | null = null;

  loginForm = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
  });

  invalidCredentials = false;
  onLogin() {
    if (this.loginForm.valid) {
      // const { username, password } = this.loginForm.value;
      // // Handle login logic here
      // console.log("Logging in with", username, password);
      this.loginSubscription = this.loginService
        .login(this.loginForm.value as Credentials)
        .subscribe({
          next: (result: User | null | undefined) => {
            this.navigateHome();
          },
          error: (error) => {
            this.invalidCredentials = true;
          },
        });
    }

    // this.loginService
    //   .login2({ username: "admin", password: "1234" } as Credentials)
    //   .subscribe((token: any) => {
    //     localStorage.setItem("token", token);

    //     alert(token);
    //   });
  }

  navigateHome() {
    this.router.navigate(["dashboard"]);
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }
}
