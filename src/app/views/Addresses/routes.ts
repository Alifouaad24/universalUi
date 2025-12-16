import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Addresses'
    },
    children: [
      {
        path: '',
        redirectTo: 'allAddresses',
        pathMatch: 'full'
      },
      {
        path: 'allAddresses',
        loadComponent: () => import('./ShowAddresses.component').then(m => m.ShowAddressesComponent),
        data: {
          title: 'allAddresses'
        }
      },
      {
        path: 'add-edit-Address',
        loadComponent: () => import('./AddEditAddress.component').then(m => m.AddEditAddressComponent),
        data: {
          title: 'add-edit Address'
        }
      }
    ]
  }
];

