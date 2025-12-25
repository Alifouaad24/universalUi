import { Routes } from '@angular/router';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'Home',
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    canActivate: [AuthGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'business',
        loadChildren: () => import('./views/Bussenesses/routes').then((m) => m.routes)
      },
      {
        path: 'roles',
        loadChildren: () => import('./views/Roles/routes').then((m) => m.routes)
      },
      {
        path: 'users',
        loadChildren: () => import('./views/Users/routes').then((m) => m.routes)
      },
      {
        path: 'features',
        loadChildren: () => import('./views/Features/routes').then((m) => m.routes)
      },
      {
        path: 'business-types',
        loadChildren: () => import('./views/BusinessType/routes').then((m) => m.routes)
      },
      {
        path: 'allAddresses',
        loadChildren: () => import('./views/Addresses/routes').then((m) => m.routes)
      },
      {
        path: 'countries',
        loadChildren: () => import('./views/countries/routes').then((m) => m.routes)
      },
      {
        path: 'services',
        loadChildren: () => import('./views/Services/routes').then((m) => m.routes)
      },
      {
        path: 'activities',
        loadChildren: () => import('./views/Activities/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/BusinessType/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
 
  { path: '**', redirectTo: 'dashboard' }
];
