import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { HeaderComponent } from './components/header/header.component';
import { LoginService } from './services/login.service';
import { Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  loginService = inject(LoginService);
  private router = inject(Router);

  ngOnInit(): void {
    this.router.navigate(['dashboard/']);
  }
}
