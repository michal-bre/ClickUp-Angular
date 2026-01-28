import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { DarkModeService } from '../../services/dark-mode.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent implements OnInit, OnDestroy {
  userName: string = '';
  userEmail: string = '';
  isExpanded: boolean = true;
  currentRoute: string = '';
  showLogoutToast: boolean = false;
  isDarkMode: boolean = false;
  private destroy$ = new Subject<void>();

  @Output() expandedChange = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit() {
    this.isDarkMode = this.darkModeService.isDarkMode();
    this.darkModeService.darkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDarkMode = isDark;
      });
    this.loadUserInfo();
    // עקוב אחרי שינויי הרוט
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserInfo() {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.userName = user.name || 'User';
        this.userEmail = user.email || '';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.expandedChange.emit(this.isExpanded);
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.showLogoutToast = true;
    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigate(['/auth']);
    }, 800);
  }

  getInitials(): string {
    return this.userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
