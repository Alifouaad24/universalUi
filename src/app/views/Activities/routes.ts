import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Activities'
    },
    children: [
      {
        path: '',
        redirectTo: 'activities',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-Activities/Show-Activities').then(m => m.ShowActivitiesComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-activity',
        loadComponent: () => import('./Add-Activity/Add-Activity').then(m => m.AddEditActivityComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

