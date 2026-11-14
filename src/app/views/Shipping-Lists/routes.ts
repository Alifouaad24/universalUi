import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Shipping List'
    },
    children: [
      {
        path: '',
        redirectTo: 'shipping-lists',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-Shipping-Lists/Show-Shipping-Lists').then(m => m.ShowShippingListComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-shipping-list',
        loadComponent: () => import('./Add-Shipping-List/Add-Shipping-Lists').then(m => m.AddEditShippingListComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

