import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Logistics'
    },
    children: [
      {
        path: '',
        redirectTo: 'Shipping Types',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show/Show-SippingTypes').then(m => m.ShippingTypesComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'shipping-costs',
        loadComponent: () => import('./ShippingCosts/ShippingCost').then(m => m.ShippingCostComponent),
        data: {
          title: 'shipping Costs'
        }
      },
      {
        path: 'add',
        loadComponent: () => import('./AddShippingCosts/AddShippingCost').then(m => m.AddShippingCostComponent),
        data: {
          title: 'Add-Edit'
        }
      },
    ]
  }
];

