import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Categories'
    },
    children: [
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Show-Categories/Show-categories').then(m => m.ShowCategoriesComponent),
        data: {
          title: 'Show'
        }
      },
      {
        path: 'add-edit-Category',
        loadComponent: () => import('./Add-category/Add-categories').then(m => m.AddEditCategoryComponent),
        data: {
          title: 'Add/Edit'
        }
      },
    ]
  }
];

