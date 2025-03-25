import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites.service';
import { PhotoCardComponent } from '../../shared/components/photo-card/photo-card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    RouterModule,
    MatGridListModule,
    PhotoCardComponent,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent {
  favoritesService = inject(FavoritesService);
  favorites$ = this.favoritesService.favorites$;

  trackByPhotoId(_: number, photo: { id: string }) {
    return photo.id;
  }
}
