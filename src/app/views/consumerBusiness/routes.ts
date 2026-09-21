import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Consumers'
    },
    children: [
      {
        path: '',
        redirectTo: 'consumer-businesses',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-consumerBusiness/Show-consumerBusiness').then(m => m.ShowConsumersComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-new-supplier',
        loadComponent: () => import('./Add-Suppliers/Add-Supplier').then(m => m.AddEditSuppliersServicesComponent),
        data: {
          title: 'Add'
        }
      },
    ]
  }
];

