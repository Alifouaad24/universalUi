import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Services'
    },
    children: [
      {
        path: '',
        redirectTo: 'services',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-services/Show-Services').then(m => m.ShowServicesComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-service',
        loadComponent: () => import('./Add-service/Add-service').then(m => m.AddEditServiceComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

