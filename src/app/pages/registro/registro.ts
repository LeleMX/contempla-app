import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../core/services/client.service';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro.html',
})
export class Registro {
  private clientService = inject(ClientService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  
  email = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  isAdmin = false;
  isRewardEligible = false;
  visitCount = 0;

  private isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async onSubmit() {
    if (!this.email) {
      this.errorMessage = 'El correo electrónico es requerido.';
      return;
    }
    
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Por favor, ingresa un correo electrónico válido.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.isRewardEligible = false;
    this.cdr.detectChanges();
    
    try {
      const newVisitCount = await this.clientService.registerVisit(this.email);
      this.visitCount = newVisitCount;
      
      if (newVisitCount === 10) {
        this.isRewardEligible = true;
        this.successMessage = '¡Felicidades! Has alcanzado 10 visitas.';
      } else {
        this.successMessage = 'Registro exitoso';
      }
      
      this.email = '';
      this.isAdmin = this.authService.isAuthenticated;

      if (this.isAdmin) {
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      } else {
        setTimeout(() => {
          this.successMessage = '';
          this.isRewardEligible = false;
        }, 8000); // 8 segundos para que puedan leer el premio
      }
      
    } catch (error: any) {
      this.errorMessage = error.message || 'Hubo un error al registrar la visita.';
      
      if (!this.authService.isAuthenticated) {
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.detectChanges();
        }, 5000);
      }
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}
