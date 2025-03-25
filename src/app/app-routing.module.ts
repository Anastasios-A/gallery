import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
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
      import('./pages/photo/photo.component').then((m) => m.PhotoComponent),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // ✅ Use forRoot() here
  exports: [RouterModule], // ✅ Export RouterModule
})
export class AppRoutingModule {}
