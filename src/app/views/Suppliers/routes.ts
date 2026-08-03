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
        redirectTo: 'suppliers',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-Suppliers/Show-Suppliers').then(m => m.ShowSuppliersComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-supplier',
        loadComponent: () => import('./Add-Suppliers/Add-Supplier').then(m => m.AddEditBusinessTypeComponent),
        data: {
          title: 'Add'
        }
      },
    ]
  }
];

