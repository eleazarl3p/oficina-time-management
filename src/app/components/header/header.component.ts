import { Component, inject } from "@angular/core";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { Subscription } from "rxjs";
import { LoginService } from "../../services/login.service";

@Component({
  selector: "app-header",
  imports: [RouterOutlet],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  private router = inject(Router);
  loginService = inject(LoginService);

  private logoutSubscription: Subscription | null = null;
  title = "office-time-management";

  logout() {
    this.logoutSubscription = this.loginService.logout().subscribe({
      next: (_) => {
        this.navigateToLogin();
      },
      error: (_) => {
        this.navigateToLogin();
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(["/login"]);
  }

  navigateHome() {
    this.router.navigate(["/dashboard"]);
  }

  ngOnDestroy(): void {
    this.logoutSubscription?.unsubscribe();
  }
}
