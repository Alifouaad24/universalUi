import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Scrape'
    },
    children: [
      {
        path: '',
        redirectTo: 'scraper',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () => import('./Scrape-item/scrape-item').then(m => m.ScrapeItemComponent),
        data: {
          title: 'Scrape item'
        }
      }
    ]
  }
];

