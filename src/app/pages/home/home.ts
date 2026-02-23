import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ClientService, Client } from '../../core/services/client.service';
import { Observable } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AsyncPipe, BaseChartDirective],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private clientService = inject(ClientService);
  clients$!: Observable<Client[]>;

  // Opciones del gráfico de Chart.js
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} Visitas`
        }
      }
    },
    scales: { x: { display: false }, y: { beginAtZero: true, ticks: { precision: 0 } } }
  };
  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Visitas', backgroundColor: '#e27533', borderRadius: 4 }
    ]
  };

  ngOnInit() {
    this.clients$ = this.clientService.getClients();
    
    // Suscribirse para llenar los datos del gráfico
    this.clients$.subscribe(clients => {
      // Tomar el top 5 clientes con más visitas
      const topClients = [...clients].sort((a,b) => b.visits - a.visits).slice(0, 5);
      
      this.barChartData = {
        labels: topClients.map(c => {
          if (c.name) return c.name.split(' ')[0]; // Tomar el primer nombre
          return c.email.split('@')[0];
        }),
        datasets: [
          { data: topClients.map(c => c.visits), label: 'Visitas', backgroundColor: '#e27533', hoverBackgroundColor: '#bf571d', borderRadius: 6 }
        ]
      };
    });
  }
}
