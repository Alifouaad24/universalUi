import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Roles Management'
    },
    children: [
      {
        path: '',
        redirectTo: 'roles',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-Roles-types/Show-Roles-types').then(m => m.ShowRolesComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-role',
        loadComponent: () => import('./Add-Role-type/Add-Role').then(m => m.AddEditBusinessTypeComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

