import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Roles Management'
    },
    children: [
      {
        path: '',
        redirectTo: 'roles',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-Causes/Show-Causes-types').then(m => m.ShowCausesComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-cause',
        loadComponent: () => import('./Add-Causes/Add-Causes').then(m => m.AddCausesComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

