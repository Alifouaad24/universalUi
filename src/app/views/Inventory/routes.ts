import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Inventory'
    },
    children: [
      {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full'
      },
      {
        path: 'inventory',
        loadComponent: () => import('./Show-inventory/Show-inventory').then(m => m.ShowInventoryComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-activity',
        loadComponent: () => import('./Add-Activity/Add-Activity').then(m => m.AddEditActivityComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

