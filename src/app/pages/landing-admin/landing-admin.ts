import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, LandingSettings } from '../../core/services/settings.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-landing-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing-admin.html',
})
export class LandingAdmin implements OnInit, OnDestroy {
  private settingsService = inject(SettingsService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  settings: LandingSettings | null = null;
  isSaving = false;
  toastMessage: string | null = null;

  // File tracking for image uploads
  selectedHeroBg: File | null = null;
  selectedAboutBg: File | null = null;
  selectedAboutImage: File | null = null;
  selectedMenuBg: File | null = null;

  ngOnInit() {
    this.settingsService.getLandingSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          // Clone the object to avoid mutating the observable source directly during edits
          this.settings = { ...data };
          this.cdr.detectChanges(); // Trigger Angular Zone change detection
        },
        error: (err) => console.error('Error fetching settings', err)
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelected(event: any, type: 'heroBg' | 'aboutBg' | 'aboutImage' | 'menuBg') {
    const file = event.target.files[0];
    if (!file) return;

    switch (type) {
      case 'heroBg': this.selectedHeroBg = file; break;
      case 'aboutBg': this.selectedAboutBg = file; break;
      case 'aboutImage': this.selectedAboutImage = file; break;
      case 'menuBg': this.selectedMenuBg = file; break;
    }
  }

  async saveSettings() {
    if (!this.settings) return;
    this.isSaving = true;
    this.cdr.detectChanges();

    try {
      // 1. Upload any new images selected by the user
      if (this.selectedHeroBg) {
        this.settings.heroBgUrl = await this.settingsService.uploadImage(this.selectedHeroBg);
        this.selectedHeroBg = null;
      }
      if (this.selectedAboutBg) {
        this.settings.aboutBgUrl = await this.settingsService.uploadImage(this.selectedAboutBg);
        this.selectedAboutBg = null;
      }
      if (this.selectedAboutImage) {
        this.settings.aboutImage1 = await this.settingsService.uploadImage(this.selectedAboutImage);
        this.selectedAboutImage = null;
      }
      if (this.selectedMenuBg) {
        this.settings.menuBgUrl = await this.settingsService.uploadImage(this.selectedMenuBg);
        this.selectedMenuBg = null;
      }

      // 2. Save settings to Firestore
      await this.settingsService.updateLandingSettings(this.settings);
      this.showToast('Configuración guardada exitosamente');

    } catch (e) {
      console.error('Error saving landing settings', e);
      this.showToast('Error al guardar la configuración');
    } finally {
      this.isSaving = false;
      this.cdr.detectChanges();
    }
  }

  showToast(message: string) {
    this.toastMessage = message;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.toastMessage = null;
      this.cdr.detectChanges();
    }, 3000);
  }
}
