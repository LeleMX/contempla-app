import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, DecimalPipe, KeyValuePipe } from '@angular/common';
import { MenuService, MenuItem } from '../../core/services/menu';
import { Observable, map } from 'rxjs';
import { QRCodeComponent } from 'angularx-qrcode';
import { SettingsService, LandingSettings } from '../../core/services/settings.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, KeyValuePipe, QRCodeComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {
  private router = inject(Router);
  private menuService = inject(MenuService);
  private settingsService = inject(SettingsService);

  menuGrouped$!: Observable<Record<string, MenuItem[]>>;
  settings$!: Observable<LandingSettings>;
  qrCodeUrl = '';

  ngOnInit() {
    let hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      hostname = '192.168.101.102'; // Local network escape
    }
    const port = window.location.port ? ':' + window.location.port : '';
    this.qrCodeUrl = `${window.location.protocol}//${hostname}${port}/registro`;

    // Fetch dynamic content
    this.settings$ = this.settingsService.getLandingSettings();

    this.menuGrouped$ = this.menuService.getMenuItems().pipe(
      map(items => {
        return items.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        }, {} as Record<string, MenuItem[]>);
      })
    );
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
