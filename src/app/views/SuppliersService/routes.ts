import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Suppliers'
    },
    children: [
      {
        path: '',
        redirectTo: 'suppliers-services',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-Suppliers/Show-Suppliers').then(m => m.ShowSuppliersServicessComponent),
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

