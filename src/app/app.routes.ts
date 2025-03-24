import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites/favorites.component').then(
        (m) => m.FavoritesComponent
      ),
  },
  {
    path: 'photos/:id',
    loadComponent: () =>
      import('./pages/photo/photo.component').then(
        (m) => m.PhotoComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
