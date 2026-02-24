import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html'
})
export class Footer {
  private router = inject(Router);

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
