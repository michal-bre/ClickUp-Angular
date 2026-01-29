import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {
  private readonly STORAGE_KEY = 'darkMode';
  private darkModeSubject: BehaviorSubject<boolean>;
  public darkMode$: Observable<boolean>;

  constructor() {
    const savedDarkMode = this.getSavedDarkMode();
    this.darkModeSubject = new BehaviorSubject<boolean>(savedDarkMode);
    this.darkMode$ = this.darkModeSubject.asObservable();
  }

  private getSavedDarkMode(): boolean {
    const saved = sessionStorage.getItem(this.STORAGE_KEY);
    return saved ? JSON.parse(saved) : false;
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  toggleDarkMode(): void {
    const newValue = !this.darkModeSubject.value;
    this.darkModeSubject.next(newValue);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(newValue));
  }

  setDarkMode(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(isDark));
  }
}
