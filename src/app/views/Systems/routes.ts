import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Systems'
    },
    children: [
      {
        path: '',
        redirectTo: 'systems',
        pathMatch: 'full'
      },
      {
        path: 'systems',
        loadComponent: () => import('./Show-systems/Show-systems').then(m => m.ShowSystemsComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-system',
        loadComponent: () => import('./Add-system/Add-system').then(m => m.AddEditSystemComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

