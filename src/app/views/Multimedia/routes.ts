import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Multimedia'
    },
    children: [
      {
        path: '',
        redirectTo: 'multimedia',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-Multimedia/ShowMultimedia').then(m => m.ShowMultimediaComponent),
        data: {
          title: 'Show'
        }
      },
    ]
  }
];

