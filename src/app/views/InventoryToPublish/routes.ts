import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Publish Products'
    },
    children: [
      {
        path: '',
        redirectTo: 'publish',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-inventory/Show-inventory').then(m => m.ShowInventoryComponent),
        data: {
          title: 'Show'
        }
      },
    ]
  }
];

