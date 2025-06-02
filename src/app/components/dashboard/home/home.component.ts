import { Component, signal } from "@angular/core";
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { SidePanelComponent } from "../side-panel/side-panel.component";
import { User } from "../../../models/user.model";

@Component({
  selector: "app-home",
  imports: [RouterOutlet, SidePanelComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  user = signal<User>(
    new User(1, "John", "Doe", "johndoe", "password123", "user")
  );
}
