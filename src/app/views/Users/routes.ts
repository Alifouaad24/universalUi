import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Users'
    },
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-Users/Show-Users').then(m => m.ShowUsersComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-user',
        loadComponent: () => import('./Add-User/Add-User').then(m => m.AddEditUserComponent),
        data: {
          title: 'Add/Edit'
        }
      },
      {
        path: 'bind-user-to-business',
        loadComponent: () => import('./BindUserToBusiness/Bind-User-to-business').then(m => m.BindUserToBusinessComponent),
        data: {
          title: 'Bind User To Business'
        }
      },
    ]
  }
];

