import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Tech Info'
    },
    children: [
      {
        path: '',
        redirectTo: 'tech-info',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-TechInfo/Show-TechInfo').then(m => m.ShowTechInfoComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-tech-Info',
        loadComponent: () => import('./Add-TechInfo/Add-TechInfo').then(m => m.AddEditTechInfoComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

