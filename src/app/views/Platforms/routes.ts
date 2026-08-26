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
        redirectTo: 'platforms',
        pathMatch: 'full'
      },
      {
        path: 'platforms',
        loadComponent: () => import('./Show-Platforms/Show-platform').then(m => m.ShowplatformsComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-platform',
        loadComponent: () => import('./Add-Platform/Add-platform').then(m => m.AddEditplatformComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

