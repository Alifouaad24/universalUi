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
        loadComponent: () => import('./Show-ShippingTaarefs/Show-ShippingTaarefs').then(m => m.ShowTariffsComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add',
        loadComponent: () => import('./Add-ShippingTaarefs/Add-ShippingTaarefs').then(m => m.AddEditTariffComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

