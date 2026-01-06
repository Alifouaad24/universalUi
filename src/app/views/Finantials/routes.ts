import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Finantial items'
    },
    children: [
      {
        path: '',
        redirectTo: 'finantial',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-Finantial/Show-Finantial').then(m => m.ShowFinantialComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-finantial',
        loadComponent: () => import('./Add-Finantial/Add-Finantial').then(m => m.AddEditFinantialComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

