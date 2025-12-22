import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Features'
    },
    children: [
      {
        path: '',
        redirectTo: 'features',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-Features/Show-Features').then(m => m.ShowFeaturesComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-feature',
        loadComponent: () => import('./Add-Feature/Add-Feature').then(m => m.AddEditFeatureComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

