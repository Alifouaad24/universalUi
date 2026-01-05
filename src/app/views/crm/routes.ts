import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Customers manager'
    },
    children: [
      {
        path: '',
        redirectTo: 'crm',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./search-Add-customer/Add-search-customer').then(m => m.SearchAddCustomerComponent),
        data: {
          title: 'Search about & Add customer'
        }
      },
      {
        path: 'show-customers',
        loadComponent: () => import('./Show-Customers/Show-Customers').then(m => m.ShowCustomersComponent),
        data: {
          title: 'Show Customers'
        }
      },
      {
        path: 'show-add-note',
        loadComponent: () => import('./Customers-notes/Show-Add-notes').then(m => m.CustomersNotesComponent),
        data: {
          title: 'Customers notes'
        }
      },
    ]
  }
];

