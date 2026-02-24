import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService, AuditLog } from '../../core/services/audit.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bitacora',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bitacora.html'
})
export class Bitacora implements OnInit {
  private auditService = inject(AuditService);
  logs$!: Observable<AuditLog[]>;

  ngOnInit() {
    this.logs$ = this.auditService.getLogs();
  }
}
