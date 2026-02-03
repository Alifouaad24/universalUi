import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Items'
    },
    children: [
      {
        path: '',
        redirectTo: 'show-items',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-items/Show-items').then(m => m.ShowItemsComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-item',
        loadComponent: () => import('./Add-item/Add-item').then(m => m.AddEditItemComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

