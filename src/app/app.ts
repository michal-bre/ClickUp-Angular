import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from './component/sidebar/sidebar';
import { ToastComponent } from './component/toast/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, ToastComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-angular-app');
  showSidebar = true;
  sidebarExpanded = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // הסתר sidebar בדף auth
      const currentRoute = this.router.url;
      this.showSidebar = !currentRoute.includes('/auth') && !currentRoute.includes('/login') && !currentRoute.includes('/register');
    });
  }

  onSidebarToggle(expanded: boolean) {
    this.sidebarExpanded = expanded;
  }
}
