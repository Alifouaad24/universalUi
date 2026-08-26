import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Active List'
    },
    children: [
      {
        path: '',
        redirectTo: 'active-list',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-inventory/Show-inventory').then(m => m.ShowInventoryComponent),
        data: {
          title: 'Active List'
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

