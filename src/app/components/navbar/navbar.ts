import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  protected authService = inject(AuthService);
  
  isMobileMenuOpen = false;
  isThemeMenuOpen = false;
  currentTheme = 'sunset';
  
  themes = [
    { value: 'sunset', label: 'Modo Sunset' },
    { value: 'winter', label: 'Modo Winter' },
    { value: 'forest', label: 'Modo Forest' },
    { value: 'dracula', label: 'Modo Nocturno' },
    { value: 'lofi', label: 'Modo Gris' }
  ];

  ngOnInit() {
    const savedTheme = localStorage.getItem('contempla_theme') || 'sunset';
    this.changeTheme(savedTheme);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) this.isThemeMenuOpen = false;
  }

  toggleThemeMenu() {
    this.isThemeMenuOpen = !this.isThemeMenuOpen;
  }

  changeTheme(eventOrString: any) {
    const theme = typeof eventOrString === 'string' ? eventOrString : eventOrString.target.value;
    this.currentTheme = theme;
    localStorage.setItem('contempla_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.isThemeMenuOpen = false;
  }

  logout() {
    this.authService.logout();
  }
}
