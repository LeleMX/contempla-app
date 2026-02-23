import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { ClientService, Client } from '../../core/services/client.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [AsyncPipe, QRCodeComponent],
  templateUrl: './clients.html',
})
export class Clients implements OnInit {
  private clientService = inject(ClientService);
  
  clients$!: Observable<Client[]>;
  qrCodeUrl = '';

  ngOnInit() {
    this.clients$ = this.clientService.getClients();
    
    let hostname = window.location.hostname;
    // Si el QR se genera escaneando desde la PC usando "localhost", lo forzamos a usar la IP de red local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      hostname = '192.168.101.102';
    }
    
    const port = window.location.port ? ':' + window.location.port : '';
    this.qrCodeUrl = `${window.location.protocol}//${hostname}${port}/registro`;
  }
}
