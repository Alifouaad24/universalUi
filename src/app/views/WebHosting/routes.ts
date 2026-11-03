import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Request Web Hosting'
    },
    children: [
      {
        path: '',
        redirectTo: 'web-hosting',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-WebHostReq/Show-WebHostReq').then(m => m.ShowCategoriesComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-requestWebHosting',
        loadComponent: () => import('./requestWebHosting/Add-requestWebHosting').then(m => m.AddEditCategoryComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

