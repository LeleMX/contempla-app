import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DecimalPipe, KeyValuePipe } from '@angular/common';
import { MenuService, MenuItem } from '../../core/services/menu';
import { Observable, map } from 'rxjs';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-menu-public',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, KeyValuePipe, Footer],
  templateUrl: './menu-public.html'
})
export class MenuPublic implements OnInit {
  private menuService = inject(MenuService);
  
  // Agrupar items por categoría
  menuGrouped$!: Observable<Record<string, MenuItem[]>>;

  ngOnInit() {
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
}
