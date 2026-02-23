import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  async onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    const success = await this.authService.login(this.username, this.password);
    
    if (success) {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Credenciales inválidas. Por favor intente nuevamente.';
    }
    
    this.isLoading = false;
  }
}
