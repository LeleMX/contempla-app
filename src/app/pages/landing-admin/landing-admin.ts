import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, LandingSettings } from '../../core/services/settings.service';
import { AuditService } from '../../core/services/audit.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-landing-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing-admin.html',
})
export class LandingAdmin implements OnInit, OnDestroy {
  private settingsService = inject(SettingsService);
  private auditService = inject(AuditService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  settings: LandingSettings | null = null;
  initialSettings: LandingSettings | null = null;
  isSaving = false;
  toastMessage: string | null = null;

  sizeOptions = ['text-sm', 'text-base', 'text-xl', 'text-3xl', 'text-5xl', 'text-7xl', 'text-9xl'];

  getSizeIndex(size: string): number {
    const index = this.sizeOptions.indexOf(size);
    return index >= 0 ? index : 4;
  }

  setSizeFromIndex(event: any, field: 'heroTitleSize' | 'heroSubtitleSize' | 'aboutTitleSize'): void {
    if (this.settings) {
      this.settings[field] = this.sizeOptions[Number(event.target.value)];
    }
  }

  // File tracking for image uploads
  selectedHeroBg: File | null = null;
  selectedAboutBg: File | null = null;
  selectedAboutImage: File | null = null;
  selectedMenuBg: File | null = null;

  // Image Preview Modal State
  showImagePreview = false;
  previewImageUrl: string | null = null;

  openImagePreview(url: string | undefined) {
    if (!url) return;
    this.previewImageUrl = url;
    this.showImagePreview = true;
  }

  closeImagePreview() {
    this.showImagePreview = false;
    this.previewImageUrl = null;
  }

  ngOnInit() {
    this.settingsService.getLandingSettings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          // Clone the object to avoid mutating the observable source directly during edits
          this.settings = { ...data };
          if (!this.initialSettings) {
             this.initialSettings = { ...data }; // Guardamos estado inicial para la bitácora
          }
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

    // Security Validation
    if (!file.type.startsWith('image/')) {
      this.showToast('Error: El archivo debe ser una imagen válida');
      return;
    }
    const allowedExtensions = /\.(jpg|jpeg|png|webp|gif)$/i;
    if (!allowedExtensions.test(file.name)) {
      this.showToast('Error: Formato de imagen no permitido (.jpg, .png, .webp)');
      return;
    }

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
      
      // 3. Registrar Audit Log
      await this.auditService.logAction('ACTUALIZAR_LANDING', 'Landing', this.settings, this.initialSettings);
      this.initialSettings = { ...this.settings };
      
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
