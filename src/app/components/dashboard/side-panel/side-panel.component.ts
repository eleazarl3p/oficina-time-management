import { CommonModule } from "@angular/common";
import { Component, HostBinding, input, output } from "@angular/core";
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { User } from "../../../models/user.model";

@Component({
  selector: "app-side-panel",
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: "./side-panel.component.html",
  styleUrl: "./side-panel.component.css",
})
export class SidePanelComponent {
  expanded = true;
  user = input.required<User>();

  showFilters = output<boolean>();

  toggleSidebar() {
    this.expanded = !this.expanded;
    this.showFilters.emit(this.expanded);
  }

  @HostBinding("class") get hostClasses() {
    return `transition-all duration-300 overflow-hidden ${
      this.expanded ? "w-60" : "w-16"
    }`;
  }
}
