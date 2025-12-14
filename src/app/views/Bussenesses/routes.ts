import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Businesses'
    },
    children: [
      {
        path: '',
        redirectTo: 'allBusenesses',
        pathMatch: 'full'
      },
      {
        path: 'allBusenesses',
        loadComponent: () => import('./Business.component').then(m => m.BusinessComponent),
        data: {
          title: 'allBusenesses'
        }
      },
      {
        path: 'add-edit-business',
        loadComponent: () => import('./AddEditBusines.component').then(m => m.AddEditBusniessComponent),
        data: {
          title: 'add-edit Busenesses'
        }
      }
    ]
  }
];

