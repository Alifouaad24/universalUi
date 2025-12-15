import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Countries'
    },
    children: [
      {
        path: '',
        redirectTo: 'countries',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-Countries/Show-Countries').then(m => m.ShowCountriesComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-country',
        loadComponent: () => import('./Add-country/Add-country').then(m => m.AddEditCountryComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

