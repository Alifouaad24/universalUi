import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Busniess types'
    },
    children: [
      {
        path: '',
        redirectTo: 'business-types',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-business-types/Show-business-types').then(m => m.ShowBusinessTypesComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-business-types',
        loadComponent: () => import('./Add-business-type/Add-business-type').then(m => m.AddEditBusinessTypeComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

