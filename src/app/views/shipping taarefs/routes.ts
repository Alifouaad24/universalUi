import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Shipping Taarefs'
    },
    children: [
      {
        path: '',
        redirectTo: 'shipping-taaref',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-ShippingTaarefs/Show-ShippingTaarefs').then(m => m.ShowCountriesComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add',
        loadComponent: () => import('./Add-ShippingTaarefs/Add-ShippingTaarefs').then(m => m.AddEditCountryComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

