import { Component, inject, signal } from '@angular/core';
import { SidePanelComponent } from '../side-panel/side-panel.component';
import { User } from '../../../models/user.model';
import { LoginService } from '../../../services/login.service';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, SidePanelComponent, NgIf, NgClass],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  loginService = inject(LoginService);
  userService = inject(UserService);

  password1 = signal<string>('');
  password2 = signal<string>('');
  message_success = signal<string | null>('');
  message_error = signal<string | null>('');

  updatePassword() {
    if (this.password1() == this.password2()) {
      let user = Object.assign(new User(), this.loginService.user());
      user.password = this.password1();
      this.userService.updatePassword(user).subscribe({
        next: (_) => {
          this.message_success.set('Password updated');
        },
        error: (err) => {
          this.message_error.set(err.error.message);
        },
      });
    }
  }
}
