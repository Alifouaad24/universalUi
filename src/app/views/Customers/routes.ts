import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Customers'
    },
    children: [
      {
        path: '',
        redirectTo: 'customers',
        pathMatch: 'full'
      },
      {
        path: 'customers',
        loadComponent: () => import('./Show-Customers/Show-Customers').then(m => m.ShowCustomersComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-customer',
        loadComponent: () => import('./Add-Customer/Add-Customer').then(m => m.AddEditCustomerComponent),
        data: {
          title: 'Add/Edit'
        }
      },
      // {
      //   path: 'bind-user-to-business',
      //   loadComponent: () => import('./BindUserToBusiness/Bind-User-to-business').then(m => m.BindUserToBusinessComponent),
      //   data: {
      //     title: 'Bind User To Business'
      //   }
      // },
    ]
  }
];

