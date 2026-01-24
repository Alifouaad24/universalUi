import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Album'
    },
    children: [
      {
        path: '',
        redirectTo: 'album',
        pathMatch: 'full'
      },
      {
        path: 'album',
        loadComponent: () => import('./ShowAlbum.component').then(m => m.ShowAlbumComponent),
        data: {
          title: 'Album'
        }
      },
      // {
      //   path: 'add-edit-Address',
      //   loadComponent: () => import('./AddEditAddress.component').then(m => m.AddEditAddressComponent),
      //   data: {
      //     title: 'add-edit Address'
      //   }
      // }
    ]
  }
];

