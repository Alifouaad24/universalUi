import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Inventory List'
    },
    children: [
      {
        path: '',
        redirectTo: 'inventory-list',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-inventory/Show-inventory').then(m => m.ShowInventoryComponent),
        data: {
          title: 'Show'
        }
      },
    ]
  }
];

